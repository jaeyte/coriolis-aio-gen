/**
 * Party generator for Coriolis: The Third Horizon.
 *
 * Creates a group of 3-6 characters using the existing character generator,
 * ensures diverse concepts, assigns crew positions via affinity matching,
 * and places them in a shared Foundry folder.
 */

import { CONCEPTS } from "./data/concepts.js";
import { GROUP_CONCEPTS } from "./data/group-concepts.js";
import { CONCEPT_CREW_AFFINITY, CREW_POSITIONS_ORDER } from "./data/crew-roles.js";
import { generateCharacter } from "./generator.js";

// ── Utility ──────────────────────────────────────────────────

function pick(arr) {
  return arr[Math.floor(Math.random() * arr.length)];
}

function pickKey(obj) {
  const keys = Object.keys(obj);
  return keys[Math.floor(Math.random() * keys.length)];
}

function shuffle(arr) {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

// ── Concept Selection ───────────────────────────────────────

/**
 * Select unique concepts for the party.
 * If allowDuplicates is false, ensures no two party members share a concept.
 */
function selectConcepts(partySize, allowDuplicates) {
  const allKeys = Object.keys(CONCEPTS);

  if (allowDuplicates) {
    const result = [];
    for (let i = 0; i < partySize; i++) {
      result.push(pick(allKeys));
    }
    return result;
  }

  // Unique concepts — shuffle and slice
  const shuffled = shuffle(allKeys);
  return shuffled.slice(0, Math.min(partySize, shuffled.length));
}

// ── Crew Position Assignment ────────────────────────────────

/**
 * Assign crew positions to concepts using greedy affinity matching.
 * Returns an array of positions (one per index in conceptKeys) to support
 * duplicate concept keys.
 */
function assignCrewPositions(conceptKeys) {
  const positions = new Array(conceptKeys.length).fill(null);
  const takenPositions = new Set();

  // First pass: assign by affinity
  for (let i = 0; i < conceptKeys.length; i++) {
    const affinities = CONCEPT_CREW_AFFINITY[conceptKeys[i]] || [];

    for (const pos of affinities) {
      if (!takenPositions.has(pos)) {
        positions[i] = pos;
        takenPositions.add(pos);
        break;
      }
    }
  }

  // Second pass: fill unassigned members with remaining positions
  const remainingPositions = CREW_POSITIONS_ORDER.filter(p => !takenPositions.has(p));
  let remIdx = 0;

  for (let i = 0; i < positions.length; i++) {
    if (positions[i] !== null) continue;

    if (remIdx < remainingPositions.length) {
      positions[i] = remainingPositions[remIdx++];
    } else {
      // More crew than positions — cycle through all positions
      positions[i] = CREW_POSITIONS_ORDER[i % CREW_POSITIONS_ORDER.length];
    }
  }

  return positions;
}

// ── Main Party Generator ────────────────────────────────────

/**
 * Generate a party of characters.
 *
 * @param {object} options
 * @param {number} [options.partySize=4] - Number of characters (3-6)
 * @param {string} [options.groupConceptKey] - Shared group concept, or random
 * @param {boolean} [options.allowDuplicates=false] - Allow duplicate concepts
 * @returns {Promise<{actors: Actor[], folder: Folder, summary: string}>}
 */
export async function generateParty(options = {}) {
  const partySize = Math.max(3, Math.min(6, options.partySize ?? 4));
  const groupConceptKey = options.groupConceptKey || pickKey(GROUP_CONCEPTS);
  const allowDuplicates = options.allowDuplicates ?? false;

  const groupConcept = GROUP_CONCEPTS[groupConceptKey];
  if (!groupConcept) {
    ui.notifications.error("Unknown group concept.");
    return { actors: [], folder: null, summary: "Error: unknown group concept" };
  }

  // Select concepts
  const conceptKeys = selectConcepts(partySize, allowDuplicates);

  // Assign crew positions
  const crewAssignments = assignCrewPositions(conceptKeys);

  // Create folder for the party
  const folder = await Folder.implementation.create({
    name: `${groupConcept.label} Crew`,
    type: "Actor"
  });

  // Generate each character
  const actors = [];
  for (let i = 0; i < conceptKeys.length; i++) {
    const actor = await generateCharacter({
      actorType: "character",
      conceptKey: conceptKeys[i],
      groupConceptKey
    });

    if (actor) {
      // Move to party folder and set crew position
      const crewPosition = crewAssignments[i] || "";
      await actor.update({
        folder: folder.id,
        "system.bio.crewPosition.position": crewPosition
      });
      actors.push(actor);
    }
  }

  // Build summary
  const memberList = actors.map(a => {
    const concept = a.system?.bio?.concept || "Unknown";
    return `${a.name} (${concept})`;
  }).join(", ");

  const summary = `${groupConcept.label} — ${actors.length} members: ${memberList}`;

  ui.notifications.info(`Party generated: ${groupConcept.label} — ${actors.length} characters.`);

  return { actors, folder, summary };
}
