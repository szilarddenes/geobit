#!/bin/bash

echo "Starting Browser Tools Server in background"
npx @agentdeskai/browser-tools-server &
BROWSER_TOOLS_PID=$!
echo "Browser Tools Server started with PID: $BROWSER_TOOLS_PID"




