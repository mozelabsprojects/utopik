const countries = [
  {name: "Kuzey Kore", pop: 26, budget: 1500, mil: 95, happ: 25, heal: 35, env: 50, edu: 45, stab: 90, diff: "Çok Zor"},
  {name: "Amerika Birleşik Devletleri", pop: 335, budget: 12000, mil: 90, happ: 55, heal: 50, env: 45, edu: 70, stab: 65, diff: "Dengeli"},
  {name: "İsveç", pop: 10.5, budget: 6000, mil: 35, happ: 80, heal: 90, env: 90, edu: 85, stab: 85, diff: "Kolay"},
  {name: "Türkiye", pop: 85, budget: 4500, mil: 75, happ: 45, heal: 60, env: 45, edu: 50, stab: 50, diff: "Zor"},
  {name: "Brezilya", pop: 215, budget: 6000, mil: 45, happ: 50, heal: 45, env: 75, edu: 45, stab: 45, diff: "Zor"},
  {name: "Japonya", pop: 125, budget: 14000, mil: 45, happ: 60, heal: 85, env: 65, edu: 90, stab: 80, diff: "Dengeli"},
  {name: "Nijerya", pop: 220, budget: 2000, mil: 30, happ: 25, heal: 20, env: 25, edu: 20, stab: 20, diff: "Çok Zor"},
  {name: "Almanya", pop: 84, budget: 12000, mil: 40, happ: 65, heal: 80, env: 75, edu: 85, stab: 75, diff: "Kolay"},
  {name: "Rusya", pop: 144, budget: 9000, mil: 85, happ: 30, heal: 50, env: 30, edu: 60, stab: 65, diff: "Zor"},
  {name: "Çin", pop: 1412, budget: 25000, mil: 85, happ: 40, heal: 60, env: 20, edu: 85, stab: 90, diff: "Dengeli"},
  {name: "Hindistan", pop: 1428, budget: 12000, mil: 70, happ: 45, heal: 35, env: 30, edu: 55, stab: 50, diff: "Zor"},
  {name: "İngiltere", pop: 68, budget: 12000, mil: 60, happ: 60, heal: 75, env: 70, edu: 80, stab: 65, diff: "Dengeli"},
  {name: "İsviçre", pop: 8.7, budget: 15000, mil: 20, happ: 90, heal: 95, env: 95, edu: 90, stab: 95, diff: "Kolay"}
];

countries.forEach(c => {
  let popScale = Math.max(0.8, Math.sqrt(c.pop / 10)); popScale = Math.min(3.0, popScale);
  
  const eduBonus = (c.edu > 50 ? (c.edu - 50) * 25 : 0) * popScale;
  const healBonus = (c.heal > 50 ? (c.heal - 50) * 20 : 0) * popScale;
  const envBonus = (c.env > 50 ? (c.env - 50) * 15 : 0) * popScale;
  const milBonus = (c.mil > 60 ? (c.mil - 60) * 12 : 0) * popScale;
  
  const stabMult = 0.5 + (c.stab / 200);
  let happMult = 0.5 + (c.happ / 200);
  if (c.happ < 40) happMult = Math.max(0.7, happMult);
  
  const baseTax = 1500 * popScale + eduBonus + healBonus + envBonus + milBonus;
  let tax = baseTax * stabMult * happMult;
  
  const milCost = c.mil * 15 * popScale;
  const healCost = c.heal * 8 * popScale;
  const eduCost = c.edu * 10 * popScale;
  const envCost = c.env * 5 * popScale;
  let maint = milCost + healCost + eduCost + envCost;
  
  if (c.heal < 40) maint += (40 - c.heal) * 2 * popScale;
  if (c.stab < 60) maint += (60 - c.stab) * 5 * popScale;
  
  if (c.name === "Kuzey Kore") maint *= 0.5;
  
  let net = Math.round(tax - maint);
  console.log(`${c.name}: Tax=${Math.round(tax)}, Maint=${Math.round(maint)}, Net=${net}`);
});
