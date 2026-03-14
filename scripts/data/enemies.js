/**
 * Enemy templates for encounter generation.
 *
 * Each enemy has base stats that scale with difficulty tier.
 * Difficulty tiers: "easy" (0.5x), "normal" (1x), "hard" (1.5x), "deadly" (2x)
 *
 * Categories:
 *  - minion: weak, appear in groups (thugs, beasts, drones)
 *  - regular: standard combatants (soldiers, guards, operatives)
 *  - elite: tough enemies with talents (officers, mystics, veterans)
 *  - boss: powerful single enemies (faction leaders, monsters, djinn)
 */

export const ENEMY_CATEGORIES = {
  minion: { label: "Minion", hpMultiplier: 0.6, talentSlots: 0, gearTier: "basic" },
  regular: { label: "Regular", hpMultiplier: 1.0, talentSlots: 1, gearTier: "standard" },
  elite: { label: "Elite", hpMultiplier: 1.4, talentSlots: 2, gearTier: "advanced" },
  boss: { label: "Boss", hpMultiplier: 2.0, talentSlots: 3, gearTier: "elite" }
};

export const DIFFICULTY_TIERS = {
  easy: { label: "Easy", statScale: 0.7, enemyCountScale: 0.7, lootScale: 0.5 },
  normal: { label: "Normal", statScale: 1.0, enemyCountScale: 1.0, lootScale: 1.0 },
  hard: { label: "Hard", statScale: 1.3, enemyCountScale: 1.2, lootScale: 1.5 },
  deadly: { label: "Deadly", statScale: 1.6, enemyCountScale: 1.5, lootScale: 2.0 }
};

/**
 * XP-based scaling thresholds.
 * The party's total XP spent determines their "power level" which
 * influences enemy stat scaling on top of difficulty tier.
 */
export const XP_SCALING = {
  novice:     { maxXP: 10,  label: "Novice",      statBonus: 0 },
  seasoned:   { maxXP: 30,  label: "Seasoned",     statBonus: 1 },
  veteran:    { maxXP: 60,  label: "Veteran",      statBonus: 2 },
  elite:      { maxXP: 100, label: "Elite",        statBonus: 3 },
  legendary:  { maxXP: Infinity, label: "Legendary", statBonus: 4 }
};

/**
 * Determine XP tier from total XP spent.
 */
export function getXPTier(totalXP) {
  for (const [key, tier] of Object.entries(XP_SCALING)) {
    if (totalXP <= tier.maxXP) return { key, ...tier };
  }
  return { key: "legendary", ...XP_SCALING.legendary };
}

/**
 * Enemy templates organized by faction/type.
 *
 * Base stats assume "normal" difficulty, "novice" XP tier.
 * The generator scales these based on chosen difficulty + party XP.
 */
export const ENEMIES = {
  // ── Humanoid Combatants ────────────────────────────────────
  thug: {
    name: "Thug",
    category: "minion",
    faction: "criminal",
    attributes: { strength: 3, agility: 3, wits: 2, empathy: 2 },
    skills: { meleecombat: 2, force: 2, infiltration: 1 },
    weapons: ["knife", "club"],
    armor: null,
    gear: [],
    talents: [],
    description: "A common street tough, armed and dangerous in numbers."
  },
  pirate: {
    name: "Pirate",
    category: "regular",
    faction: "criminal",
    attributes: { strength: 3, agility: 4, wits: 3, empathy: 2 },
    skills: { rangedcombat: 3, meleecombat: 2, pilot: 2, infiltration: 1 },
    weapons: ["vulcanPistol", "knife"],
    armor: "lightVest",
    gear: ["tabak", "lockPicks"],
    talents: ["quickdraw"],
    description: "A spacefaring raider who preys on shipping lanes."
  },
  corsairCaptain: {
    name: "Corsair Captain",
    category: "boss",
    faction: "criminal",
    attributes: { strength: 4, agility: 5, wits: 4, empathy: 3 },
    skills: { rangedcombat: 4, meleecombat: 3, command: 3, pilot: 3, manipulation: 2 },
    weapons: ["thermPistol", "saber", "vulcanPistol"],
    armor: "armorVest",
    gear: ["communicator", "tabak"],
    talents: ["combatveteran", "ninelives", "quickdraw"],
    description: "A feared pirate lord commanding a crew of cutthroats."
  },
  legionPatrol: {
    name: "Legion Patrol Soldier",
    category: "regular",
    faction: "legion",
    attributes: { strength: 4, agility: 3, wits: 3, empathy: 2 },
    skills: { rangedcombat: 3, meleecombat: 2, survival: 2, observation: 2 },
    weapons: ["vulcanCarbine", "knife"],
    armor: "armorVest",
    gear: ["communicator", "medkit"],
    talents: ["combatveteran"],
    description: "A disciplined soldier of the Legion, well-trained and equipped."
  },
  legionOfficer: {
    name: "Legion Officer",
    category: "elite",
    faction: "legion",
    attributes: { strength: 3, agility: 4, wits: 4, empathy: 3 },
    skills: { rangedcombat: 3, command: 3, observation: 2, manipulation: 2, meleecombat: 2 },
    weapons: ["thermPistol", "saber"],
    armor: "armorVest",
    gear: ["communicator", "medkit", "binoculars"],
    talents: ["combatveteran", "quickdraw"],
    description: "A seasoned Legion officer who leads from the front."
  },
  consortiumAgent: {
    name: "Consortium Agent",
    category: "regular",
    faction: "consortium",
    attributes: { strength: 3, agility: 4, wits: 4, empathy: 3 },
    skills: { rangedcombat: 2, infiltration: 3, manipulation: 3, observation: 2, datadjinn: 2 },
    weapons: ["vulcanPistol", "knife"],
    armor: "lightVest",
    gear: ["communicator", "computerTablet"],
    talents: ["camouflage"],
    description: "A covert operative of the Zenithian Hegemony."
  },
  consortiumEnforcer: {
    name: "Consortium Enforcer",
    category: "elite",
    faction: "consortium",
    attributes: { strength: 5, agility: 4, wits: 3, empathy: 2 },
    skills: { rangedcombat: 4, meleecombat: 3, force: 3, observation: 2 },
    weapons: ["vulcanCarbine", "knife", "vulcanPistol"],
    armor: "heavyArmor",
    gear: ["communicator"],
    talents: ["combatveteran", "tough"],
    description: "A heavily armed enforcer doing the Consortium's dirty work."
  },
  factionAssassin: {
    name: "Faction Assassin",
    category: "elite",
    faction: "assassins",
    attributes: { strength: 3, agility: 5, wits: 4, empathy: 2 },
    skills: { meleecombat: 4, infiltration: 4, dexterity: 3, observation: 3 },
    weapons: ["poisonedBlade", "vulcanCricket"],
    armor: null,
    gear: ["lockPicks"],
    talents: ["assassinsguild", "catlike"],
    description: "A deadly agent of the Assassin's Guild, striking from shadow."
  },
  stationGuard: {
    name: "Station Guard",
    category: "minion",
    faction: "civilian",
    attributes: { strength: 3, agility: 3, wits: 2, empathy: 2 },
    skills: { rangedcombat: 2, meleecombat: 1, observation: 2 },
    weapons: ["vulcanCricket", "stunBaton"],
    armor: "lightVest",
    gear: ["communicator"],
    talents: [],
    description: "A standard security guard on a space station."
  },
  mercenary: {
    name: "Mercenary",
    category: "regular",
    faction: "mercenary",
    attributes: { strength: 4, agility: 3, wits: 3, empathy: 2 },
    skills: { rangedcombat: 3, meleecombat: 2, survival: 2, force: 2 },
    weapons: ["vulcanCarbine", "knife"],
    armor: "lightVest",
    gear: ["communicator"],
    talents: ["combatveteran"],
    description: "A professional soldier of fortune."
  },
  mercCommander: {
    name: "Mercenary Commander",
    category: "boss",
    faction: "mercenary",
    attributes: { strength: 4, agility: 4, wits: 4, empathy: 3 },
    skills: { rangedcombat: 4, meleecombat: 3, command: 4, survival: 2, observation: 3 },
    weapons: ["vulcanCarbine", "vulcanPistol", "knife"],
    armor: "heavyArmor",
    gear: ["communicator", "medkit"],
    talents: ["combatveteran", "ninelives", "assault"],
    description: "A battle-hardened leader of a mercenary company."
  },

  // ── Cultists & Mystics ─────────────────────────────────────
  cultist: {
    name: "Cultist",
    category: "minion",
    faction: "cult",
    attributes: { strength: 2, agility: 2, wits: 3, empathy: 3 },
    skills: { meleecombat: 1, manipulation: 2, mysticpowers: 1 },
    weapons: ["ritualDagger", "staff"],
    armor: null,
    gear: ["prayerBeads"],
    talents: [],
    description: "A fanatical follower of a dark cult."
  },
  darkMystic: {
    name: "Dark Mystic",
    category: "elite",
    faction: "cult",
    attributes: { strength: 2, agility: 3, wits: 5, empathy: 4 },
    skills: { mysticpowers: 4, manipulation: 3, observation: 3, culture: 2 },
    weapons: ["staff", "ritualDagger"],
    armor: null,
    gear: ["prayerBeads", "incense"],
    talents: ["mysticaltelepathy", "mysticalpremonition"],
    description: "A powerful mystic wielding dark powers from beyond the stars."
  },
  cultLeader: {
    name: "Cult Leader",
    category: "boss",
    faction: "cult",
    attributes: { strength: 3, agility: 3, wits: 5, empathy: 5 },
    skills: { mysticpowers: 5, manipulation: 4, command: 3, culture: 3, observation: 3 },
    weapons: ["staff", "ritualDagger", "vulcanCricket"],
    armor: null,
    gear: ["prayerBeads", "incense", "communicator"],
    talents: ["mysticaltelepathy", "mysticalclairvoyant", "mysticaltelekinesis"],
    description: "A charismatic and terrifying leader of a forbidden cult."
  },

  // ── Beasts & Creatures ─────────────────────────────────────
  skavara: {
    name: "Skavara",
    category: "minion",
    faction: "beast",
    attributes: { strength: 3, agility: 4, wits: 1, empathy: 1 },
    skills: { meleecombat: 2, infiltration: 2, survival: 1 },
    weapons: ["claws"],
    armor: null,
    gear: [],
    talents: [],
    description: "A scuttling vermin that infests dark corners of stations and ships."
  },
  ghorHound: {
    name: "Ghor Hound",
    category: "regular",
    faction: "beast",
    attributes: { strength: 4, agility: 4, wits: 2, empathy: 1 },
    skills: { meleecombat: 3, observation: 3, survival: 2 },
    weapons: ["bite"],
    armor: "thickHide",
    talents: ["catlike"],
    description: "A powerful hunting beast with keen senses and vicious jaws."
  },
  megara: {
    name: "Megara",
    category: "elite",
    faction: "beast",
    attributes: { strength: 6, agility: 3, wits: 2, empathy: 1 },
    skills: { meleecombat: 4, force: 4, survival: 3 },
    weapons: ["crushingJaws"],
    armor: "thickHide",
    talents: ["tough", "ninelives"],
    description: "A massive predator from the jungles of Kua, capable of crushing a man in its jaws."
  },

  // ── Djinn & Supernatural ───────────────────────────────────
  darkboundServant: {
    name: "Darkbound Servant",
    category: "regular",
    faction: "darkbetween",
    attributes: { strength: 4, agility: 4, wits: 3, empathy: 1 },
    skills: { meleecombat: 3, infiltration: 3, force: 2 },
    weapons: ["shadowTouch", "darkBlast"],
    armor: null,
    gear: [],
    talents: ["catlike"],
    description: "A being touched by the Dark between the Stars, barely human anymore."
  },
  djinni: {
    name: "Djinni",
    category: "boss",
    faction: "darkbetween",
    attributes: { strength: 5, agility: 5, wits: 5, empathy: 5 },
    skills: { meleecombat: 5, mysticpowers: 5, manipulation: 4, observation: 4, infiltration: 3 },
    weapons: ["shadowTouch", "darkBlast"],
    armor: null,
    gear: [],
    talents: ["mysticaltelepathy", "mysticaltelekinesis", "mysticalpremonition"],
    description: "A terrifying entity from the Dark between the Stars. Encountering one may mean the end."
  }
};

/**
 * Enemy weapon definitions (simple keys referenced by enemy templates).
 */
export const ENEMY_WEAPONS = {
  knife:         { name: "Knife",           type: "weapon", system: { damage: 1, range: "contact", melee: true, weight: "L", techTier: "P", bonus: 0, initiative: 1 } },
  club:          { name: "Club",            type: "weapon", system: { damage: 2, range: "contact", melee: true, weight: "N", techTier: "P", bonus: 0, initiative: -1 } },
  saber:         { name: "Saber",           type: "weapon", system: { damage: 2, range: "contact", melee: true, weight: "N", techTier: "O", bonus: 1, initiative: 0 } },
  staff:         { name: "Staff",           type: "weapon", system: { damage: 1, range: "contact", melee: true, weight: "N", techTier: "P", bonus: 0, initiative: 0 } },
  poisonedBlade: { name: "Poisoned Blade",  type: "weapon", system: { damage: 2, range: "contact", melee: true, weight: "L", techTier: "O", bonus: 1, initiative: 1 } },
  vulcanCricket: { name: "Vulcan Cricket",  type: "weapon", system: { damage: 2, range: "short", melee: false, weight: "L", techTier: "O", bonus: 1, initiative: 0 } },
  vulcanPistol:  { name: "Vulcan Pistol",   type: "weapon", system: { damage: 2, range: "short", melee: false, weight: "L", techTier: "O", bonus: 1, initiative: 0 } },
  vulcanCarbine: { name: "Vulcan Carbine",  type: "weapon", system: { damage: 3, range: "long", melee: false, weight: "N", techTier: "O", bonus: 2, initiative: -2, automatic: true } },
  claws:         { name: "Claws",           type: "weapon", system: { damage: 2, range: "contact", melee: true, weight: "L", techTier: "P", bonus: 1, initiative: 2 } },
  bite:          { name: "Bite",            type: "weapon", system: { damage: 3, range: "contact", melee: true, weight: "N", techTier: "P", bonus: 1, initiative: 1 } },
  crushingJaws:  { name: "Crushing Jaws",   type: "weapon", system: { damage: 5, range: "contact", melee: true, weight: "H", techTier: "P", bonus: 2, initiative: -1 } },
  shadowTouch:   { name: "Shadow Touch",    type: "weapon", system: { damage: 3, range: "contact", melee: true, weight: "L", techTier: "P", bonus: 2, initiative: 2 } },
  darkBlast:     { name: "Dark Blast",      type: "weapon", system: { damage: 4, range: "short",   melee: false, weight: "L", techTier: "P", bonus: 2, initiative: 1 } },
  thermPistol:   { name: "Therm Pistol",    type: "weapon", system: { damage: 3, range: "short",   melee: false, weight: "L", techTier: "A", bonus: 2, initiative: 0 } },
  stunBaton:     { name: "Stun Baton",      type: "weapon", system: { damage: 2, range: "contact", melee: true,  weight: "N", techTier: "O", bonus: 1, initiative: 0 } },
  ritualDagger:  { name: "Ritual Dagger",   type: "weapon", system: { damage: 2, range: "contact", melee: true,  weight: "L", techTier: "O", bonus: 1, initiative: 1 } }
};

/**
 * Enemy armor definitions.
 */
export const ENEMY_ARMOR = {
  lightVest:  { name: "Light Armor Vest", type: "armor", system: { armorRating: 2, weight: "N", techTier: "O" } },
  armorVest:  { name: "Armor Vest",       type: "armor", system: { armorRating: 4, weight: "N", techTier: "O" } },
  heavyArmor: { name: "Heavy Armor",      type: "armor", system: { armorRating: 6, weight: "H", techTier: "A" } },
  thickHide:  { name: "Thick Hide",       type: "armor", system: { armorRating: 3, weight: "H", techTier: "P" } }
};

/**
 * Factions for filtering.
 */
/**
 * Enemy personal gear definitions.
 */
export const ENEMY_GEAR = {
  communicator:   { name: "Communicator",    type: "gear", system: { weight: "T", techTier: "O" } },
  medkit:         { name: "M-Dose",          type: "gear", system: { weight: "L", techTier: "O" } },
  tabak:          { name: "Tabak",           type: "gear", system: { weight: "T", techTier: "P", quantity: 3 } },
  lockPicks:      { name: "Lock Picks",      type: "gear", system: { weight: "T", techTier: "O" } },
  computerTablet: { name: "Computer Tablet", type: "gear", system: { weight: "L", techTier: "O" } },
  binoculars:     { name: "Binoculars",      type: "gear", system: { weight: "L", techTier: "O" } },
  prayerBeads:    { name: "Prayer Beads",    type: "gear", system: { weight: "T", techTier: "P" } },
  incense:        { name: "Ritual Incense",  type: "gear", system: { weight: "T", techTier: "P" } },
  vulcanAmmo:     { name: "Vulcan Ammunition", type: "gear", system: { weight: "T", techTier: "O" } },
  thermCells:     { name: "Therm Cells",       type: "gear", system: { weight: "T", techTier: "A" } }
};

export const ENEMY_FACTIONS = {
  criminal:     { label: "Criminals & Pirates" },
  legion:       { label: "The Legion" },
  consortium:   { label: "The Consortium" },
  assassins:    { label: "Assassin's Guild" },
  mercenary:    { label: "Mercenaries" },
  civilian:     { label: "Civilian Security" },
  cult:         { label: "Cultists & Mystics" },
  beast:        { label: "Beasts & Creatures" },
  darkbetween:  { label: "The Dark Between the Stars" }
};
