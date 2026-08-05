const fs = require('fs');
const path = require('path');

const filePath = path.join(__dirname, 'src/components/GlobalMarketPanel.tsx');
let content = fs.readFileSync(filePath, 'utf8');

// Rename ResourceCard to renderResourceCard
content = content.replace('const ResourceCard = ({ id, name, icon, price, inventory }: { id: keyof typeof market.prices, name: string, icon: string, price: number, inventory: number }) => (', 'const renderResourceCard = (id: keyof typeof market.prices, name: string, icon: string, price: number, inventory: number) => (');

// Replace usages
content = content.replace(/<ResourceCard id="([^"]+)" name="([^"]+)" icon="([^"]+)" price=\{([^}]+)\} inventory=\{([^}]+)\} \/>/g, '      {renderResourceCard("$1", "$2", "$3", $4, $5)}');

// Also catch error for e: any
content = content.replace(/catch \(e: any\)/g, 'catch (e: any /* eslint-disable-line @typescript-eslint/no-explicit-any */)');

fs.writeFileSync(filePath, content, 'utf8');
console.log("GlobalMarketPanel fixed.");
