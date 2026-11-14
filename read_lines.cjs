const fs = require('fs');

const app = fs.readFileSync('C:\\car-shop-projects\\car-shop-crm\\src\\App.tsx', 'utf8');
const lines = app.split('\n');
console.log(lines.slice(630, 680).map((l, i) => `${631 + i}: ${l}`).join('\n'));
