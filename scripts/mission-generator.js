/**
 * Mission generator for Coriolis: The Third Horizon.
 *
 * Generates a complete mission briefing as a journal entry, with optional
 * auto-generation of patron NPC, antagonist NPC, linked combat encounter,
 * and linked ship encounter.
 */

import {
  MISSION_TEMPLATES,
  MISSION_COMPLICATIONS,
  MISSION_LOCATIONS,
  MISSION_REWARD_TIERS
} from "./data/missions.js";
import { NPC_FACTIONS } from "./data/npcs.js";
import { generateQuickNPC } from "./npc-generator.js";
import { generateEncounter } from "./encounter-generator.js";
import { generateShipEncounter } from "./ship-encounter-generator.js";

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

// ── Main Mission Generator ───────────────────────────────────

/**
 * Generate a complete mission.
 *
 * @param {object} options
 * @param {string} [options.templateKey] - Mission template key, or random
 * @param {string} [options.factionKey] - Patron faction, or random
 * @param {boolean} [options.generatePatron=true] - Create patron NPC
 * @param {boolean} [options.generateAntagonist=true] - Create antagonist NPC
 * @param {boolean} [options.generateEncounter=false] - Create linked encounter
 * @param {boolean} [options.generateShipEncounter=false] - Create linked ship encounter
 * @param {number} [options.partySize=4] - Party size for encounter scaling
 * @param {number} [options.partyXP=0] - Party XP for encounter scaling
 * @param {string} [options.difficulty="normal"] - Difficulty for encounters
 * @returns {Promise<{journal: JournalEntry, patronActor: Actor|null, antagonistActor: Actor|null, encounterResult: object|null, shipEncounterResult: object|null, summary: string}>}
 */
export async function generateMission(options = {}) {
  // Pick template
  const templateKey = options.templateKey || pickKey(MISSION_TEMPLATES);
  const template = MISSION_TEMPLATES[templateKey];
  if (!template) {
    ui.notifications.error("Unknown mission template.");
    return { journal: null, patronActor: null, antagonistActor: null, encounterResult: null, shipEncounterResult: null, summary: "Error: unknown template" };
  }

  // Pick faction
  const factionKey = options.factionKey || pickKey(NPC_FACTIONS);
  const faction = NPC_FACTIONS[factionKey];

  // Pick complication
  const complication = pick(MISSION_COMPLICATIONS);

  // Pick location
  const envLocations = MISSION_LOCATIONS[template.environment] || MISSION_LOCATIONS.any;
  const location = pick(envLocations);

  // Calculate reward
  const rewardTier = MISSION_REWARD_TIERS[template.rewardTier] || MISSION_REWARD_TIERS.standard;
  const baseBirr = randRange(rewardTier.birrRange[0], rewardTier.birrRange[1]);
  const reward = Math.round(baseBirr * (1 + template.rewardBonus));

  // Generate patron NPC
  let patronActor = null;
  const shouldGeneratePatron = options.generatePatron !== false;
  const patronArchetype = pick(template.patronArchetypes);
  let patronName = `${patronArchetype} patron`;

  if (shouldGeneratePatron) {
    const patronResult = await generateQuickNPC({
      archetypeKey: patronArchetype,
      factionKey,
      createActor: true
    });
    patronActor = patronResult.actor;
    if (patronActor) patronName = patronActor.name;
  }

  // Generate antagonist NPC
  let antagonistActor = null;
  const shouldGenerateAntagonist = options.generateAntagonist !== false;
  const antagonistArchetype = pick(template.antagonistArchetypes);
  // Pick a different faction for the antagonist
  const antagonistFactionKeys = Object.keys(NPC_FACTIONS).filter(k => k !== factionKey);
  const antagonistFactionKey = pick(antagonistFactionKeys);
  let antagonistName = `${antagonistArchetype} antagonist`;

  if (shouldGenerateAntagonist) {
    const antagonistResult = await generateQuickNPC({
      archetypeKey: antagonistArchetype,
      factionKey: antagonistFactionKey,
      createActor: true
    });
    antagonistActor = antagonistResult.actor;
    if (antagonistActor) antagonistName = antagonistActor.name;
  }

  // Generate linked encounter
  let encounterResult = null;
  if (options.generateEncounter && template.linkedEncounters.length > 0) {
    const encounterKey = pick(template.linkedEncounters);
    encounterResult = await generateEncounter({
      templateKey: encounterKey,
      difficulty: options.difficulty || "normal",
      partySize: options.partySize ?? 4,
      partyXP: options.partyXP ?? 0,
      generateLoot: true
    });
  }

  // Generate linked ship encounter
  let shipEncounterResult = null;
  if (options.generateShipEncounter && template.linkedShipEncounters.length > 0) {
    const shipEncounterKey = pick(template.linkedShipEncounters);
    shipEncounterResult = await generateShipEncounter({
      templateKey: shipEncounterKey,
      difficulty: options.difficulty || "normal",
      partySize: options.partySize ?? 4,
      partyXP: options.partyXP ?? 0,
      generateSalvage: true
    });
  }

  // Build journal HTML
  const html = buildMissionJournal({
    template,
    faction,
    complication,
    location,
    reward,
    rewardTier,
    patronName,
    patronArchetype,
    antagonistName,
    antagonistArchetype,
    antagonistFaction: NPC_FACTIONS[antagonistFactionKey],
    hasEncounter: !!encounterResult,
    hasShipEncounter: !!shipEncounterResult
  });

  const journal = await JournalEntry.implementation.create({
    name: `Mission: ${template.label}`,
    pages: [{
      name: "Mission Briefing",
      type: "text",
      text: { content: html, format: 1 }
    }]
  });

  const summary = `${template.label} — Patron: ${patronName} (${faction.label}) vs ${antagonistName}`;
  ui.notifications.info(`Mission generated: ${template.label}`);

  return { journal, patronActor, antagonistActor, encounterResult, shipEncounterResult, summary };
}

// ── Journal Builder ──────────────────────────────────────────

function buildMissionJournal(data) {
  const {
    template, faction, complication, location, reward, rewardTier,
    patronName, patronArchetype, antagonistName, antagonistArchetype,
    antagonistFaction, hasEncounter, hasShipEncounter
  } = data;

  let html = "";

  // Header
  html += `<h2>${template.label}</h2>`;
  html += `<p><em>${template.description}</em></p>`;
  html += `<hr>`;

  // Briefing
  html += `<h3>Briefing</h3>`;
  html += `<p><strong>Objective:</strong> ${template.objective}</p>`;
  html += `<p><strong>Location:</strong> ${location}</p>`;
  html += `<p><strong>Environment:</strong> ${template.environment}</p>`;

  // Patron
  html += `<h3>Patron</h3>`;
  html += `<p><strong>${patronName}</strong> — ${patronArchetype} working for <strong>${faction.label}</strong>.</p>`;

  // Antagonist
  html += `<h3>Antagonist</h3>`;
  html += `<p><strong>${antagonistName}</strong> — ${antagonistArchetype} allied with <strong>${antagonistFaction.label}</strong>.</p>`;

  // Complication
  html += `<h3>Complication</h3>`;
  html += `<p>${complication}</p>`;

  // Reward
  html += `<h3>Reward</h3>`;
  html += `<p><strong>${reward} birr</strong> (${rewardTier.label})</p>`;
  html += `<p><em>${rewardTier.description}</em></p>`;

  // Linked content
  if (hasEncounter || hasShipEncounter) {
    html += `<h3>Linked Encounters</h3>`;
    html += `<ul>`;
    if (hasEncounter) html += `<li>Combat encounter generated — check the Actors sidebar.</li>`;
    if (hasShipEncounter) html += `<li>Ship encounter generated — check the Actors sidebar.</li>`;
    html += `</ul>`;
  }

  html += `<hr><p><em>Generated by Coriolis AIO Generator</em></p>`;

  return html;
}
