const fs = require('fs');

const app = fs.readFileSync('C:\\car-shop-projects\\car-shop-crm\\src\\App.tsx', 'utf8');

const isMobRenderIdx = app.indexOf('{isMobile ?');
console.log('--- IS MOBILE JSX RENDER IN APP.TSX ---');
console.log(app.substring(isMobRenderIdx - 100, isMobRenderIdx + 1500));
