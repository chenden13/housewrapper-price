const fs = require('fs');

const app = fs.readFileSync('C:\\car-shop-projects\\car-shop-crm\\src\\App.tsx', 'utf8');

console.log('--- IS MOBILE CHECK IN APP.TSX ---');
const isMobileIdx = app.indexOf('isMobile');
console.log(app.substring(isMobileIdx - 100, isMobileIdx + 1200));

console.log('--- SEARCH MOBILE COMPONENTS ---');
const files = fs.readdirSync('C:\\car-shop-projects\\car-shop-crm\\src\\components\\mobile');
console.log(files);
