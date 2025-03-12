#!/bin/bash

# Ensure using the correct Node.js version via nvm
export NVM_DIR="$HOME/.nvm"
[ -s "$NVM_DIR/nvm.sh" ] && \. "$NVM_DIR/nvm.sh"
nvm use 18.18.0 > /dev/null 2>&1 || echo "Please run: nvm install 18.18.0"

# Run the command with the local Next.js
if [ "$1" == "dev" ]; then
  npx next dev
elif [ "$1" == "build" ]; then
  npx next build
elif [ "$1" == "start" ]; then
  npx next start
else
  npx next "$@"
fi 