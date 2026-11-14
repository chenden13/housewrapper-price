const fs = require('fs');

const app = fs.readFileSync('C:\\car-shop-projects\\car-shop-crm\\src\\App.tsx', 'utf8');

const mobIdx = app.indexOf('isMobile ?');
console.log('--- IS MOBILE RENDER BRANCH IN APP.TSX ---');
console.log(app.substring(mobIdx - 100, mobIdx + 2000));
