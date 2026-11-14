const fs = require('fs');

const typesPath = 'C:\\car-shop-projects\\car-shop-crm\\src\\types\\index.ts';
if (fs.existsSync(typesPath)) {
  const content = fs.readFileSync(typesPath, 'utf8');
  console.log('--- TYPES INDEX.TS ---');
  console.log(content);
}
