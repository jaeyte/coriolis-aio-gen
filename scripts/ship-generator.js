/**
 * Ship generator for Coriolis: The Third Horizon.
 *
 * Generates a complete ship actor (yzecoriolis "ship" type) with:
 *  - Ship class with randomized stats within defined ranges
 *  - Embedded shipModule items for installed modules
 *  - Embedded shipProblem item for the ship's quirk
 *  - Generated ship name from prefix + first + second components
 *  - Crew roster noted in ship notes
 */

import {
  SHIP_CLASSES,
  SHIP_MODULES,
  SHIP_NAMES_PREFIX,
  SHIP_NAMES_FIRST,
  SHIP_NAMES_SECOND,
  SHIP_PROBLEMS,
  CREW_POSITIONS
} from "./data/ships.js";
import { resolveFromCompendium } from "./compendium-resolver.js";

// ── Utility ──────────────────────────────────────────────────

function pick(arr) {
  return arr[Math.floor(Math.random() * arr.length)];
}

function pickKey(obj) {
  const keys = Object.keys(obj);
  return keys[Math.floor(Math.random() * keys.length)];
}

function randRange(min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

function shuffle(arr) {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

// ── Name Generation ─────────────────────────────────────────

/**
 * Generate a ship name from component parts.
 * @returns {string}
 */
export function generateShipName() {
  const prefix = pick(SHIP_NAMES_PREFIX);
  const first = pick(SHIP_NAMES_FIRST);
  const second = pick(SHIP_NAMES_SECOND);
  const name = `${first} ${second}`;
  return prefix ? `${prefix} ${name}` : name;
}

// ── Module Selection ────────────────────────────────────────

/**
 * Select ship modules: all required modules plus random optional ones
 * to fill remaining slots.
 *
 * @param {object} shipClass - Ship class definition
 * @returns {string[]} Array of module keys
 */
export function selectModules(shipClass) {
  const totalSlots = randRange(shipClass.moduleSlots[0], shipClass.moduleSlots[1]);
  const modules = [...shipClass.requiredModules];

  // Fill remaining slots from optional pool
  const remaining = totalSlots - modules.length;
  if (remaining > 0 && shipClass.optionalModulePools.length > 0) {
    const shuffled = shuffle(shipClass.optionalModulePools);
    for (let i = 0; i < remaining && i < shuffled.length; i++) {
      modules.push(shuffled[i]);
    }
  }

  return modules;
}

// ── Crew Generation ─────────────────────────────────────────

/**
 * Generate a crew roster based on ship class crew capacity.
 *
 * @param {object} shipClass - Ship class definition
 * @returns {object[]} Array of { key, label }
 */
export function generateCrew(shipClass) {
  const crewSize = randRange(shipClass.crewMin, shipClass.crewMax);
  const crew = [];

  // Always assign core positions first (captain, pilot, engineer)
  const corePositions = CREW_POSITIONS.slice(0, 3);
  for (const pos of corePositions) {
    if (crew.length >= crewSize) break;
    crew.push({ ...pos });
  }

  // Fill remaining with other positions, cycling through if needed
  const extraPositions = CREW_POSITIONS.slice(3);
  let idx = 0;
  while (crew.length < crewSize) {
    const pos = extraPositions[idx % extraPositions.length];
    const count = crew.filter(c => c.key === pos.key).length;
    crew.push({
      key: pos.key,
      label: count > 0 ? `${pos.label} ${count + 1}` : pos.label
    });
    idx++;
  }

  return crew;
}

// ── Ship Stats ──────────────────────────────────────────────

/**
 * Roll stats within the ship class's defined ranges.
 *
 * @param {object} shipClass - Ship class definition
 * @returns {object} { hullPoints, armor, speed, maneuverability }
 */
export function rollStats(shipClass) {
  return {
    hullPoints: randRange(shipClass.hullPoints[0], shipClass.hullPoints[1]),
    armor: randRange(shipClass.armor[0], shipClass.armor[1]),
    speed: randRange(shipClass.speed[0], shipClass.speed[1]),
    maneuverability: randRange(shipClass.maneuverability[0], shipClass.maneuverability[1])
  };
}

// ── Embedded Item Builders ──────────────────────────────────

/**
 * Resolve a shipModule item — try compendium first, fall back to built-in.
 *
 * @param {string} moduleKey - Key from SHIP_MODULES
 * @returns {Promise<object>} Item data for embedded creation
 */
export async function resolveShipModule(moduleKey) {
  const builtIn = SHIP_MODULES[moduleKey];
  if (!builtIn) return null;

  // Try compendium
  const compendiumItem = await resolveFromCompendium(builtIn.label, "shipModule");
  if (compendiumItem) return compendiumItem;

  // Fall back to built-in
  const systemData = {
    description: builtIn.description,
    category: builtIn.category,
    quantity: 1
  };

  // Include weapon stats for weapon modules
  if (builtIn.category === "weapon") {
    systemData.damage = builtIn.damage ?? 0;
    systemData.range = builtIn.range ?? "";
    systemData.crit = builtIn.crit ?? { numericValue: 0, customValue: "" };
    systemData.bonus = builtIn.bonus ?? 0;
    systemData.enabled = builtIn.enabled ?? true;
  }

  return {
    name: builtIn.label,
    type: "shipModule",
    system: systemData
  };
}

/**
 * Build a shipProblem item from a problem description string.
 *
 * @param {string} problemText - The quirk/problem description
 * @returns {object} Item data for embedded creation
 */
function buildShipProblem(problemText) {
  return {
    name: "Ship Quirk",
    type: "shipProblem",
    system: {
      description: problemText
    }
  };
}

// ── Main Ship Generator ─────────────────────────────────────

/**
 * Generate a complete ship as a Foundry actor.
 *
 * @param {object} options
 * @param {string} [options.classKey] - Ship class key, or random
 * @param {string} [options.name] - Ship name, or auto-generated
 * @param {boolean} [options.includeProblem=true] - Whether to include a quirk/problem
 * @returns {Promise<{actor: Actor, summary: string}>}
 */
export async function generateShip(options = {}) {
  // 1. Ship class
  const classKey = options.classKey || pickKey(SHIP_CLASSES);
  const shipClass = SHIP_CLASSES[classKey];
  if (!shipClass) {
    ui.notifications.error("Unknown ship class.");
    return { actor: null, summary: "Error: unknown ship class" };
  }

  // 2. Name
  const name = options.name || generateShipName();

  // 3. Stats
  const stats = rollStats(shipClass);

  // 4. Modules
  const moduleKeys = selectModules(shipClass);

  // 5. Crew
  const crew = generateCrew(shipClass);

  // 6. Problem / Quirk
  const includeProblem = options.includeProblem !== false;
  const problem = includeProblem ? pick(SHIP_PROBLEMS) : null;

  // 7. Build embedded items
  const embeddedItems = [];

  // Resolve modules
  for (const modKey of moduleKeys) {
    const moduleItem = await resolveShipModule(modKey);
    if (moduleItem) embeddedItems.push(moduleItem);
  }

  // Add problem
  if (problem) {
    embeddedItems.push(buildShipProblem(problem));
  }

  // 8. Build crew notes
  const crewList = crew.map(c => c.label).join(", ");
  const notes = [
    `${shipClass.label} — ${shipClass.description}`,
    `\nCrew (${crew.length}): ${crewList}`,
    "\nGenerated by Coriolis AIO Generator."
  ].join("");

  // 9. Create actor
  // Note: yzecoriolis uses "manueverability" (their typo) in template.json
  const actorData = {
    name,
    type: "ship",
    system: {
      class: "I",
      shipType: shipClass.label,
      hullPoints: { value: stats.hullPoints, min: 0, max: stats.hullPoints },
      manueverability: { value: stats.maneuverability, min: 0, max: 25 },
      speed: { value: stats.speed, min: 0, max: 25 },
      armor: { value: stats.armor, min: 0, max: 25 },
      signature: { value: 0, min: 0, max: 25 },
      maxEnergyPoints: Math.max(5, stats.hullPoints),
      notes
    },
    items: embeddedItems
  };

  const actor = await Actor.implementation.create(actorData);

  // Summary
  const moduleCount = moduleKeys.length;
  const summary = `${shipClass.label} "${name}" — HP ${stats.hullPoints} / Armor ${stats.armor} / Speed ${stats.speed} — ${moduleCount} modules, ${crew.length} crew`;

  ui.notifications.info(`Ship generated: ${name} (${shipClass.label})`);

  return { actor, summary };
}
