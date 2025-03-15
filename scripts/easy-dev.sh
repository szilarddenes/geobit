#!/bin/bash

# Stop existing processes
echo "Stopping any running servers and emulators..."
pkill -f "next dev" || true
pkill -f "firebase emulators" || true
sleep 3

# Check if port 3000 is in use by something else
if lsof -Pi :3000 -sTCP:LISTEN -t >/dev/null ; then
    echo "⚠️ Warning: Port 3000 is already in use. Please free it up before running this script."
    echo "You can try: lsof -i :3000 to see what's using it"
    exit 1
fi

# Start emulators in background
echo "Starting Firebase emulators..."
firebase emulators:start > emulators.log 2>&1 &
EMULATOR_PID=$!

# Check every second for up to 30 seconds if the emulator UI is responsive
echo "Waiting for emulators to start (this may take up to 30 seconds)..."
for i in {1..30}; do
    if curl -s http://localhost:4000 >/dev/null; then
        echo "✅ Emulator UI is up after $i seconds"
        # Give it a few more seconds to fully initialize
        sleep 5
        break
    fi
    
    # Check if emulator process is still running
    if ! ps -p $EMULATOR_PID > /dev/null; then
        echo "❌ Emulator process died. Check emulators.log for details."
        exit 1
    fi
    
    sleep 1
    echo -n "."
done

# Create test admin user (try multiple times to ensure success)
echo "Creating test admin user..."
for attempt in {1..3}; do
    echo "Attempt $attempt of 3..."
    
    # Create user payload
    USER_PAYLOAD='{
        "email": "test@test.test",
        "password": "testtest",
        "returnSecureToken": true
    }'
    
    # Try to create user or sign in if exists
    RESPONSE=$(curl -s -X POST "http://localhost:9099/identitytoolkit.googleapis.com/v1/accounts:signUp?key=fake-api-key" \
      -H "Content-Type: application/json" \
      -d "$USER_PAYLOAD")
    
    # Extract user ID whether new or existing
    if echo "$RESPONSE" | grep -q "localId"; then
        USER_ID=$(echo "$RESPONSE" | grep -o '"localId":"[^"]*' | cut -d'"' -f4)
        echo "✅ User created with ID: $USER_ID"
        USER_CREATED=true
        break
    elif echo "$RESPONSE" | grep -q "EMAIL_EXISTS"; then
        # User exists, try to sign in
        SIGNIN_RESPONSE=$(curl -s -X POST "http://localhost:9099/identitytoolkit.googleapis.com/v1/accounts:signInWithPassword?key=fake-api-key" \
          -H "Content-Type: application/json" \
          -d "$USER_PAYLOAD")
        
        USER_ID=$(echo "$SIGNIN_RESPONSE" | grep -o '"localId":"[^"]*' | cut -d'"' -f4)
        if [ -n "$USER_ID" ]; then
            echo "✅ User already exists, signed in with ID: $USER_ID"
            USER_CREATED=true
            break
        fi
    fi
    
    echo "User creation failed on attempt $attempt, waiting and trying again..."
    sleep 5
done

if [ "${USER_CREATED:-false}" != "true" ]; then
    echo "❌ Failed to create or sign in user after 3 attempts."
    echo "Continuing anyway... you might need to create a user manually."
fi

# If we have a user ID, set admin claims and create Firestore document
if [ -n "$USER_ID" ]; then
    # Set admin claims
    curl -s -X POST "http://localhost:9099/emulator/v1/projects/geobit-959c9/accounts/$USER_ID:setClaims" \
      -H "Content-Type: application/json" \
      -d '{"customClaims":{"admin":true}}' >/dev/null
    
    echo "✅ Set admin claims for user"
    
    # Create admin document in Firestore
    ADMIN_DOC='{
        "fields": {
            "email": {"stringValue": "test@test.test"},
            "displayName": {"stringValue": "Test Admin"},
            "isAdmin": {"booleanValue": true},
            "addedAt": {"timestampValue": "'$(date -u +"%Y-%m-%dT%H:%M:%S.000Z")'"}
        }
    }'
    
    curl -s -X PATCH "http://localhost:8080/v1/projects/geobit-959c9/databases/(default)/documents/adminUsers/$USER_ID" \
      -H "Content-Type: application/json" \
      -d "$ADMIN_DOC" >/dev/null
    
    echo "✅ Created admin document in Firestore"
fi

# Display success message
echo ""
echo "=== 🚀 Development Environment Ready! ==="
echo "Emulator UI: http://localhost:4000"
echo ""
echo "Test admin login:"
echo "  Email: test@test.test"
echo "  Password: testtest"
echo ""
echo "Starting Next.js development server with emulator config..."
echo ""

# Set environment variables and start Next.js
NEXT_PUBLIC_USE_FIREBASE_EMULATORS=true NODE_ENV=development npm run dev

# When Next.js is stopped, also stop the emulators
echo "Shutting down emulators..."
kill $EMULATOR_PID 2>/dev/null || true 