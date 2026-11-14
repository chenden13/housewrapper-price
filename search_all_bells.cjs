const fs = require('fs');
const path = require('path');

const crmDir = 'C:\\car-shop-projects\\car-shop-crm\\src';

function searchInDir(dir) {
  const files = fs.readdirSync(dir);
  for (const file of files) {
    const fullPath = path.join(dir, file);
    const stat = fs.statSync(fullPath);
    if (stat.isDirectory()) {
      searchInDir(fullPath);
    } else if (fullPath.endsWith('.tsx') || fullPath.endsWith('.ts')) {
      const content = fs.readFileSync(fullPath, 'utf8');
      if (content.includes('tracking') || content.includes('售後追蹤') || content.includes('Bell')) {
        const lines = content.split('\n').filter(l => l.includes('tracking') || l.includes('售後追蹤') || l.includes('Bell'));
        console.log('=== ' + fullPath + ' ===');
        console.log(lines.join('\n'));
      }
    }
  }
}

searchInDir(crmDir);
