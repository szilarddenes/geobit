// Simple script to check if Firebase emulators are accessible
const http = require('http');

const checkEmulator = (name, host, port) => {
    return new Promise((resolve) => {
        const req = http.get(`http://${host}:${port}`, (res) => {
            console.log(`✅ ${name} emulator is running at ${host}:${port} (status: ${res.statusCode})`);
            resolve(true);
        });

        req.on('error', (err) => {
            console.error(`❌ ${name} emulator not accessible at ${host}:${port}: ${err.message}`);
            resolve(false);
        });

        req.setTimeout(2000, () => {
            req.destroy();
            console.error(`❌ ${name} emulator timed out at ${host}:${port}`);
            resolve(false);
        });
    });
};

async function main() {
    console.log('Checking Firebase emulators...');

    const emulators = [
        { name: 'Auth', host: '127.0.0.1', port: 9099 },
        { name: 'Firestore', host: '127.0.0.1', port: 8080 },
        { name: 'Functions', host: '127.0.0.1', port: 5001 },
        { name: 'Database', host: '127.0.0.1', port: 9000 },
        { name: 'Hosting', host: '127.0.0.1', port: 5005 },
        { name: 'UI', host: '127.0.0.1', port: 4000 }
    ];

    const results = await Promise.all(
        emulators.map(({ name, host, port }) => checkEmulator(name, host, port))
    );

    // Check if UI emulator is running
    const uiEmulator = emulators.find(e => e.name === 'UI');
    const uiIndex = emulators.indexOf(uiEmulator);
    const isUiRunning = results[uiIndex];

    if (isUiRunning) {
        console.log('\n✅ Firebase Emulator UI is running!');
        console.log('Firebase Emulator UI: http://127.0.0.1:4000');
    } else {
        console.log('⚠️ Firebase Emulator UI is not accessible. Please start the Firebase emulators with:');
        console.log('   npm run emulators');
    }
}

main(); 