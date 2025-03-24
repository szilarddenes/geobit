#!/usr/bin/env node
const { execSync, spawn } = require('child_process');
const path = require('path');

// Simple console colors
const colors = {
    reset: '\x1b[0m',
    red: '\x1b[31m',
    green: '\x1b[32m',
    yellow: '\x1b[33m',
    cyan: '\x1b[36m'
};

// Print helper
function print(message, color = colors.reset) {
    console.log(`${color}${message}${colors.reset}`);
}

// Kill existing Firebase processes
function killFirebaseProcesses() {
    try {
        if (process.platform === 'win32') {
            execSync('taskkill /F /IM java.exe /FI "WINDOWTITLE eq Firebase*"', { stdio: 'ignore' });
            execSync('taskkill /F /IM node.exe /FI "WINDOWTITLE eq *firebase*"', { stdio: 'ignore' });
        } else {
            execSync('pkill -f "java.*firebase" || true', { stdio: 'ignore' });
            execSync('pkill -f "node.*firebase" || true', { stdio: 'ignore' });
            execSync('pkill -f "java.*emulator" || true', { stdio: 'ignore' });
        }
        print('Cleaned up existing Firebase processes', colors.green);
    } catch (error) {
        // Ignore errors - processes might not exist
    }
}

// Start Firebase emulators
async function startEmulators() {
    print('\n===== Starting Firebase Emulators =====\n', colors.cyan);

    // Set environment variables
    const env = {
        ...process.env,
        FIREBASE_EMULATORS_PATH: path.join(process.cwd(), '.firebase'),
        FIREBASE_EMULATORS_NO_VERSION_CHECK: 'true',
        FORCE_COLOR: '1'
    };

    // Start emulators
    const emulatorsProcess = spawn('npx', ['firebase', 'emulators:start'], {
        stdio: 'inherit',
        shell: true,
        env
    });

    // Simple delay to let emulators start
    await new Promise(resolve => setTimeout(resolve, 10000));

    return emulatorsProcess;
}

// Create test admin user
async function createTestAdmin() {
    print('\n===== Creating Test Admin User =====\n', colors.cyan);

    try {
        execSync('node scripts/create-test-admin.js', { stdio: 'inherit' });
        print('Test admin user created successfully', colors.green);
    } catch (error) {
        print('Failed to create test admin user - you may need to create one manually', colors.yellow);
    }
}

// Start Next.js development server
function startNextDev() {
    print('\n===== Starting Next.js Development Server =====\n', colors.cyan);

    const env = {
        ...process.env,
        NEXT_PUBLIC_USE_FIREBASE_EMULATORS: 'true',
        NEXT_PUBLIC_FIRESTORE_EMULATOR_HOST: 'localhost:8080',
        NEXT_PUBLIC_FIREBASE_AUTH_EMULATOR_HOST: 'localhost:9099',
        NEXT_PUBLIC_FIREBASE_FUNCTIONS_EMULATOR_HOST: 'localhost:5001'
    };

    return spawn('next', ['dev'], {
        stdio: 'inherit',
        shell: true,
        env
    });
}

// Main function
async function main() {
    print('GeoBit Development Environment', colors.green);
    print('------------------------------\n');

    try {
        // Clean up existing processes
        killFirebaseProcesses();

        // Start emulators
        print('Starting emulators - this may take a minute...', colors.yellow);
        const emulatorProcess = await startEmulators();

        // Create test admin user
        await createTestAdmin();

        // Start Next.js development server
        const nextProcess = startNextDev();

        // Handle shutdown
        const cleanup = () => {
            print('\nShutting down...', colors.yellow);
            nextProcess.kill();
            if (emulatorProcess) emulatorProcess.kill();
            killFirebaseProcesses();
            process.exit(0);
        };

        process.on('SIGINT', cleanup);
        process.on('SIGTERM', cleanup);

    } catch (error) {
        print(`Error: ${error.message}`, colors.red);
        process.exit(1);
    }
}

// Run
main(); 