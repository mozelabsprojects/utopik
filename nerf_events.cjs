const fs = require('fs');
const path = './src/lib/events-data.ts';
let content = fs.readFileSync(path, 'utf8');

// We want to halve all numerical values in `effects: { ... }` and `factionEffects: { ... }` EXCEPT budget and popularity.
// To do this safely, we can parse the file or use a precise regex replacer.
content = content.replace(/(effects:\s*{[^}]+})/g, (match) => {
    return match.replace(/([a-zA-Z]+):\s*(-?\d+)/g, (m, key, val) => {
        if (key === 'budget' || key === 'popularity') return m;
        let num = parseInt(val);
        // Halve and round towards zero
        if (num > 0) num = Math.ceil(num / 2);
        else if (num < 0) num = Math.floor(num / 2);
        return `${key}: ${num}`;
    });
});

content = content.replace(/(factionEffects:\s*{[^}]+})/g, (match) => {
    return match.replace(/([a-zA-Z]+):\s*(-?\d+)/g, (m, key, val) => {
        let num = parseInt(val);
        if (num > 0) num = Math.ceil(num / 2);
        else if (num < 0) num = Math.floor(num / 2);
        return `${key}: ${num}`;
    });
});

fs.writeFileSync(path, content);
console.log("Events nerfed successfully!");
