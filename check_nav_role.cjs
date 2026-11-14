const fs = require('fs');
const app = fs.readFileSync('C:\\car-shop-projects\\car-shop-crm\\src\\App.tsx', 'utf8');

const navIdx = app.indexOf('nav-tab');
console.log('--- NAV TABS CODE ---');
console.log(app.substring(navIdx - 300, navIdx + 1500));
