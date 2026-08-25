const { execSync, spawn } = require('child_process');
const path = require('path');
const fs = require('fs');

const rootDir = path.resolve(__dirname);
const nodeModulesPath = path.join(rootDir, 'node_modules');

// Check if node_modules exists, auto-install if not
if (!fs.existsSync(nodeModulesPath)) {
  console.log('');
  console.log('  ⬡ QR Code 產生器 - 首次啟動');
  console.log('  正在安裝必要套件，請稍候...');
  console.log('');

  try {
    execSync('npm install', {
      cwd: rootDir,
      stdio: 'inherit'
    });
    console.log('');
    console.log('  ✓ 套件安裝完成！正在啟動應用...');
    console.log('');
  } catch (err) {
    console.error('  ✗ 套件安裝失敗，請檢查網路連線後重試');
    process.exit(1);
  }
}

// Launch Electron (use require to get correct path, avoids spaces-in-path issues)
const electronPath = require(path.join(rootDir, 'node_modules', 'electron'));
const child = spawn(electronPath, ['.'], {
  cwd: rootDir,
  stdio: 'inherit'
});

child.on('close', (code) => {
  process.exit(code);
});
