const { spawn } = require('child_process');
const path = require('path');

// Colors for console output
const colors = {
    reset: '\x1b[0m',
    bright: '\x1b[1m',
    dim: '\x1b[2m',
    red: '\x1b[31m',
    green: '\x1b[32m',
    yellow: '\x1b[33m',
    blue: '\x1b[34m',
    magenta: '\x1b[35m',
    cyan: '\x1b[36m',
};

// Log with prefix and color
function log(prefix, message, color = colors.reset) {
    console.log(`${color}[${prefix}]${colors.reset} ${message}`);
}

// Start a process and return a promise that resolves when it's ready
function startProcess(command, args, name, readyMessage, color) {
    return new Promise((resolve, reject) => {
        log(name, `Starting: ${command} ${args.join(' ')}`, color);

        const proc = spawn(command, args, {
            stdio: 'pipe',
            shell: true
        });

        let ready = false;
        let buffer = '';

        // For Firebase emulators, add multiple possible ready patterns
        const emulatorReadyPatterns = [
            '✔  All emulators ready!',
            'All emulators ready!',
            'Emulator Hub running at',
            'Emulator Hub host:'
        ];

        proc.stdout.on('data', (data) => {
            const output = data.toString();
            log(name, output.trim(), color);

            // Add to buffer and keep last 2000 characters
            buffer += output;
            if (buffer.length > 2000) {
                buffer = buffer.slice(buffer.length - 2000);
            }

            // Check if the specific ready message is included
            let isReady = buffer.includes(readyMessage);

            // For emulators, check for any of the patterns
            if (name === 'EMULATORS' && !isReady) {
                isReady = emulatorReadyPatterns.some(pattern => buffer.includes(pattern));
            }

            if (!ready && isReady) {
                ready = true;
                log(name, 'READY!', colors.green + colors.bright);

                if (name === 'EMULATORS') {
                    // Additional wait for emulators to fully initialize services
                    log(name, 'Waiting 10 seconds for emulators to stabilize...', color);
                    setTimeout(() => resolve(proc), 10000);
                } else {
                    resolve(proc);
                }
            }
        });

        proc.stderr.on('data', (data) => {
            log(name, data.toString().trim(), colors.red);
        });

        proc.on('error', (error) => {
            log(name, `Failed to start: ${error.message}`, colors.red + colors.bright);
            reject(error);
        });

        proc.on('close', (code) => {
            if (!ready) {
                reject(new Error(`Process exited with code ${code} before becoming ready`));
            }
            log(name, `Process exited with code ${code}`, colors.yellow);
        });

        // Set a timeout in case the ready message is never detected
        setTimeout(() => {
            if (!ready) {
                ready = true;
                log(name, 'Timed out waiting for ready message, continuing anyway...', colors.yellow);
                resolve(proc);
            }
        }, 30000); // 30 second timeout instead of 10
    });
}

// Wait for emulator endpoints to be responsive
async function waitForEmulators() {
    const axios = require('axios');
    const MAX_RETRIES = 10;
    const RETRY_DELAY = 3000;

    const emulators = [
        { name: 'Auth', url: 'http://127.0.0.1:9099/' },
        { name: 'Firestore', url: 'http://127.0.0.1:8080/' }
    ];

    log('MAIN', 'Waiting for emulators to be responsive...', colors.magenta);

    for (let retry = 0; retry < MAX_RETRIES; retry++) {
        let allReady = true;

        for (const { name, url } of emulators) {
            try {
                await axios.get(url, { timeout: 2000 });
                log('MAIN', `✅ ${name} emulator is responsive`, colors.green);
            } catch (error) {
                log('MAIN', `⏳ ${name} emulator not responsive yet (attempt ${retry + 1}/${MAX_RETRIES})`, colors.yellow);
                allReady = false;
            }
        }

        if (allReady) {
            log('MAIN', '✅ All emulators are responsive!', colors.green + colors.bright);
            return true;
        }

        // If not all ready, wait and retry
        if (retry < MAX_RETRIES - 1) {
            log('MAIN', `Waiting ${RETRY_DELAY / 1000} seconds before retrying...`, colors.yellow);
            await new Promise(resolve => setTimeout(resolve, RETRY_DELAY));
        }
    }

    log('MAIN', '⚠️ Timed out waiting for emulators to be responsive', colors.yellow);
    return false;
}

// Main function to start all processes
async function main() {
    console.log('\n=== Starting GeoBit Development Environment ===\n');

    // Track all child processes to clean up on exit
    const processes = [];

    // Handle cleanup on exit
    process.on('SIGINT', () => {
        log('MAIN', 'Shutting down all processes...', colors.yellow);
        processes.forEach(proc => {
            try {
                proc.kill();
            } catch (e) {
                // Ignore errors when killing processes
            }
        });
        process.exit(0);
    });

    try {
        // Start Firebase emulators - includes an internal 10 second wait for stabilization
        const emulatorsProcess = await startProcess(
            'npm',
            ['run', 'emulators'],
            'EMULATORS',
            '✔  All emulators ready!', // This is just a starting point, we check multiple patterns
            colors.cyan
        );
        processes.push(emulatorsProcess);

        // Wait for emulators to be responsive via HTTP endpoints
        await waitForEmulators();

        // Create test admin user
        log('MAIN', 'Creating test admin user...', colors.magenta);
        let adminUserCreated = false;
        let attempts = 0;

        while (!adminUserCreated && attempts < 3) {
            attempts++;
            log('MAIN', `Attempt ${attempts} to create test admin user`, colors.magenta);

            const createAdminProcess = spawn('node', ['scripts/create-test-admin.js'], {
                stdio: 'inherit',
                shell: true
            });

            // Wait for the create-admin script to complete
            const exitCode = await new Promise(resolve => {
                createAdminProcess.on('close', code => resolve(code));
            });

            if (exitCode === 0) {
                adminUserCreated = true;
                log('MAIN', '✅ Test admin user created successfully!', colors.green + colors.bright);
            } else {
                log('MAIN', `⚠️ Failed to create test admin user (attempt ${attempts}/3)`, colors.yellow);
                if (attempts < 3) {
                    log('MAIN', 'Waiting 5 seconds before retrying...', colors.yellow);
                    await new Promise(resolve => setTimeout(resolve, 5000));
                }
            }
        }

        // Start Next.js dev server with emulator config
        const nextProcess = await startProcess(
            'npm',
            ['run', 'dev:emu'],
            'NEXT.JS',
            'ready started server',
            colors.green
        );
        processes.push(nextProcess);

        log('MAIN', 'All services are running!', colors.green + colors.bright);
        log('MAIN', 'Test admin user credentials:', colors.yellow);
        log('MAIN', '  Email: test@test.test', colors.yellow);
        log('MAIN', '  Password: testtest', colors.yellow);
        log('MAIN', '', colors.reset);
        log('MAIN', 'Press Ctrl+C to stop all services', colors.reset);

    } catch (error) {
        log('MAIN', `Error: ${error.message}`, colors.red + colors.bright);
        processes.forEach(proc => {
            try {
                proc.kill();
            } catch (e) {
                // Ignore errors when killing processes
            }
        });
        process.exit(1);
    }
}

// Run the main function
main(); 