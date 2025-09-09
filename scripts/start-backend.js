#!/usr/bin/env node

const { spawn } = require('child_process');
const path = require('path');

console.log('🚀 Starting Hackathon Event Email Service...');

// Change to backend directory
const backendPath = path.join(__dirname, '..', 'backend');

// Spawn the backend process
const backend = spawn('npm', ['start'], {
  cwd: backendPath,
  stdio: 'inherit',
  shell: true
});

backend.on('close', (code) => {
  console.log(`📧 Email service exited with code ${code}`);
});

backend.on('error', (error) => {
  console.error('❌ Failed to start email service:', error);
});