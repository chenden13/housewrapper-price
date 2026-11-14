const fs = require('fs');
const app = fs.readFileSync('C:\\car-shop-projects\\car-shop-crm\\src\\App.tsx', 'utf8');

let pos = 0;
while ((pos = app.indexOf('tracking', pos)) !== -1) {
  console.log('--- FOUND tracking at index:', pos);
  console.log(app.substring(Math.max(0, pos - 150), Math.min(app.length, pos + 250)));
  pos += 10;
}
