#!/bin/bash

# Exit on error
set -e

# Function to clean up on exit
cleanup() {
  echo "Shutting down emulators..."
  pkill -f "firebase emulators" || true
  echo "Done."
}

# Set up the trap to clean up on exit
trap cleanup EXIT

# Clear any terminal logs
echo -e "\033[2J\033[H"
echo "=== Starting GeoBit Development Environment ==="
echo ""

# Start the emulators
echo "Starting Firebase emulators..."
firebase emulators:start > emulators.log 2>&1 &
EMULATOR_PID=$!

# Wait for emulators to start
echo "Waiting for emulators to initialize..."
sleep 15  # Adjust this time based on your system's speed

# Check if emulators are running
if ! ps -p $EMULATOR_PID > /dev/null; then
  echo "Error: Firebase emulators failed to start"
  echo "Check emulators.log for details"
  exit 1
fi

# Create admin user
echo "Creating test admin user..."
node scripts/create-direct-admin.js

# Success message
echo ""
echo "=== Development Environment Ready ==="
echo "Emulator UI: http://localhost:4000"
echo "Application: http://localhost:3000"
echo ""
echo "Test admin login:"
echo "  Email: test@test.test"
echo "  Password: testtest"
echo ""
echo "Starting Next.js development server with emulator config..."
echo ""

# Start Next.js with emulator config
NEXT_PUBLIC_USE_FIREBASE_EMULATORS=true npm run dev 