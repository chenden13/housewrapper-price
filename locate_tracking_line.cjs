const fs = require('fs');

const app = fs.readFileSync('C:\\car-shop-projects\\car-shop-crm\\src\\App.tsx', 'utf8');
const lines = app.split('\n');
lines.forEach((line, idx) => {
  if (line.includes('售後追蹤')) {
    console.log(`Line ${idx + 1}: ${line}`);
    console.log(lines.slice(Math.max(0, idx - 5), Math.min(lines.length, idx + 6)).join('\n'));
    console.log('-----------------------------------');
  }
});
