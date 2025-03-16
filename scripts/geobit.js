#!/usr/bin/env node
const { execSync, spawn } = require('child_process');
const readline = require('readline');
const path = require('path');
const fs = require('fs');
const http = require('http');

// Configure colors for output
const colors = {
    reset: '\x1b[0m',
    red: '\x1b[31m',
    green: '\x1b[32m',
    yellow: '\x1b[33m',
    blue: '\x1b[34m',
    magenta: '\x1b[35m',
    cyan: '\x1b[36m',
    bold: '\x1b[1m'
};

// Function to print a styled message
function print(message, color = colors.reset) {
    console.log(`${color}${message}${colors.reset}`);
}

// Function to print a section header
function printHeader(message) {
    console.log('\n' + colors.bold + colors.cyan + '===== ' + message + ' =====' + colors.reset + '\n');
}

// Default emulator ports
const EMULATOR_PORTS = {
    firestore: 8080,
    auth: 9099,
    functions: 5001,
    database: 9000,
    hosting: 5050,
    ui: 4000
};

// Function to check if a port is open with TCP
function checkPort(port) {
    return new Promise((resolve) => {
        const socket = new http.Socket();
        socket.setTimeout(1000); // 1 second timeout

        socket.on('connect', () => {
            socket.destroy();
            resolve(true);
        });

        socket.on('timeout', () => {
            socket.destroy();
            resolve(false);
        });

        socket.on('error', () => {
            socket.destroy();
            resolve(false);
        });

        socket.connect(port, 'localhost');
    });
}

// More aggressive check if a port is in use
function isPortInUse(port) {
    try {
        // Different command for macOS/Linux vs Windows
        if (process.platform === 'win32') {
            const output = execSync(`netstat -ano | findstr :${port}`, { encoding: 'utf8' });
            return output.trim().length > 0;
        } else {
            const output = execSync(`lsof -i:${port} -t`, { encoding: 'utf8' });
            return output.trim().length > 0;
        }
    } catch (error) {
        // If the command fails, likely no process is using the port
        return false;
    }
}

// Function to kill process using a specific port - more aggressively
function killProcessOnPort(port) {
    try {
        // Different command for macOS/Linux vs Windows
        if (process.platform === 'win32') {
            // Find PIDs using the port on Windows
            const output = execSync(`netstat -ano | findstr :${port}`, { encoding: 'utf8' });
            const lines = output.trim().split('\n');

            for (const line of lines) {
                const parts = line.trim().split(/\s+/);
                if (parts.length > 4) {
                    const pid = parts[parts.length - 1];
                    try {
                        print(`Killing Windows process ${pid} using port ${port}`, colors.yellow);
                        execSync(`taskkill /F /PID ${pid}`, { stdio: 'ignore' });
                    } catch (killError) {
                        print(`Failed to kill Windows process ${pid}: ${killError.message}`, colors.red);
                    }
                }
            }
            return true;
        } else {
            // On macOS/Linux
            const pids = execSync(`lsof -ti:${port}`, { encoding: 'utf8' }).trim().split('\n');

            if (pids.length === 0 || (pids.length === 1 && pids[0] === '')) {
                return false;
            }

            for (const pid of pids) {
                if (pid) {
                    print(`Killing process ${pid} using port ${port}`, colors.yellow);
                    try {
                        // Force kill
                        execSync(`kill -9 ${pid}`, { stdio: 'ignore' });
                    } catch (killError) {
                        print(`Failed to kill process ${pid}: ${killError.message}`, colors.red);
                    }
                }
            }
            return true;
        }
    } catch (error) {
        // No process found or unable to kill
        return false;
    }
}

// Kill all Firebase related processes
function killAllFirebaseProcesses() {
    try {
        if (process.platform === 'win32') {
            // Find and kill all Firebase emulator Java processes on Windows
            execSync('taskkill /F /IM java.exe /FI "WINDOWTITLE eq Firebase*"', { stdio: 'ignore' });
            // Kill all node processes running Firebase
            execSync('taskkill /F /IM node.exe /FI "WINDOWTITLE eq *firebase*"', { stdio: 'ignore' });
        } else {
            // On macOS/Linux, kill all Java processes related to Firebase
            execSync('pkill -f "java.*firebase" || true', { stdio: 'ignore' });
            // Kill all Node.js processes related to Firebase
            execSync('pkill -f "node.*firebase" || true', { stdio: 'ignore' });
            // Kill all java processes that might be running emulators
            execSync('pkill -f "java.*emulator" || true', { stdio: 'ignore' });
            // Kill Firebase UI process
            execSync('pkill -f "npm.*firebase" || true', { stdio: 'ignore' });
        }
        print('Killed all Firebase related processes', colors.green);
    } catch (error) {
        // Ignore errors - processes might not exist
        print('No Firebase processes found to kill', colors.yellow);
    }
}

// Kill processes using emulator ports and forcefully terminate all Firebase processes
function killEmulatorProcesses() {
    printHeader('Forcefully Cleaning Up All Emulator Processes');

    // First, try to kill by port - this is most reliable
    const killedPorts = [];

    for (const [name, port] of Object.entries(EMULATOR_PORTS)) {
        if (isPortInUse(port)) {
            if (killProcessOnPort(port)) {
                killedPorts.push(`${name} (port ${port})`);
            } else {
                print(`Warning: Port ${port} is in use but could not identify the process`, colors.yellow);
            }

            // Double-check the port is now free
            if (isPortInUse(port)) {
                print(`WARNING: Port ${port} is still in use after cleanup attempt!`, colors.red);
            }
        }
    }

    if (killedPorts.length > 0) {
        print(`Killed processes using ports: ${killedPorts.join(', ')}`, colors.green);
    } else {
        print('No processes found using emulator ports', colors.green);
    }

    // Additionally, try to kill all Firebase-related processes by name
    killAllFirebaseProcesses();

    // Give the system time to release the ports (longer timeout)
    print('Waiting for ports to be fully released...', colors.yellow);
    return new Promise(resolve => setTimeout(resolve, 5000));
}

// Start the emulators one by one to ensure they all start properly
async function startEmulatorsIndividually() {
    printHeader('Starting Firebase Emulators (Individual Mode)');

    // Define the emulators to start in sequence
    const emulatorSequence = [
        { name: 'Auth', args: ['firebase', 'emulators:start', '--only', 'auth'] },
        { name: 'Firestore', args: ['firebase', 'emulators:start', '--only', 'firestore'] },
        { name: 'Functions', args: ['firebase', 'emulators:start', '--only', 'functions'] },
        { name: 'Database', args: ['firebase', 'emulators:start', '--only', 'database'] },
    ];

    // Start each emulator and verify it's running
    for (const emulator of emulatorSequence) {
        print(`Starting ${emulator.name} emulator...`, colors.cyan);

        try {
            // Start the emulator
            execSync(`npx ${emulator.args.join(' ')}`, {
                stdio: 'inherit',
                timeout: 10000  // 10 second timeout
            });

            print(`${emulator.name} emulator started successfully`, colors.green);
        } catch (error) {
            print(`Failed to start ${emulator.name} emulator: ${error.message}`, colors.red);
        }
    }

    return true;
}

// Start the emulators with careful handling of Node.js version compatibility
async function startEmulators() {
    printHeader('Starting Firebase Emulators');

    // Create a custom environment with compatibility flags
    const env = {
        ...process.env,
        FIREBASE_EMULATORS_NO_VERSION_CHECK: 'true',  // Skip version check
        FORCE_COLOR: '1'  // Force color output
    };

    // Clean up any Firebase emulator lock files
    try {
        if (fs.existsSync('./.firebase')) {
            print('Cleaning up Firebase lock files...', colors.yellow);
            if (process.platform === 'win32') {
                execSync('del /q /s .firebase\\*.lock 2>nul', { stdio: 'ignore' });
            } else {
                execSync('find ./.firebase -name "*.lock" -delete', { stdio: 'ignore' });
            }
        }
    } catch (error) {
        // Ignore errors
    }

    // Start only essential emulators
    print('Starting Firebase Auth, Firestore, Functions and Database emulators...', colors.yellow);

    const emulatorsProcess = spawn('npx', ['firebase', 'emulators:start', '--only', 'auth,firestore,functions,database'], {
        stdio: 'inherit',
        shell: true,
        env
    });

    // Handle emulator process errors
    emulatorsProcess.on('error', (err) => {
        print(`Error starting emulators: ${err.message}`, colors.red);
    });

    // Promise to check emulator readiness
    return new Promise((resolve, reject) => {
        // Use a 45-second timeout for emulator startup
        const timeoutDuration = 45000;
        print(`Waiting up to ${timeoutDuration / 1000} seconds for emulators to start...`, colors.yellow);

        // Function to check if the essential emulators are running
        const checkEmulatorsRunning = async () => {
            try {
                const result = {
                    auth: await checkPort(EMULATOR_PORTS.auth),
                    firestore: await checkPort(EMULATOR_PORTS.firestore),
                    functions: await checkPort(EMULATOR_PORTS.functions),
                    database: await checkPort(EMULATOR_PORTS.database)
                };

                const runningEmulators = Object.entries(result)
                    .filter(([_, isRunning]) => isRunning)
                    .map(([name]) => name);

                const notRunningEmulators = Object.entries(result)
                    .filter(([_, isRunning]) => !isRunning)
                    .map(([name]) => name);

                return {
                    allRunning: notRunningEmulators.length === 0,
                    runningEmulators,
                    notRunningEmulators
                };
            } catch (error) {
                print(`Error checking emulators: ${error.message}`, colors.red);
                return { allRunning: false, runningEmulators: [], notRunningEmulators: ['all'] };
            }
        };

        // Check periodically until timeout
        let elapsed = 0;
        const interval = 5000; // Check every 5 seconds

        const checkInterval = setInterval(async () => {
            elapsed += interval;

            const status = await checkEmulatorsRunning();

            if (status.allRunning) {
                clearInterval(checkInterval);
                print('All essential emulators are running!', colors.green);
                resolve(emulatorsProcess);
            } else if (elapsed >= timeoutDuration) {
                clearInterval(checkInterval);

                if (status.runningEmulators.length > 0) {
                    print(`Some emulators started: ${status.runningEmulators.join(', ')}`, colors.yellow);
                    print(`Not running: ${status.notRunningEmulators.join(', ')}`, colors.red);
                    print('Continuing with partial setup - some features may not work', colors.yellow);
                    resolve(emulatorsProcess);
                } else {
                    print('No emulators started within the timeout period', colors.red);

                    // Try individual mode as a last resort
                    print('Attempting to start emulators individually as a last resort...', colors.yellow);
                    emulatorsProcess.kill();

                    try {
                        await startEmulatorsIndividually();
                        resolve(null); // Return null as we don't have a single process to track
                    } catch (error) {
                        print(`Failed to start emulators individually: ${error.message}`, colors.red);
                        reject(new Error('Failed to start Firebase emulators'));
                    }
                }
            } else {
                print(`Waiting for emulators: ${status.notRunningEmulators.join(', ')}...`, colors.yellow);
            }
        }, interval);
    });
}

// Create a test admin user
function createTestAdmin() {
    printHeader('Creating Test Admin User');

    try {
        execSync('node scripts/create-test-admin.js', { stdio: 'inherit', timeout: 10000 });
        print('Test admin user created successfully', colors.green);
        return true;
    } catch (error) {
        print(`Failed to create test admin user: ${error.message}`, colors.red);
        print('Continuing anyway - you may need to create an admin user manually', colors.yellow);
        return false;
    }
}

// Start the Next.js development server
function startNextDev() {
    printHeader('Starting Next.js Development Server');

    // Set the Firebase emulator environment variables explicitly
    const env = {
        ...process.env,
        NEXT_PUBLIC_USE_FIREBASE_EMULATORS: 'true',
        NEXT_PUBLIC_FIRESTORE_EMULATOR_HOST: 'localhost:8080',
        NEXT_PUBLIC_FIREBASE_AUTH_EMULATOR_HOST: 'localhost:9099',
        NEXT_PUBLIC_FIREBASE_DATABASE_EMULATOR_HOST: 'localhost:9000',
        NEXT_PUBLIC_FIREBASE_FUNCTIONS_EMULATOR_HOST: 'localhost:5001'
    };

    const nextProcess = spawn('next', ['dev'], {
        stdio: 'inherit',
        shell: true,
        env
    });

    nextProcess.on('error', (err) => {
        print(`Failed to start Next.js dev server: ${err.message}`, colors.red);
    });

    return nextProcess;
}

// Main function to orchestrate the startup process
async function main() {
    print('GeoBit Development Environment', colors.bold + colors.green);
    print('------------------------------\n');

    try {
        // Kill any existing emulator processes
        await killEmulatorProcesses();

        // Verify all ports are free now
        let allPortsFree = true;
        for (const [name, port] of Object.entries(EMULATOR_PORTS)) {
            if (isPortInUse(port)) {
                print(`ERROR: Port ${port} for ${name} is still in use after cleanup!`, colors.red);
                print(`Try manually running: sudo lsof -i:${port} -t | xargs kill -9`, colors.yellow);
                allPortsFree = false;
            }
        }

        if (!allPortsFree) {
            print('Some ports are still in use. Try to free them manually or restart your computer.', colors.red);
            return;
        }

        // Start emulators
        print('Starting emulators - this may take a minute...', colors.yellow);
        const emulatorProcess = await startEmulators();

        // Create test admin user
        await createTestAdmin();

        // Start Next.js development server
        const nextProcess = startNextDev();

        // Handle clean shutdown
        const cleanup = () => {
            print('\nShutting down...', colors.yellow);

            try {
                nextProcess.kill();
                if (emulatorProcess) emulatorProcess.kill();

                // Additionally clean up any remaining processes
                killAllFirebaseProcesses();
            } catch (error) {
                // Ignore errors during shutdown
            }

            process.exit(0);
        };

        // Listen for termination signals
        process.on('SIGINT', cleanup);
        process.on('SIGTERM', cleanup);

    } catch (error) {
        print(`Error starting development environment: ${error.message}`, colors.red);
        process.exit(1);
    }
}

// Run the main function
main(); 