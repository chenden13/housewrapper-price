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
      if (content.includes('自施工') || content.includes('麟光') || content.includes('昆哥') || content.includes('施工廠商')) {
        console.log('Found match in:', fullPath);
      }
    }
  }
}

console.log('--- Searching for 施工廠商 in CRM ---');
searchInDir(crmDir);
