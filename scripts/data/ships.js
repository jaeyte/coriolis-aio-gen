/**
 * Ship data for the ship generator.
 *
 * Defines ship classes, modules, name components, quirks/problems,
 * and crew positions for generating complete vessel profiles.
 */

// ── Ship Classes ─────────────────────────────────────────────

export const SHIP_CLASSES = {
  lightFreighter: {
    label: "Light Freighter",
    description: "A small, versatile cargo hauler common throughout the Third Horizon. Reliable and easy to maintain.",
    hullPoints: [4, 6],
    armor: [2, 4],
    speed: [2, 4],
    maneuverability: [1, 3],
    crewMin: 2,
    crewMax: 6,
    moduleSlots: [6, 9],
    requiredModules: ["bridge", "reactor", "gravitonProjector", "cabins", "cargoHold"],
    optionalModulePools: [
      "escapePods", "medlab", "workshop", "sensorArray",
      "smugglerCompartment", "dockingClamps", "armorPlating"
    ]
  },
  patrolBoat: {
    label: "Patrol Boat",
    description: "A fast, lightly armed vessel used by factions for policing shipping lanes and border security.",
    hullPoints: [5, 7],
    armor: [3, 5],
    speed: [3, 5],
    maneuverability: [2, 4],
    crewMin: 4,
    crewMax: 8,
    moduleSlots: [7, 10],
    requiredModules: ["bridge", "reactor", "gravitonProjector", "cabins", "turret"],
    optionalModulePools: [
      "sensorArray", "torpedoLauncher", "escapePods", "medlab",
      "armorPlating", "ecm", "stasisHold", "workshop",
      "autocannon", "pointDefense"
    ]
  },
  courier: {
    label: "Courier",
    description: "A swift, lightweight ship built for speed. Favored by messengers, smugglers, and spies alike.",
    hullPoints: [3, 5],
    armor: [1, 3],
    speed: [4, 6],
    maneuverability: [3, 5],
    crewMin: 1,
    crewMax: 4,
    moduleSlots: [5, 7],
    requiredModules: ["bridge", "reactor", "gravitonProjector", "cabins"],
    optionalModulePools: [
      "smugglerCompartment", "sensorArray", "escapePods", "ecm",
      "cargoHold", "turret", "armorPlating", "autocannon"
    ]
  },
  bulkHauler: {
    label: "Bulk Hauler",
    description: "A massive freighter designed to move enormous quantities of goods across the Horizon. Slow but capacious.",
    hullPoints: [8, 12],
    armor: [4, 6],
    speed: [1, 2],
    maneuverability: [0, 1],
    crewMin: 6,
    crewMax: 15,
    moduleSlots: [10, 14],
    requiredModules: ["bridge", "reactor", "gravitonProjector", "cabins", "cargoHold", "cargoHold"],
    optionalModulePools: [
      "escapePods", "medlab", "workshop", "dockingClamps",
      "sensorArray", "turret", "armorPlating", "stasisHold",
      "hangarBay", "cargoHold", "pointDefense", "heavyCannon"
    ]
  },
  armedMerchant: {
    label: "Armed Merchant",
    description: "A trade vessel fitted with weapons for self-defense. Popular along dangerous routes where piracy is rampant.",
    hullPoints: [6, 9],
    armor: [3, 5],
    speed: [2, 4],
    maneuverability: [1, 3],
    crewMin: 4,
    crewMax: 10,
    moduleSlots: [8, 12],
    requiredModules: ["bridge", "reactor", "gravitonProjector", "cabins", "cargoHold", "turret"],
    optionalModulePools: [
      "torpedoLauncher", "sensorArray", "escapePods", "medlab",
      "workshop", "armorPlating", "ecm", "smugglerCompartment",
      "dockingClamps", "autocannon", "heavyCannon", "pointDefense"
    ]
  },
  explorationVessel: {
    label: "Exploration Vessel",
    description: "A long-range ship equipped for deep-space exploration and scientific survey missions beyond charted space.",
    hullPoints: [5, 8],
    armor: [2, 4],
    speed: [2, 4],
    maneuverability: [1, 3],
    crewMin: 4,
    crewMax: 12,
    moduleSlots: [9, 13],
    requiredModules: ["bridge", "reactor", "gravitonProjector", "cabins", "sensorArray", "medlab"],
    optionalModulePools: [
      "escapePods", "workshop", "cargoHold", "hangarBay",
      "turret", "armorPlating", "stasisHold", "dockingClamps",
      "ecm", "laboratory", "pointDefense", "miningLaser"
    ]
  },
  warship: {
    label: "Warship",
    description: "A purpose-built military vessel bristling with weapons. The backbone of any fleet.",
    hullPoints: [8, 12],
    armor: [5, 8],
    speed: [2, 4],
    maneuverability: [1, 3],
    crewMin: 8,
    crewMax: 20,
    moduleSlots: [10, 14],
    requiredModules: ["bridge", "reactor", "gravitonProjector", "cabins", "turret", "turret"],
    optionalModulePools: [
      "torpedoLauncher", "heavyCannon", "pointDefense", "autocannon",
      "sensorArray", "armorPlating", "ecm", "escapePods",
      "medlab", "workshop", "hangarBay"
    ]
  },
  luxuryYacht: {
    label: "Luxury Yacht",
    description: "An opulent vessel favored by the wealthy elite. Fast, comfortable, and lightly armed.",
    hullPoints: [4, 6],
    armor: [1, 3],
    speed: [3, 5],
    maneuverability: [2, 4],
    crewMin: 2,
    crewMax: 6,
    moduleSlots: [7, 10],
    requiredModules: ["bridge", "reactor", "gravitonProjector", "cabins", "cabins"],
    optionalModulePools: [
      "turret", "sensorArray", "escapePods", "medlab",
      "ecm", "dockingClamps", "armorPlating", "hangarBay"
    ]
  },
  colonyShip: {
    label: "Colony Ship",
    description: "A massive vessel designed to transport settlers and supplies to new worlds. Slow but self-sufficient.",
    hullPoints: [10, 16],
    armor: [3, 5],
    speed: [1, 2],
    maneuverability: [0, 1],
    crewMin: 10,
    crewMax: 30,
    moduleSlots: [12, 18],
    requiredModules: ["bridge", "reactor", "gravitonProjector", "cabins", "cabins", "cargoHold", "cargoHold", "medlab"],
    optionalModulePools: [
      "stasisHold", "laboratory", "workshop", "hangarBay",
      "escapePods", "sensorArray", "turret", "pointDefense",
      "armorPlating", "dockingClamps", "cargoHold"
    ]
  }
};

// ── Ship Modules ─────────────────────────────────────────────

export const SHIP_MODULES = {
  bridge: {
    label: "Bridge",
    category: "required",
    description: "The ship's command center with navigation, communication, and flight controls."
  },
  reactor: {
    label: "Reactor",
    category: "required",
    description: "The ship's power plant. Without it, nothing works."
  },
  gravitonProjector: {
    label: "Graviton Projector",
    category: "required",
    description: "Generates artificial gravity throughout the vessel."
  },
  cabins: {
    label: "Crew Cabins",
    category: "required",
    description: "Living quarters for the ship's crew, with bunks and basic amenities."
  },
  cargoHold: {
    label: "Cargo Hold",
    category: "cargo",
    description: "A standard cargo bay for transporting goods and supplies."
  },
  smugglerCompartment: {
    label: "Smuggler's Compartment",
    category: "cargo",
    description: "A hidden compartment shielded from standard scans. Perfect for contraband."
  },
  stasisHold: {
    label: "Stasis Hold",
    category: "cargo",
    description: "A refrigerated hold with stasis fields for transporting perishable or dangerous cargo."
  },
  turret: {
    label: "Turret",
    category: "weapon",
    description: "A weapon emplacement housing a mounted cannon or autocannon.",
    damage: 3, range: "medium", crit: { numericValue: 3, customValue: "" }, bonus: 1, enabled: true
  },
  torpedoLauncher: {
    label: "Torpedo Launcher",
    category: "weapon",
    description: "A launcher system for ship-to-ship torpedoes. Devastating but limited ammunition.",
    damage: 6, range: "long", crit: { numericValue: 2, customValue: "" }, bonus: 0, enabled: true
  },
  autocannon: {
    label: "Autocannon",
    category: "weapon",
    description: "A rapid-fire ballistic weapon, effective at close range against lightly armored targets.",
    damage: 2, range: "short", crit: { numericValue: 3, customValue: "" }, bonus: 2, enabled: true
  },
  pointDefense: {
    label: "Point Defense System",
    category: "weapon",
    description: "A rapid-tracking turret designed to intercept incoming torpedoes and small craft.",
    damage: 1, range: "short", crit: { numericValue: 0, customValue: "" }, bonus: 3, enabled: true
  },
  heavyCannon: {
    label: "Heavy Cannon",
    category: "weapon",
    description: "A massive ship-mounted artillery piece capable of punching through heavy armor.",
    damage: 5, range: "long", crit: { numericValue: 1, customValue: "" }, bonus: -1, enabled: true
  },
  miningLaser: {
    label: "Mining Laser",
    category: "weapon",
    description: "An industrial cutting laser repurposed for combat. Short range but searing.",
    damage: 3, range: "short", crit: { numericValue: 2, customValue: "" }, bonus: 1, enabled: true
  },
  sensorArray: {
    label: "Sensor Array",
    category: "utility",
    description: "Advanced sensors for long-range detection, scanning, and electronic intelligence."
  },
  escapePods: {
    label: "Escape Pods",
    category: "utility",
    description: "Emergency evacuation pods for the crew. A wise precaution."
  },
  medlab: {
    label: "Medlab",
    category: "utility",
    description: "A medical facility for treating injuries and performing medicurgy."
  },
  workshop: {
    label: "Workshop",
    category: "utility",
    description: "A technical workshop for repairs, modifications, and crafting."
  },
  armorPlating: {
    label: "Armor Plating",
    category: "utility",
    description: "Reinforced hull plating that provides additional protection against attacks."
  },
  ecm: {
    label: "ECM Suite",
    category: "utility",
    description: "Electronic countermeasures for jamming enemy sensors and targeting systems."
  },
  dockingClamps: {
    label: "Docking Clamps",
    category: "utility",
    description: "External clamps for docking with stations, ships, or orbital structures."
  },
  hangarBay: {
    label: "Hangar Bay",
    category: "utility",
    description: "A small hangar capable of housing a shuttle or landing craft."
  },
  laboratory: {
    label: "Laboratory",
    category: "utility",
    description: "A scientific laboratory for research, analysis, and experimentation."
  }
};

// ── Ship Name Components ─────────────────────────────────────

export const SHIP_NAMES_PREFIX = ["The", "HMS", "ISS", ""];

export const SHIP_NAMES_FIRST = [
  "Star", "Void", "Night", "Dawn", "Iron",
  "Silver", "Shadow", "Crimson", "Amber", "Azure",
  "Ghost", "Storm", "Zenith", "Crescent", "Obsidian",
  "Astral", "Solar", "Onyx", "Horizon", "Sapphire"
];

export const SHIP_NAMES_SECOND = [
  "Wanderer", "Seeker", "Pilgrim", "Falcon", "Serpent",
  "Dagger", "Whisper", "Runner", "Dancer", "Howl",
  "Fang", "Talon", "Dreamer", "Flame", "Veil",
  "Corsair", "Arrow", "Blade", "Nomad", "Specter"
];

// ── Ship Problems / Quirks ───────────────────────────────────

export const SHIP_PROBLEMS = [
  "The reactor hums at an unsettling frequency that no engineer can explain.",
  "Gravity fluctuates unpredictably in the aft sections during portal jumps.",
  "The ship's AI occasionally addresses the crew by names they don't recognize.",
  "A persistent coolant leak leaves an acrid chemical smell in the lower decks.",
  "The previous owner's personal effects were never removed — and some are disturbing.",
  "Navigation sensors give phantom readings in the vicinity of gas giants.",
  "One airlock refuses to seal properly without a firm kick to the control panel.",
  "The ship creaks and groans in ways that sound almost like whispered speech.",
  "Electrical surges in the bridge short out the lights during stressful moments.",
  "A former crew member's prayer beads are welded to the bridge console — nobody dares remove them.",
  "The cargo hold smells faintly of something organic that no amount of cleaning can remove.",
  "Comms occasionally pick up transmissions in a language the computer cannot identify.",
  "The ship was once used for illegal fights — there are bloodstains in the hold that won't scrub out.",
  "One of the cabins is always ice-cold, regardless of climate settings.",
  "Port-side thrusters fire with a half-second delay, making docking a nervous affair."
];

// ── Crew Positions ───────────────────────────────────────────

export const CREW_POSITIONS = [
  { key: "captain", label: "Captain" },
  { key: "pilot", label: "Pilot" },
  { key: "engineer", label: "Engineer" },
  { key: "sensorOperator", label: "Sensor Operator" },
  { key: "gunner", label: "Gunner" },
  { key: "medic", label: "Medic" }
];
