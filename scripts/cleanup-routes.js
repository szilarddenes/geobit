#!/usr/bin/env node

/**
 * This script cleans up route conflicts between Pages Router and App Router
 * 
 * Run with: node scripts/cleanup-routes.js
 */

const fs = require('fs');
const path = require('path');
const { promisify } = require('util');
const exec = promisify(require('child_process').exec);

const fsExists = promisify(fs.exists);
const fsRm = promisify(fs.rm);
const fsReaddir = promisify(fs.readdir);
const fsLstat = promisify(fs.lstat);

// Paths to check and clean
const PATHS_TO_CHECK = [
  { pageRouter: 'src/pages/admin', appRouter: 'src/app/admin' },
  { pageRouter: 'src/pages/app', appRouter: 'src/app' },
  { pageRouter: 'src/app/app', appRouter: 'src/app' },
];

// Helper to safely delete a directory if it exists
async function safeDeleteDir(dirPath) {
  if (await fsExists(dirPath)) {
    console.log(`Deleting: ${dirPath}`);
    await fsRm(dirPath, { recursive: true, force: true });
    return true;
  }
  return false;
}

// Helper to clean the build directory
async function cleanBuildDir() {
  const nextDir = path.join(process.cwd(), '.next');
  await safeDeleteDir(nextDir);
  console.log('Build directory cleaned');
}

// Helper to check for app/app nested directory
async function checkForAppApp() {
  const appAppDir = path.join(process.cwd(), 'src', 'app', 'app');
  const deleted = await safeDeleteDir(appAppDir);
  if (deleted) {
    console.log('⚠️ Found and removed nested src/app/app directory that causes conflicts');
  }
}

// Main execution
async function main() {
  console.log('Starting route conflict cleanup...');
  
  // Clean nested app/app directory if it exists
  await checkForAppApp();
  
  // Check all path pairs for conflicts
  for (const { pageRouter, appRouter } of PATHS_TO_CHECK) {
    const pageRouterPath = path.join(process.cwd(), pageRouter);
    const appRouterPath = path.join(process.cwd(), appRouter);
    
    const pageExists = await fsExists(pageRouterPath);
    const appExists = await fsExists(appRouterPath);
    
    if (pageExists && appExists) {
      console.log(`⚠️ Conflict detected: ${pageRouter} and ${appRouter} both exist`);
      
      // Create placeholder for Pages Router
      if (pageExists) {
        // We don't actually delete the file, just create a warning
        console.log(`Note: You should manually migrate content from ${pageRouter} to ${appRouter}`);
        console.log(`      and then delete ${pageRouter} when ready.`);
      }
    }
  }
  
  // Clean build directory
  await cleanBuildDir();
  
  console.log('\nCleanup complete!');
  console.log('\nNext steps:');
  console.log('1. Run "npm run build" to check for any remaining issues');
  console.log('2. Refer to MIGRATION.md for more information on migration process');
}

main().catch(error => {
  console.error('Error during cleanup:', error);
  process.exit(1);
});
