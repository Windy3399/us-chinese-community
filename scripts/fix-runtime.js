const fs = require('fs');
const path = require('path');

const apiPath = path.join(process.cwd(), 'app', 'api');

function updateRuntimeInFile(filePath) {
  let content = fs.readFileSync(filePath, 'utf8');
  const original = content;
  content = content.replace(/export const runtime = 'edge'/g, "export const runtime = 'nodejs'");

  if (content !== original) {
    fs.writeFileSync(filePath, content, 'utf8');
    console.log('✓ Updated:', filePath.replace(process.cwd() + path.sep, ''));
  }
}

function walkDir(dir) {
  const files = fs.readdirSync(dir);
  files.forEach(file => {
    const fullPath = path.join(dir, file);
    const stat = fs.statSync(fullPath);
    if (stat.isDirectory()) {
      walkDir(fullPath);
    } else if (file.endsWith('.ts') || file.endsWith('.tsx')) {
      updateRuntimeInFile(fullPath);
    }
  });
}

walkDir(apiPath);
console.log('\nDone! All edge runtimes changed to nodejs.');
