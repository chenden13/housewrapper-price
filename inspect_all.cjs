const fs = require('fs');

['AccessoriesPage.tsx', 'ActiveConstructionPage.tsx', 'types/index.ts'].forEach(f => {
  const path = 'C:\\car-shop-projects\\car-shop-crm\\src\\' + f;
  if (fs.existsSync(path)) {
    const content = fs.readFileSync(path, 'utf8');
    console.log('=== ' + f + ' ===');
    const lines = content.split('\n').filter(l => l.includes('windowTintVendor') || l.includes('自施工') || l.includes('麟光') || l.includes('昆哥'));
    console.log(lines.join('\n'));
  }
});
