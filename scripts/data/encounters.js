/**
 * Pre-built encounter templates for common scenarios.
 *
 * Each template defines a mix of enemy types and an optional environment/context.
 * The generator can use these as starting points and scale from there.
 */

export const ENCOUNTER_TEMPLATES = {
  // ── Combat Encounters ──────────────────────────────────────
  barFight: {
    label: "Bar Fight",
    description: "A brawl breaks out in a seedy cantina on the station promenade.",
    environment: "station",
    enemies: [
      { enemyKey: "thug", count: [3, 5] },
    ],
    lootBonus: 0
  },

  pirateAmbush: {
    label: "Pirate Ambush",
    description: "Pirates spring an ambush on the crew, looking for easy prey.",
    environment: "ship",
    enemies: [
      { enemyKey: "pirate", count: [2, 4] },
      { enemyKey: "thug", count: [1, 3] }
    ],
    lootBonus: 0.3,
    linkedShipEncounter: "pirateAmbush"
  },

  pirateRaid: {
    label: "Pirate Raid",
    description: "A full pirate boarding party assaults the ship, led by their captain.",
    environment: "ship",
    enemies: [
      { enemyKey: "corsairCaptain", count: [1, 1] },
      { enemyKey: "pirate", count: [3, 5] },
      { enemyKey: "thug", count: [2, 4] }
    ],
    lootBonus: 0.5,
    linkedShipEncounter: "corsairFleet"
  },

  legionCheckpoint: {
    label: "Legion Checkpoint",
    description: "A Legion patrol stops the crew for inspection. Things can go wrong fast.",
    environment: "station",
    enemies: [
      { enemyKey: "legionOfficer", count: [1, 1] },
      { enemyKey: "legionPatrol", count: [3, 5] }
    ],
    lootBonus: 0.2
  },

  consortiumRaid: {
    label: "Consortium Raid",
    description: "Consortium agents and enforcers move to apprehend the crew.",
    environment: "station",
    enemies: [
      { enemyKey: "consortiumEnforcer", count: [1, 2] },
      { enemyKey: "consortiumAgent", count: [2, 3] }
    ],
    lootBonus: 0.4
  },

  assassinStrike: {
    label: "Assassin Strike",
    description: "The Assassin's Guild has sent operatives to eliminate a target.",
    environment: "any",
    enemies: [
      { enemyKey: "factionAssassin", count: [1, 3] }
    ],
    lootBonus: 0.3
  },

  mercenarySquad: {
    label: "Mercenary Squad",
    description: "A mercenary squad hired to take down the crew.",
    environment: "any",
    enemies: [
      { enemyKey: "mercCommander", count: [1, 1] },
      { enemyKey: "mercenary", count: [3, 5] }
    ],
    lootBonus: 0.5
  },

  // ── Cult & Mystic Encounters ───────────────────────────────
  cultistAmbush: {
    label: "Cultist Ambush",
    description: "Fanatical cultists attack, driven by dark visions.",
    environment: "ruins",
    enemies: [
      { enemyKey: "darkMystic", count: [1, 1] },
      { enemyKey: "cultist", count: [3, 6] }
    ],
    lootBonus: 0.2
  },

  darkRitual: {
    label: "Dark Ritual",
    description: "The crew stumbles upon a forbidden ritual deep in a forgotten temple.",
    environment: "ruins",
    enemies: [
      { enemyKey: "cultLeader", count: [1, 1] },
      { enemyKey: "darkMystic", count: [1, 2] },
      { enemyKey: "cultist", count: [4, 8] }
    ],
    lootBonus: 0.6
  },

  // ── Beast Encounters ───────────────────────────────────────
  verminInfestation: {
    label: "Vermin Infestation",
    description: "Skavara have infested the lower decks. Time to clear them out.",
    environment: "ship",
    enemies: [
      { enemyKey: "skavara", count: [4, 8] }
    ],
    lootBonus: -0.5
  },

  wildHunt: {
    label: "Wild Hunt",
    description: "Ghor hounds on the prowl, hunting for fresh prey on a hostile world.",
    environment: "wilderness",
    enemies: [
      { enemyKey: "ghorHound", count: [2, 4] }
    ],
    lootBonus: -0.3
  },

  apexPredator: {
    label: "Apex Predator",
    description: "A massive megara has claimed this territory. The crew must deal with it.",
    environment: "wilderness",
    enemies: [
      { enemyKey: "megara", count: [1, 1] },
      { enemyKey: "ghorHound", count: [0, 2] }
    ],
    lootBonus: 0.1
  },

  // ── Supernatural Encounters ────────────────────────────────
  darkboundAttack: {
    label: "Darkbound Attack",
    description: "Beings touched by the Dark between the Stars emerge from the shadows.",
    environment: "any",
    enemies: [
      { enemyKey: "darkboundServant", count: [2, 4] }
    ],
    lootBonus: 0.2
  },

  djinnEncounter: {
    label: "Djinn Encounter",
    description: "A djinni manifests, bringing terror and the cold of the void.",
    environment: "any",
    enemies: [
      { enemyKey: "djinni", count: [1, 1] },
      { enemyKey: "darkboundServant", count: [2, 3] }
    ],
    lootBonus: 0.8
  },

  // ── Mixed / Security ───────────────────────────────────────
  securityAlert: {
    label: "Security Alert",
    description: "Station security has been alerted and is closing in.",
    environment: "station",
    enemies: [
      { enemyKey: "stationGuard", count: [4, 8] }
    ],
    lootBonus: 0
  }
};

/**
 * Environment types for filtering.
 */
export const ENVIRONMENTS = {
  any: { label: "Any Location" },
  station: { label: "Space Station" },
  ship: { label: "Aboard Ship" },
  wilderness: { label: "Wilderness / Planet" },
  ruins: { label: "Ruins / Temple" }
};
