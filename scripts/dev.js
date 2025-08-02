const { spawn } = require('child_process');
const path = require('path');

// Colors for console output
const colors = {
  convex: '\x1b[36m', // Cyan
  mobile: '\x1b[35m', // Magenta
  reset: '\x1b[0m',
};

function runCommand(name, command, args, cwd, color) {
  const child = spawn(command, args, {
    cwd,
    shell: true,
    stdio: 'pipe',
  });

  child.stdout.on('data', (data) => {
    process.stdout.write(`${color}[${name}]${colors.reset} ${data}`);
  });

  child.stderr.on('data', (data) => {
    process.stderr.write(`${color}[${name}]${colors.reset} ${data}`);
  });

  child.on('error', (error) => {
    console.error(`${color}[${name}]${colors.reset} Error: ${error.message}`);
  });

  return child;
}

// Start Convex backend
const convexProcess = runCommand(
  'convex',
  'pnpm',
  ['dev'],
  path.join(__dirname, '../packages/convex'),
  colors.convex
);

// Wait a bit for Convex to start, then start mobile
setTimeout(() => {
  runCommand(
    'mobile',
    'pnpm',
    ['start'],
    path.join(__dirname, '../apps/mobile'),
    colors.mobile
  );
}, 3000);

// Handle process termination
process.on('SIGINT', () => {
  console.log('\nShutting down...');
  convexProcess.kill();
  process.exit();
});