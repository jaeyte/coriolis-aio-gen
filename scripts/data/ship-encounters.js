/**
 * Ship encounter data for space combat generation.
 *
 * Each enemy ship template defines a base ship class, required weapons,
 * optional extras, and a category that controls stat scaling.
 *
 * Encounter templates define groups of enemy ships that appear together.
 */

// ── Enemy Ship Categories ──────────────────────────────────

export const SHIP_CATEGORIES = {
  fodder:   { label: "Fodder",   hullScale: 0.7, maxWeapons: 1, crewScale: 0.6 },
  standard: { label: "Standard", hullScale: 1.0, maxWeapons: 2, crewScale: 1.0 },
  heavy:    { label: "Heavy",    hullScale: 1.3, maxWeapons: 3, crewScale: 1.2 },
  flagship: { label: "Flagship", hullScale: 1.6, maxWeapons: 4, crewScale: 1.4 }
};

// ── Enemy Ship Templates ───────────────────────────────────

export const ENEMY_SHIPS = {
  pirateSkiff: {
    name: "Pirate Skiff",
    category: "fodder",
    faction: "criminal",
    baseClass: "courier",
    requiredWeapons: ["turret"],
    optionalWeapons: [],
    extraModules: ["ecm"],
    crewRoles: ["captain", "pilot", "gunner"],
    description: "A fast, lightly armed raider used for hit-and-run attacks on merchant shipping."
  },
  pirateGunship: {
    name: "Pirate Gunship",
    category: "standard",
    faction: "criminal",
    baseClass: "patrolBoat",
    requiredWeapons: ["turret", "autocannon"],
    optionalWeapons: ["torpedoLauncher"],
    extraModules: ["sensorArray"],
    crewRoles: ["captain", "pilot", "gunner", "engineer"],
    description: "A well-armed corsair vessel bristling with weapons and crewed by hardened pirates."
  },
  corsairFlagship: {
    name: "Corsair Flagship",
    category: "flagship",
    faction: "criminal",
    baseClass: "armedMerchant",
    requiredWeapons: ["turret", "torpedoLauncher", "heavyCannon"],
    optionalWeapons: ["pointDefense", "autocannon"],
    extraModules: ["sensorArray", "armorPlating", "ecm"],
    crewRoles: ["captain", "pilot", "gunner", "engineer", "sensorOperator"],
    description: "The feared command ship of a corsair fleet, heavily armed and crewed by veterans."
  },
  legionCutter: {
    name: "Legion Cutter",
    category: "standard",
    faction: "legion",
    baseClass: "patrolBoat",
    requiredWeapons: ["turret", "pointDefense"],
    optionalWeapons: ["torpedoLauncher"],
    extraModules: ["sensorArray", "escapePods"],
    crewRoles: ["captain", "pilot", "gunner", "engineer"],
    description: "A fast patrol vessel of the Legion, used for border enforcement and customs inspection."
  },
  legionFrigate: {
    name: "Legion Frigate",
    category: "heavy",
    faction: "legion",
    baseClass: "armedMerchant",
    requiredWeapons: ["turret", "torpedoLauncher", "pointDefense"],
    optionalWeapons: ["heavyCannon"],
    extraModules: ["sensorArray", "armorPlating", "escapePods", "medlab"],
    crewRoles: ["captain", "pilot", "gunner", "engineer", "sensorOperator", "medic"],
    description: "A Legion warship assigned to protect high-value convoys and enforce Consortium law."
  },
  smugglerRunner: {
    name: "Smuggler Runner",
    category: "fodder",
    faction: "criminal",
    baseClass: "courier",
    requiredWeapons: ["autocannon"],
    optionalWeapons: [],
    extraModules: ["smugglerCompartment", "ecm"],
    crewRoles: ["captain", "pilot"],
    description: "A stripped-down courier with hidden compartments, built for speed over firepower."
  },
  mercGunboat: {
    name: "Mercenary Gunboat",
    category: "standard",
    faction: "mercenary",
    baseClass: "patrolBoat",
    requiredWeapons: ["turret", "autocannon"],
    optionalWeapons: ["torpedoLauncher"],
    extraModules: ["armorPlating", "medlab"],
    crewRoles: ["captain", "pilot", "gunner", "engineer"],
    description: "A hired gun's vessel, well-maintained and fitted for combat operations."
  },
  factionBlockadeShip: {
    name: "Blockade Ship",
    category: "heavy",
    faction: "consortium",
    baseClass: "bulkHauler",
    requiredWeapons: ["turret", "pointDefense"],
    optionalWeapons: ["heavyCannon"],
    extraModules: ["sensorArray", "armorPlating", "escapePods"],
    crewRoles: ["captain", "pilot", "gunner", "engineer", "sensorOperator"],
    description: "A converted hauler used to enforce trade blockades, bristling with defensive weapons."
  },
  unknownVessel: {
    name: "Unknown Vessel",
    category: "standard",
    faction: "unknown",
    baseClass: "explorationVessel",
    requiredWeapons: ["turret"],
    optionalWeapons: ["miningLaser"],
    extraModules: ["sensorArray", "laboratory"],
    crewRoles: ["captain", "pilot", "engineer"],
    description: "A vessel of unknown origin broadcasting no identification. Its intentions are unclear."
  },
  darkboundHulk: {
    name: "Darkbound Hulk",
    category: "heavy",
    faction: "darkbetween",
    baseClass: "bulkHauler",
    requiredWeapons: ["heavyCannon"],
    optionalWeapons: ["turret"],
    extraModules: ["stasisHold", "armorPlating"],
    crewRoles: ["captain", "pilot", "gunner"],
    description: "A derelict vessel wreathed in shadow, crewed by things no longer fully human."
  }
};

// ── Ship Encounter Templates ───────────────────────────────

export const SHIP_ENCOUNTER_TEMPLATES = {
  pirateAmbush: {
    label: "Pirate Ambush",
    description: "Corsair skiffs emerge from an asteroid field, weapons hot and boarding clamps ready.",
    enemies: [
      { shipKey: "pirateSkiff", count: [1, 2] },
      { shipKey: "pirateGunship", count: [1, 1] }
    ],
    lootBonus: 0.3
  },
  corsairFleet: {
    label: "Corsair Fleet",
    description: "A pirate captain's full battle group moves to intercept — flagship flanked by gunships.",
    enemies: [
      { shipKey: "corsairFlagship", count: [1, 1] },
      { shipKey: "pirateGunship", count: [1, 2] },
      { shipKey: "pirateSkiff", count: [0, 2] }
    ],
    lootBonus: 0.6
  },
  legionIntercept: {
    label: "Legion Intercept",
    description: "Legion cutters order the crew to heave to for inspection. Resistance will be met with force.",
    enemies: [
      { shipKey: "legionCutter", count: [2, 3] }
    ],
    lootBonus: 0.1
  },
  legionTaskForce: {
    label: "Legion Task Force",
    description: "A frigate and its cutter escort move in with military precision. The Legion wants something.",
    enemies: [
      { shipKey: "legionFrigate", count: [1, 1] },
      { shipKey: "legionCutter", count: [1, 2] }
    ],
    lootBonus: 0.3
  },
  smugglerChase: {
    label: "Smuggler Chase",
    description: "Smuggler runners scatter in all directions, using ECM and speed to evade pursuit.",
    enemies: [
      { shipKey: "smugglerRunner", count: [2, 4] }
    ],
    lootBonus: 0.4
  },
  mercenaryAmbush: {
    label: "Mercenary Ambush",
    description: "Someone hired professionals. Gunboats close from multiple vectors — this is a planned hit.",
    enemies: [
      { shipKey: "mercGunboat", count: [2, 3] }
    ],
    lootBonus: 0.4
  },
  factionBlockade: {
    label: "Faction Blockade",
    description: "Blockade ships hold position around a portal or station, enforcing a trade embargo.",
    enemies: [
      { shipKey: "factionBlockadeShip", count: [1, 2] },
      { shipKey: "legionCutter", count: [1, 2] }
    ],
    lootBonus: 0.2
  },
  unknownContact: {
    label: "Unknown Contact",
    description: "Sensors detect an unidentified vessel. No IFF transponder. No response to hails.",
    enemies: [
      { shipKey: "unknownVessel", count: [1, 1] }
    ],
    lootBonus: 0.2
  },
  ghostShip: {
    label: "Ghost Ship",
    description: "A darkbound hulk drifts into scanner range, radiating cold and wrongness. Something stirs aboard.",
    enemies: [
      { shipKey: "darkboundHulk", count: [1, 1] }
    ],
    lootBonus: 0.5
  }
};

// ── Key Crew Templates ─────────────────────────────────────
// Lightweight NPC stat blocks for ship crew, scaled by faction

export const CREW_TEMPLATES = {
  captain: {
    role: "Captain",
    attributes: { strength: 3, agility: 3, wits: 4, empathy: 4 },
    skills: { command: 3, manipulation: 2, rangedcombat: 2, observation: 2, pilot: 1 }
  },
  pilot: {
    role: "Pilot",
    attributes: { strength: 2, agility: 4, wits: 4, empathy: 2 },
    skills: { pilot: 3, observation: 2, technology: 1, rangedcombat: 1 }
  },
  gunner: {
    role: "Gunner",
    attributes: { strength: 3, agility: 4, wits: 3, empathy: 2 },
    skills: { rangedcombat: 3, observation: 2, technology: 1, pilot: 1 }
  },
  engineer: {
    role: "Engineer",
    attributes: { strength: 3, agility: 3, wits: 4, empathy: 2 },
    skills: { technology: 3, science: 1, force: 2, observation: 1 }
  },
  sensorOperator: {
    role: "Sensor Operator",
    attributes: { strength: 2, agility: 3, wits: 4, empathy: 3 },
    skills: { datadjinn: 3, observation: 2, technology: 2, science: 1 }
  },
  medic: {
    role: "Medic",
    attributes: { strength: 2, agility: 3, wits: 4, empathy: 4 },
    skills: { medicurgy: 3, observation: 2, science: 1 }
  }
};

// ── Faction-flavored ship name prefixes ────────────────────

export const FACTION_SHIP_NAMES = {
  criminal:    ["Blood", "Shadow", "Black", "Scar", "Venom", "Spite", "Razor", "Skull"],
  legion:      ["Vigilant", "Resolute", "Steadfast", "Iron", "Shield", "Guardian", "Valor", "Bastion"],
  mercenary:   ["Steel", "Hammer", "Vulture", "Havoc", "Fang", "Reaper", "Storm", "Cobra"],
  consortium:  ["Zenith", "Commerce", "Trade", "Sovereign", "Crown", "Authority", "Dominion", "Regent"],
  darkbetween: ["Hollow", "Void", "Whisper", "Dread", "Silence", "Maw", "Entropy", "Shade"],
  unknown:     ["Ghost", "Phantom", "Enigma", "Cipher", "Wraith", "Mirage", "Echo", "Drift"]
};
