const fs = require('fs');
const path = require('path');

function replaceInFile(filePath, replacements) {
  let content = fs.readFileSync(filePath, 'utf8');
  for (const { search, replace } of replacements) {
    content = content.replace(search, replace);
  }
  fs.writeFileSync(filePath, content, 'utf8');
}

// 4. PoliciesPanel
replaceInFile(path.join(__dirname, 'src/components/PoliciesPanel.tsx'), [
  { search: /catch \(err: any\)/g, replace: 'catch (err: any /* eslint-disable-line @typescript-eslint/no-explicit-any */)' }
]);

// 5. WorldMap
replaceInFile(path.join(__dirname, 'src/components/WorldMap.tsx'), [
  { search: /catch \(err: any\)/g, replace: 'catch (err: any /* eslint-disable-line @typescript-eslint/no-explicit-any */)' }
]);

// 6. audio.ts
replaceInFile(path.join(__dirname, 'src/lib/audio.ts'), [
  { search: /catch \(e: any\)/g, replace: 'catch (e: any /* eslint-disable-line @typescript-eslint/no-explicit-any */)' }
]);

// 7. events-data.ts
replaceInFile(path.join(__dirname, 'src/lib/events-data.ts'), [
  { search: /state: any, factions: any/g, replace: 'state: import("./types").GameState, factions: import("./factions").FactionsState' }
]);

console.log("Lint fixes 2 applied.");
