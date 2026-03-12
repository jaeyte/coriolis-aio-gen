/**
 * AI-powered NPC generator for Coriolis: The Third Horizon.
 *
 * Takes a free-text prompt and calls the Anthropic API to produce a complete
 * NPC actor with attributes, skills, talents, gear, and narrative details.
 *
 * Requires an Anthropic API key stored in module settings.
 */

import { resolveFromCompendium } from "./compendium-resolver.js";

const MODULE_ID = "coriolis-aio-gen";

// ── System prompt ────────────────────────────────────────────

const SYSTEM_PROMPT = `You are a game master assistant for the tabletop RPG "Coriolis: The Third Horizon" (Year Zero Engine).

Given a user description, generate a COMPLETE NPC as a JSON object. Follow the Coriolis rules strictly:

ATTRIBUTES (4 attributes, each 2-5, total exactly 14):
- strength, agility, wits, empathy

SKILLS (16 skills, each 0-5):
- dexterity, force, infiltration, manipulation, meleecombat, observation, rangedcombat, survival
- command, culture, datadjinn, medicurgy, mysticpowers, pilot, science, technology
NPCs typically have 2-4 skills at 2-3, the rest at 0. Mystic NPCs should have mysticpowers 2-3.

DERIVED STATS:
- hitPoints = strength + agility
- mindPoints = wits + empathy
- reputation: 0-6 (based on status)
- birr: starting money (10-5000 based on wealth)

ITEMS: Provide realistic Coriolis gear. Each item needs name, type, and system fields.
- type must be one of: "weapon", "armor", "gear", "talent"
- For weapons: system needs { damage, critical, range (close/short/long/extreme), bonus }
- For armor: system needs { armorRating, extraFeatures }
- For gear: system needs { weight (light/normal/heavy), quantity, cost }
- For talents: system needs { description, category } where category is one of: general, icon, group, humanite, cybernetic, mysticalpowers

MYSTIC POWERS: If the NPC is mystical/supernatural, include talents with category "mysticalpowers".
Available powers: Clairvoyant, Telekinesis, Telepathy, Premonition, Mind Walker.

BIO fields:
- origin: a system/planet (Kua, Algol, Dabaran, Sadaal, Zalos, Mira, Coriolis station, etc.)
- upbringing: Plebeian, Stationary, or Privileged
- concept: their role/profession
- icon: one of the 16 Icons (Lady of Tears, The Dancer, The Gambler, The Merchant, The Deckhand, The Traveler, The Messenger, The Judge, The Faceless One, The Executioner, The Draconite, Ahlam's Beloved, The Dreamer, The Martyr, The Guardian, The Seekers)
- groupConcept: faction or group
- personalProblem: a compelling personal conflict
- appearance.face: physical description
- appearance.clothing: what they wear

Respond with ONLY valid JSON matching this exact structure (no markdown, no explanation):
{
  "name": "NPC Name",
  "bio": {
    "origin": "",
    "upbringing": "",
    "concept": "",
    "icon": "",
    "groupConcept": "",
    "personalProblem": "",
    "appearance": { "face": "", "clothing": "" }
  },
  "attributes": {
    "strength": 0, "agility": 0, "wits": 0, "empathy": 0
  },
  "skills": {
    "dexterity": 0, "force": 0, "infiltration": 0, "manipulation": 0,
    "meleecombat": 0, "observation": 0, "rangedcombat": 0, "survival": 0,
    "command": 0, "culture": 0, "datadjinn": 0, "medicurgy": 0,
    "mysticpowers": 0, "pilot": 0, "science": 0, "technology": 0
  },
  "reputation": 0,
  "birr": 0,
  "items": [
    { "name": "", "type": "weapon|armor|gear|talent", "system": {} }
  ],
  "notes": "A short narrative summary of who this NPC is and their role in the story."
}`;

// ── API Call ─────────────────────────────────────────────────

/**
 * Call the Anthropic Messages API.
 *
 * @param {string} apiKey - Anthropic API key
 * @param {string} userPrompt - User's NPC description
 * @returns {Promise<object>} Parsed NPC JSON
 */
async function callAnthropicAPI(apiKey, userPrompt) {
  const response = await fetch("https://api.anthropic.com/v1/messages", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "x-api-key": apiKey,
      "anthropic-version": "2023-06-01",
      "anthropic-dangerous-direct-browser-access": "true"
    },
    body: JSON.stringify({
      model: "claude-sonnet-4-20250514",
      max_tokens: 2048,
      system: SYSTEM_PROMPT,
      messages: [
        { role: "user", content: userPrompt }
      ]
    })
  });

  if (!response.ok) {
    const errBody = await response.text();
    throw new Error(`Anthropic API error (${response.status}): ${errBody}`);
  }

  const data = await response.json();
  const text = data.content?.[0]?.text;
  if (!text) throw new Error("Empty response from Anthropic API");

  // Parse JSON — strip any accidental markdown fences
  const cleaned = text.replace(/^```json?\s*/i, "").replace(/\s*```$/i, "").trim();
  return JSON.parse(cleaned);
}

// ── NPC Builder ──────────────────────────────────────────────

/**
 * Try to upgrade each item via compendium lookup.
 */
async function enrichItems(items) {
  const enriched = [];
  for (const item of items) {
    const compendiumItem = await resolveFromCompendium(item.name, item.type);
    if (compendiumItem) {
      enriched.push(compendiumItem);
    } else {
      enriched.push(item);
    }
  }
  return enriched;
}

/**
 * Validate and clamp NPC data to legal Coriolis ranges.
 */
function sanitizeNPC(npc) {
  const clamp = (v, lo, hi) => Math.max(lo, Math.min(hi, Math.round(v) || lo));

  // Attributes: each 2-5, total 14
  const attrs = npc.attributes || {};
  for (const key of ["strength", "agility", "wits", "empathy"]) {
    attrs[key] = clamp(attrs[key], 2, 5);
  }
  // Adjust total to 14
  let total = attrs.strength + attrs.agility + attrs.wits + attrs.empathy;
  const attrKeys = ["strength", "agility", "wits", "empathy"];
  while (total > 14) {
    for (const k of attrKeys) {
      if (total <= 14) break;
      if (attrs[k] > 2) { attrs[k]--; total--; }
    }
  }
  while (total < 14) {
    for (const k of attrKeys) {
      if (total >= 14) break;
      if (attrs[k] < 5) { attrs[k]++; total++; }
    }
  }
  npc.attributes = attrs;

  // Skills: each 0-5
  const skills = npc.skills || {};
  const allSkills = [
    "dexterity", "force", "infiltration", "manipulation",
    "meleecombat", "observation", "rangedcombat", "survival",
    "command", "culture", "datadjinn", "medicurgy",
    "mysticpowers", "pilot", "science", "technology"
  ];
  for (const s of allSkills) {
    skills[s] = clamp(skills[s], 0, 5);
  }
  npc.skills = skills;

  npc.reputation = clamp(npc.reputation, 0, 10);
  npc.birr = clamp(npc.birr, 0, 99999);

  return npc;
}

// ── Main Export ──────────────────────────────────────────────

/**
 * Generate an NPC from a free-text prompt using the Anthropic API.
 *
 * @param {object} options
 * @param {string} options.prompt - User's NPC description
 * @returns {Promise<{actor: Actor|null, summary: string}>}
 */
export async function generateAINpc(options = {}) {
  const apiKey = game.settings.get(MODULE_ID, "anthropicApiKey");
  if (!apiKey) {
    ui.notifications.error(
      game.i18n.localize("CORIOLIS_AIO.AINPC.NoApiKey")
    );
    return { actor: null, summary: "Error: no API key configured" };
  }

  const prompt = options.prompt?.trim();
  if (!prompt) {
    ui.notifications.warn("Please enter an NPC description.");
    return { actor: null, summary: "Error: empty prompt" };
  }

  ui.notifications.info(
    game.i18n.localize("CORIOLIS_AIO.AINPC.Generating")
  );

  let npcData;
  try {
    npcData = await callAnthropicAPI(apiKey, prompt);
  } catch (err) {
    console.error(`${MODULE_ID} | AI NPC generation failed:`, err);
    ui.notifications.error(`AI generation failed: ${err.message}`);
    return { actor: null, summary: `Error: ${err.message}` };
  }

  npcData = sanitizeNPC(npcData);

  // Enrich items via compendium
  const items = await enrichItems(npcData.items || []);

  const bio = npcData.bio || {};
  const attrs = npcData.attributes;
  const hpMax = attrs.strength + attrs.agility;
  const mpMax = attrs.wits + attrs.empathy;

  // Build skill values
  const skillsData = {};
  for (const [key, val] of Object.entries(npcData.skills)) {
    skillsData[key] = { value: val };
  }

  const actorData = {
    name: npcData.name || "Unnamed NPC",
    type: "npc",
    system: {
      bio: {
        origin: bio.origin || "",
        upbringing: bio.upbringing || "",
        humanite: false,
        concept: bio.concept || "",
        icon: bio.icon || "",
        groupConcept: bio.groupConcept || "",
        personalProblem: bio.personalProblem || "",
        appearance: {
          face: bio.appearance?.face || "",
          clothing: bio.appearance?.clothing || ""
        },
        crewPosition: { position: "", shipId: "" }
      },
      attributes: {
        strength: { value: attrs.strength },
        agility: { value: attrs.agility },
        wits: { value: attrs.wits },
        empathy: { value: attrs.empathy }
      },
      skills: skillsData,
      hitPoints: { value: hpMax },
      mindPoints: { value: mpMax },
      experience: { value: 0 },
      radiation: { value: 0 },
      reputation: { value: npcData.reputation || 0 },
      birr: npcData.birr || 0,
      movementRate: 10,
      notes: npcData.notes || `AI-generated NPC.\nPrompt: ${prompt}`
    },
    items
  };

  const actor = await Actor.implementation.create(actorData);
  const summary = `AI NPC: "${actor.name}" — ${bio.concept || "custom"}`;
  ui.notifications.info(`AI NPC created: ${actor.name}`);
  return { actor, summary };
}
