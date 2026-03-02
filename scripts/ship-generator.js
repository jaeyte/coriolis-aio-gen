/**
 * Ship generator for Coriolis: The Third Horizon.
 *
 * Generates a complete ship profile with:
 *  - Ship class with randomized stats within defined ranges
 *  - Installed modules (required + random optional)
 *  - Generated ship name from prefix + first + second components
 *  - Ship quirk/problem for flavor
 *  - Crew roster with assigned positions
 *  - Journal entry containing the full ship profile
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
function generateShipName() {
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
function selectModules(shipClass) {
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
 * @returns {object[]} Array of { position, label }
 */
function generateCrew(shipClass) {
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
    // Add a numbered suffix if we're cycling
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
function rollStats(shipClass) {
  return {
    hullPoints: randRange(shipClass.hullPoints[0], shipClass.hullPoints[1]),
    armor: randRange(shipClass.armor[0], shipClass.armor[1]),
    speed: randRange(shipClass.speed[0], shipClass.speed[1]),
    maneuverability: randRange(shipClass.maneuverability[0], shipClass.maneuverability[1])
  };
}

// ── Journal Entry Creation ──────────────────────────────────

/**
 * Build an HTML summary of the generated ship.
 *
 * @param {object} ship - The generated ship data
 * @returns {string} HTML content
 */
function buildShipHtml(ship) {
  let html = `<h2>${ship.name}</h2>`;
  html += `<p><em>${ship.shipClass.description}</em></p>`;

  // Stats
  html += `<h3>Ship Profile</h3>`;
  html += `<table><tbody>`;
  html += `<tr><td><strong>Class</strong></td><td>${ship.shipClass.label}</td></tr>`;
  html += `<tr><td><strong>Hull Points</strong></td><td>${ship.stats.hullPoints}</td></tr>`;
  html += `<tr><td><strong>Armor</strong></td><td>${ship.stats.armor}</td></tr>`;
  html += `<tr><td><strong>Speed</strong></td><td>${ship.stats.speed}</td></tr>`;
  html += `<tr><td><strong>Maneuverability</strong></td><td>${ship.stats.maneuverability}</td></tr>`;
  html += `</tbody></table>`;

  // Modules
  html += `<h3>Installed Modules</h3><ul>`;
  for (const modKey of ship.modules) {
    const mod = SHIP_MODULES[modKey];
    if (mod) {
      html += `<li><strong>${mod.label}</strong> — ${mod.description}</li>`;
    }
  }
  html += `</ul>`;

  // Crew
  html += `<h3>Crew (${ship.crew.length})</h3><ul>`;
  for (const member of ship.crew) {
    html += `<li>${member.label}</li>`;
  }
  html += `</ul>`;

  // Problem
  if (ship.problem) {
    html += `<h3>Ship Quirk</h3>`;
    html += `<p><em>${ship.problem}</em></p>`;
  }

  html += `<hr><p><em>Generated by Coriolis AIO Generator</em></p>`;
  return html;
}

/**
 * Create a journal entry containing the ship profile.
 *
 * @param {object} ship - The generated ship data
 * @returns {Promise<JournalEntry>}
 */
async function createShipJournal(ship) {
  const html = buildShipHtml(ship);

  return JournalEntry.implementation.create({
    name: `Ship: ${ship.name}`,
    pages: [{
      name: ship.name,
      type: "text",
      text: { content: html, format: 1 }
    }]
  });
}

// ── Main Ship Generator ─────────────────────────────────────

/**
 * Generate a complete ship.
 *
 * @param {object} options
 * @param {string} [options.classKey] - Ship class key, or random
 * @param {string} [options.name] - Ship name, or auto-generated
 * @param {boolean} [options.includeProblem=true] - Whether to include a quirk/problem
 * @returns {Promise<{journal: JournalEntry, ship: object, summary: string}>}
 */
export async function generateShip(options = {}) {
  // 1. Ship class
  const classKey = options.classKey || pickKey(SHIP_CLASSES);
  const shipClass = SHIP_CLASSES[classKey];
  if (!shipClass) {
    ui.notifications.error("Unknown ship class.");
    return { journal: null, ship: null, summary: "Error: unknown ship class" };
  }

  // 2. Name
  const name = options.name || generateShipName();

  // 3. Stats
  const stats = rollStats(shipClass);

  // 4. Modules
  const modules = selectModules(shipClass);

  // 5. Crew
  const crew = generateCrew(shipClass);

  // 6. Problem / Quirk
  const includeProblem = options.includeProblem !== false;
  const problem = includeProblem ? pick(SHIP_PROBLEMS) : null;

  // Assemble ship data
  const ship = {
    name,
    classKey,
    shipClass,
    stats,
    modules,
    crew,
    problem
  };

  // 7. Create journal entry
  const journal = await createShipJournal(ship);

  // Summary
  const moduleCount = modules.length;
  const summary = `${shipClass.label} "${name}" — HP ${stats.hullPoints} / Armor ${stats.armor} / Speed ${stats.speed} — ${moduleCount} modules, ${crew.length} crew`;

  ui.notifications.info(`Ship generated: ${name} (${shipClass.label})`);

  return { journal, ship, summary };
}
