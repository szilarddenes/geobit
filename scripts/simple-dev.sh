#!/bin/bash

# Clear terminal
clear
echo "=== Starting GeoBit Development Environment ==="

# Stop any existing emulators and servers
echo "Cleaning up any running processes..."
pkill -f "firebase emulators" || true
pkill -f "next dev" || true
sleep 2

# Start emulators in the background
echo "Starting Firebase emulators..."
firebase emulators:start > emulators.log 2>&1 &
EMULATOR_PID=$!

# Wait for emulators to start
echo "Waiting for emulators to initialize (15 seconds)..."
sleep 15

# Simple check if emulators are running
if ! ps -p $EMULATOR_PID > /dev/null; then
  echo "Error: Firebase emulators failed to start"
  echo "Check emulators.log for details"
  exit 1
fi

# Create admin user - simple approach
echo "Creating test admin user..."
cat > /tmp/create-user.json << EOL
{
  "email": "test@test.test",
  "password": "testtest",
  "returnSecureToken": true
}
EOL

# Try to create user or sign in if exists
USER_ID=""
CREATE_OUTPUT=$(curl -s -X POST "http://localhost:9099/identitytoolkit.googleapis.com/v1/accounts:signUp?key=fake-api-key" \
  -H "Content-Type: application/json" \
  -d @/tmp/create-user.json)

if echo "$CREATE_OUTPUT" | grep -q "localId"; then
  USER_ID=$(echo "$CREATE_OUTPUT" | grep -o '"localId":"[^"]*' | cut -d'"' -f4)
  echo "✅ User created with ID: $USER_ID"
elif echo "$CREATE_OUTPUT" | grep -q "EMAIL_EXISTS"; then
  # User exists, try to sign in
  SIGNIN_OUTPUT=$(curl -s -X POST "http://localhost:9099/identitytoolkit.googleapis.com/v1/accounts:signInWithPassword?key=fake-api-key" \
    -H "Content-Type: application/json" \
    -d @/tmp/create-user.json)
  
  USER_ID=$(echo "$SIGNIN_OUTPUT" | grep -o '"localId":"[^"]*' | cut -d'"' -f4)
  echo "✅ User already exists, signed in with ID: $USER_ID"
else
  echo "⚠️ Could not create or sign in user. Continuing anyway..."
fi

# Set admin claims if we have a user ID
if [ ! -z "$USER_ID" ]; then
  # Try the emulator-specific endpoint
  curl -s -X POST "http://localhost:9099/emulator/v1/projects/geobit-959c9/accounts/$USER_ID:setClaims" \
    -H "Content-Type: application/json" \
    -d '{"customClaims":{"admin":true}}' > /dev/null
  
  echo "✅ Set admin claims for user"
  
  # Create admin document in Firestore
  curl -s -X PATCH "http://localhost:8080/v1/projects/geobit-959c9/databases/(default)/documents/adminUsers/$USER_ID" \
    -H "Content-Type: application/json" \
    -d '{"fields":{"email":{"stringValue":"test@test.test"},"displayName":{"stringValue":"Test Admin"},"isAdmin":{"booleanValue":true}}}' > /dev/null
  
  echo "✅ Created admin document in Firestore"
fi

# Show success message
echo ""
echo "=== Development Environment Ready ==="
echo "Emulator UI: http://localhost:4000"
echo "Application: http://localhost:3000"
echo ""
echo "Test admin login:"
echo "  Email: test@test.test"
echo "  Password: testtest"
echo ""
echo "Starting Next.js development server..."
echo ""

# Start Next.js with emulator config in the foreground
NEXT_PUBLIC_USE_FIREBASE_EMULATORS=true npm run dev 