/**
 * Loot tables for encounter generation.
 *
 * Loot is organized by tier (matching gear tiers from difficulty scaling).
 * Each loot table has weighted entries — higher weight = more likely to appear.
 */

export const LOOT_TIERS = {
  basic: { label: "Basic", birrRange: [50, 200], itemCount: [1, 2] },
  standard: { label: "Standard", birrRange: [100, 500], itemCount: [1, 3] },
  advanced: { label: "Advanced", birrRange: [200, 1000], itemCount: [2, 4] },
  elite: { label: "Elite", birrRange: [500, 3000], itemCount: [2, 5] }
};

/**
 * Individual loot items with weights and tier minimums.
 */
export const LOOT_TABLES = {
  weapons: [
    { name: "Knife",              weight: 10, minTier: "basic",    item: { type: "weapon", system: { damage: 1, range: "contact", melee: true, weight: "L", techTier: "P", bonus: 0, initiative: 1 } } },
    { name: "Club",               weight: 8,  minTier: "basic",    item: { type: "weapon", system: { damage: 2, range: "contact", melee: true, weight: "N", techTier: "P", bonus: 0, initiative: 0 } } },
    { name: "Vulcan Cricket",     weight: 7,  minTier: "basic",    item: { type: "weapon", system: { damage: 2, range: "short", melee: false, weight: "L", techTier: "O", bonus: 1, initiative: 0 } } },
    { name: "Vulcan Pistol",      weight: 6,  minTier: "standard", item: { type: "weapon", system: { damage: 2, range: "short", melee: false, weight: "L", techTier: "O", bonus: 1, initiative: 0 } } },
    { name: "Saber",              weight: 4,  minTier: "standard", item: { type: "weapon", system: { damage: 2, range: "contact", melee: true, weight: "N", techTier: "O", bonus: 1, initiative: 1 } } },
    { name: "Vulcan Carbine",     weight: 3,  minTier: "advanced", item: { type: "weapon", system: { damage: 3, range: "long", melee: false, weight: "N", techTier: "O", bonus: 2, initiative: -2, automatic: true } } },
    { name: "Thermal Carbine",    weight: 2,  minTier: "advanced", item: { type: "weapon", system: { damage: 3, range: "long", melee: false, weight: "N", techTier: "A", bonus: 2, initiative: -2 } } },
    { name: "Accelerator Pistol", weight: 1,  minTier: "elite",    item: { type: "weapon", system: { damage: 3, range: "long", melee: false, weight: "L", techTier: "A", bonus: 2, initiative: 0 } } }
  ],

  armor: [
    { name: "Light Armor Vest",   weight: 8,  minTier: "basic",    item: { type: "armor", system: { armorRating: 2, weight: "N", techTier: "O" } } },
    { name: "Armor Vest",         weight: 5,  minTier: "standard", item: { type: "armor", system: { armorRating: 4, weight: "N", techTier: "O" } } },
    { name: "Exo Shell",          weight: 2,  minTier: "advanced", item: { type: "armor", system: { armorRating: 6, weight: "H", techTier: "A" } } },
    { name: "Combat Armor",       weight: 1,  minTier: "elite",    item: { type: "armor", system: { armorRating: 8, weight: "H", techTier: "A" } } }
  ],

  gear: [
    { name: "Communicator",       weight: 10, minTier: "basic",    item: { type: "gear", system: { weight: "T", techTier: "O" } } },
    { name: "Medkit",             weight: 8,  minTier: "basic",    item: { type: "gear", system: { weight: "L", techTier: "O" } } },
    { name: "Tabak",              weight: 9,  minTier: "basic",    item: { type: "gear", system: { weight: "T", techTier: "P", quantity: 3 } } },
    { name: "Arrash",             weight: 5,  minTier: "basic",    item: { type: "gear", system: { weight: "T", techTier: "P", quantity: 2 } } },
    { name: "Tools (Ordinary)",   weight: 7,  minTier: "basic",    item: { type: "gear", system: { weight: "N", techTier: "O" } } },
    { name: "Lock Pick Set",      weight: 4,  minTier: "standard", item: { type: "gear", system: { weight: "T", techTier: "O" } } },
    { name: "Computer Tablet",    weight: 5,  minTier: "standard", item: { type: "gear", system: { weight: "L", techTier: "O" } } },
    { name: "Survival Kit",       weight: 4,  minTier: "standard", item: { type: "gear", system: { weight: "L", techTier: "O" } } },
    { name: "Proximity Sensor",   weight: 3,  minTier: "advanced", item: { type: "gear", system: { weight: "L", techTier: "O" } } },
    { name: "Spy Glass",          weight: 3,  minTier: "advanced", item: { type: "gear", system: { weight: "L", techTier: "O" } } },
    { name: "Medicurgy Kit",      weight: 2,  minTier: "advanced", item: { type: "gear", system: { weight: "L", techTier: "O" } } },
    { name: "Faction Badge",      weight: 4,  minTier: "standard", item: { type: "gear", system: { weight: "T", techTier: "O" } } },
    { name: "Stasis Pack",        weight: 1,  minTier: "elite",    item: { type: "gear", system: { weight: "L", techTier: "A" } } },
    { name: "Tools (Advanced)",   weight: 2,  minTier: "elite",    item: { type: "gear", system: { weight: "N", techTier: "A" } } }
  ],

  valuables: [
    { name: "Prayer Beads",           weight: 8,  minTier: "basic",    birrValue: 50 },
    { name: "Small Gemstone",         weight: 6,  minTier: "basic",    birrValue: 100 },
    { name: "Silver Ring",            weight: 5,  minTier: "standard", birrValue: 200 },
    { name: "Encrypted Data Chip",    weight: 4,  minTier: "standard", birrValue: 300 },
    { name: "Ancient Artifact",       weight: 2,  minTier: "advanced", birrValue: 800 },
    { name: "Rare Spice Bundle",      weight: 3,  minTier: "advanced", birrValue: 500 },
    { name: "Portal Builder Fragment", weight: 1, minTier: "elite",    birrValue: 2000 },
    { name: "Djinn Talisman",         weight: 1,  minTier: "elite",    birrValue: 1500 }
  ]
};

/**
 * Tier ordering for min-tier filtering.
 */
export const TIER_ORDER = ["basic", "standard", "advanced", "elite"];

/**
 * Filter loot entries by minimum tier.
 */
export function filterByTier(entries, tier) {
  const tierIdx = TIER_ORDER.indexOf(tier);
  return entries.filter(e => TIER_ORDER.indexOf(e.minTier) <= tierIdx);
}

/**
 * Weighted random pick from an array of { weight, ... } entries.
 */
export function weightedPick(entries) {
  const totalWeight = entries.reduce((sum, e) => sum + e.weight, 0);
  let roll = Math.random() * totalWeight;
  for (const entry of entries) {
    roll -= entry.weight;
    if (roll <= 0) return entry;
  }
  return entries[entries.length - 1];
}
