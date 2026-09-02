const fs = require('fs');
const path = require('path');

// Read files
const policiesFile = fs.readFileSync('./src/lib/policies.ts', 'utf8');
const techFile = fs.readFileSync('./src/lib/tech-tree.ts', 'utf8');
const crisesFile = fs.readFileSync('./src/lib/crises-missions.ts', 'utf8');
const ministersFile = fs.readFileSync('./src/lib/ministers.ts', 'utf8');
const eventsFile = fs.readFileSync('./src/lib/events-data.ts', 'utf8');
const engineFile = fs.readFileSync('./src/lib/game-engine.ts', 'utf8');

console.log("=== AUDIT CHECK START ===");

// 1. Check Policy IDs in POLICIES vs PolicyId type
const policyKeys = [...policiesFile.matchAll(/(\w+):\s*\{\s*id:\s*"\1"/g)].map(m => m[1]);
console.log(`Defined Policies (${policyKeys.length}):`, policyKeys.join(', '));

// Check if any policy referenced in crises doesn't exist
const policyRefsInCrises = [...crisesFile.matchAll(/laws\.includes\(["'](\w+)["']\)/g)].map(m => m[1]);
policyRefsInCrises.forEach(ref => {
  if (!policyKeys.includes(ref)) {
    console.error(`[BUG] Crisis references non-existent policy: "${ref}"`);
  }
});

// 2. Check Tech IDs in TECH_TREE
const techKeys = [...techFile.matchAll(/(\w+):\s*\{\s*id:\s*"\1"/g)].map(m => m[1]);
console.log(`Defined Techs (${techKeys.length}):`, techKeys.join(', '));

// Check tech refs in game-engine.ts
const techRefsInEngine = [...engineFile.matchAll(/unlockedTechs\.includes\(["'](\w+)["']\)/g)].map(m => m[1]);
techRefsInEngine.forEach(ref => {
  if (!techKeys.includes(ref)) {
    console.error(`[BUG] Game engine references non-existent tech: "${ref}"`);
  }
});

// 3. Check Minister IDs in MINISTERS
const ministerKeys = [...ministersFile.matchAll(/(\w+):\s*\{\s*id:\s*"\1"/g)].map(m => m[1]);
console.log(`Defined Ministers (${ministerKeys.length}):`, ministerKeys.join(', '));

// Check minister refs in events-data.ts
const ministerRefsInEvents = [...eventsFile.matchAll(/requiredMinister:\s*["'](\w+)["']/g)].map(m => m[1]);
ministerRefsInEvents.forEach(ref => {
  if (!ministerKeys.includes(ref)) {
    console.error(`[BUG] Event references non-existent minister: "${ref}"`);
  }
});

// 4. Check JSON parse safety in next-turn/route.ts
const nextTurnFile = fs.readFileSync('./src/app/api/game/next-turn/route.ts', 'utf8');
const parseMatches = [...nextTurnFile.matchAll(/JSON\.parse\(([^)]+)\)/g)];
console.log(`JSON.parse calls in next-turn/route.ts: ${parseMatches.length}`);

console.log("=== AUDIT CHECK END ===");
