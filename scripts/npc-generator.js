/**
 * Quick NPC generator for Coriolis: The Third Horizon.
 *
 * Generates a narrative NPC with personality, motivation, quirk, and faction.
 * Can output either a journal entry (description only) or a full NPC actor
 * with attributes and skills that scale with a chosen difficulty tier.
 */

import {
  NPC_ARCHETYPES,
  NPC_FACTIONS,
  PERSONALITY_TRAITS,
  MOTIVATIONS,
  QUIRKS,
  PHYSICAL_BUILDS,
  AGE_RANGES,
  DISTINGUISHING_FEATURES
} from "./data/npcs.js";
import { ENEMY_WEAPONS, ENEMY_ARMOR, ENEMY_GEAR } from "./data/enemies.js";
import { resolveItem, resolveTalent } from "./compendium-resolver.js";
import { generateName } from "./data/names.js";
import { TALENTS } from "./data/talents.js";

// ── Difficulty Scales ─────────────────────────────────────────
// keyAttr  = [min, max] for the archetype's key attribute
// otherAttr = [min, max] for all other attributes
// keySkill = [min, max] for key skills
// birr/rep  = [min, max] for starting money and reputation

const DIFFICULTY_SCALES = {
  easy:   { keyAttr: [3, 3], otherAttr: [2, 2], keySkill: [1, 2], birr: [5,   50],   rep: [0, 1] },
  normal: { keyAttr: [4, 4], otherAttr: [2, 3], keySkill: [2, 3], birr: [10,  200],  rep: [0, 3] },
  hard:   { keyAttr: [4, 5], otherAttr: [3, 4], keySkill: [3, 4], birr: [50,  500],  rep: [1, 4] },
  deadly: { keyAttr: [5, 5], otherAttr: [3, 4], keySkill: [4, 5], birr: [100, 1000], rep: [2, 6] }
};

// ── Ammunition Mapping ──────────────────────────────────────
const AMMO_MAP = {
  vulcanCricket: { ammoKey: "vulcanAmmo", qty: 1 },
  vulcanPistol:  { ammoKey: "vulcanAmmo", qty: 1 },
  vulcanCarbine: { ammoKey: "vulcanAmmo", qty: 2 },
  thermPistol:   { ammoKey: "thermCells", qty: 1 },
  thermRifle:    { ammoKey: "thermCells", qty: 1 }
};

/**
 * Resolve ammunition items for a list of weapon keys.
 */
async function resolveAmmoForWeapons(weaponKeys) {
  const ammoNeeded = {};
  for (const wKey of weaponKeys) {
    const mapping = AMMO_MAP[wKey];
    if (mapping) {
      ammoNeeded[mapping.ammoKey] = (ammoNeeded[mapping.ammoKey] || 0) + mapping.qty;
    }
  }

  const items = [];
  for (const [ammoKey, qty] of Object.entries(ammoNeeded)) {
    const ammoData = ENEMY_GEAR[ammoKey];
    if (ammoData) {
      const resolved = await resolveItem({ ...ammoData, system: { ...ammoData.system, quantity: qty } });
      items.push(resolved);
    }
  }
  return items;
}

// All mystic power talent keys from talents.js
const MYSTIC_POWER_KEYS = [
  "mysticalclairvoyant",
  "mysticaltelekinesis",
  "mysticaltelepathy",
  "mysticalpremonition",
  "mysticalmindwalker"
];

// ── Utility ──────────────────────────────────────────────────

function pick(arr) {
  return arr[Math.floor(Math.random() * arr.length)];
}

function pickKey(obj) {
  const keys = Object.keys(obj);
  return keys[Math.floor(Math.random() * keys.length)];
}

function pickMultiple(arr, count) {
  const shuffled = [...arr];
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
  }
  return shuffled.slice(0, count);
}

function randRange(min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

// ── NPC Profile Assembly ────────────────────────────────────

const ALL_ATTRIBUTES = ["strength", "agility", "wits", "empathy"];

const ALL_SKILLS = [
  "dexterity", "force", "infiltration", "manipulation",
  "meleecombat", "observation", "rangedcombat", "survival",
  "command", "culture", "datadjinn", "medicurgy",
  "mysticpowers", "pilot", "science", "technology"
];

/**
 * Build attributes scaled to the chosen difficulty tier.
 * Key attribute is always higher; others vary by tier.
 */
function buildAttributes(archetype, scale) {
  const attrs = {};
  for (const attr of ALL_ATTRIBUTES) {
    attrs[attr] = attr === archetype.keyAttribute
      ? randRange(scale.keyAttr[0], scale.keyAttr[1])
      : randRange(scale.otherAttr[0], scale.otherAttr[1]);
  }
  return attrs;
}

/**
 * Build skills scaled to the chosen difficulty tier.
 * Key skills get the tier's range; non-key skills stay at 0.
 */
function buildSkills(archetype, scale) {
  const skills = {};
  for (const skill of ALL_SKILLS) {
    skills[skill] = {
      value: archetype.keySkills.includes(skill)
        ? randRange(scale.keySkill[0], scale.keySkill[1])
        : 0
    };
  }
  return skills;
}

/**
 * Resolve archetype gear into embeddable items.
 *
 * Weapon selection: picks ONE range tier from weaponPools, then ONE weapon
 * from that tier — so an NPC carries either close, short, or long range,
 * not a mix of all three.
 *
 * Optional gear is included with a 40% chance per item.
 */
async function resolveArchetypeGear(archetype) {
  const items = [];

  // Pick one range tier → one weapon
  const pools = archetype.weaponPools || {};
  const availableTiers = Object.keys(pools).filter(t => pools[t]?.length > 0);
  if (availableTiers.length > 0) {
    const chosenTier = pick(availableTiers);
    const wKey = pick(pools[chosenTier]);
    const wData = ENEMY_WEAPONS[wKey];
    if (wData) {
      const resolved = await resolveItem({ ...wData });
      items.push(resolved);
      // Ammo for ranged weapons
      const ammoItems = await resolveAmmoForWeapons([wKey]);
      items.push(...ammoItems);
    }
  }

  // Armor
  if (archetype.armor) {
    const aData = ENEMY_ARMOR[archetype.armor];
    if (aData) {
      const resolved = await resolveItem({ ...aData });
      items.push(resolved);
    }
  }

  // Base gear (always included)
  if (archetype.gear) {
    for (const gKey of archetype.gear) {
      const gData = ENEMY_GEAR[gKey];
      if (gData) {
        const resolved = await resolveItem({ ...gData });
        items.push(resolved);
      }
    }
  }

  // Optional gear (40% chance each)
  if (archetype.optionalGear) {
    for (const gKey of archetype.optionalGear) {
      if (Math.random() < 0.4) {
        const gData = ENEMY_GEAR[gKey];
        if (gData) {
          const resolved = await resolveItem({ ...gData });
          items.push(resolved);
        }
      }
    }
  }

  return items;
}

// ── Main NPC Generator ──────────────────────────────────────

/**
 * Generate a quick NPC.
 *
 * @param {object} options
 * @param {string} [options.archetypeKey] - Archetype key, or random
 * @param {string} [options.factionKey] - Faction key, or random
 * @param {string} [options.name] - Name, or auto-generated
 * @param {string} [options.difficulty="normal"] - Difficulty tier (easy/normal/hard/deadly)
 * @param {boolean} [options.createActor=false] - If true, create NPC actor; else journal entry
 * @param {boolean} [options.includeMysticPowers=true] - If true, qualifying archetypes get mystic powers
 * @returns {Promise<{actor: Actor|null, journal: JournalEntry|null, summary: string}>}
 */
export async function generateQuickNPC(options = {}) {
  const archetypeKey = options.archetypeKey || pickKey(NPC_ARCHETYPES);
  const archetype = NPC_ARCHETYPES[archetypeKey];
  if (!archetype) {
    ui.notifications.error("Unknown NPC archetype.");
    return { actor: null, journal: null, summary: "Error: unknown archetype" };
  }

  const factionKey = options.factionKey || pickKey(NPC_FACTIONS);
  const faction = NPC_FACTIONS[factionKey];

  const difficulty = options.difficulty || "normal";
  const scale = DIFFICULTY_SCALES[difficulty] || DIFFICULTY_SCALES.normal;

  const npcName = options.name || generateName();
  const traits = pickMultiple(PERSONALITY_TRAITS, randRange(2, 3));
  const motivation = pick(MOTIVATIONS);
  const quirk = pick(QUIRKS);
  const build = pick(PHYSICAL_BUILDS);
  const age = pick(AGE_RANGES);
  const feature = pick(DISTINGUISHING_FEATURES);

  const createActor = options.createActor ?? false;
  const includeMysticPowers = options.includeMysticPowers ?? true;

  if (createActor) {
    const attributes = buildAttributes(archetype, scale);
    const skills = buildSkills(archetype, scale);
    const hpMax = attributes.strength + attributes.agility;
    const mpMax = attributes.wits + attributes.empathy;

    const embeddedItems = await resolveArchetypeGear(archetype);

    // Resolve archetype talents (1-2)
    if (archetype.talents && archetype.talents.length > 0) {
      const talentCount = Math.min(archetype.talents.length, randRange(1, 2));
      const selectedTalents = pickMultiple(archetype.talents, talentCount);
      for (const tKey of selectedTalents) {
        const talentItem = await resolveTalent(tKey);
        if (talentItem) embeddedItems.push(talentItem);
      }
    }

    // Mystic powers for qualifying archetypes
    if (includeMysticPowers && archetype.mysticPowers) {
      const count = randRange(1, 2);
      const selected = pickMultiple(MYSTIC_POWER_KEYS, count);
      for (const key of selected) {
        const talent = await resolveTalent(key);
        if (talent) embeddedItems.push(talent);
      }
    }

    const notes = [
      `${archetype.label} — ${archetype.description}`,
      `\nFaction: ${faction.label}`,
      `\nDifficulty: ${difficulty.charAt(0).toUpperCase() + difficulty.slice(1)}`,
      `\n\n— Physical Description —`,
      `\n${build}. ${age}. ${feature}.`,
      `\n\n— Personality —`,
      `\n${traits.join("; ")}`,
      `\nMotivation: ${motivation}`,
      `\nQuirk: ${quirk}`,
      "\n\nGenerated by Coriolis AIO Generator."
    ].join("");

    const actorData = {
      name: npcName,
      type: "npc",
      system: {
        bio: {
          origin: "",
          upbringing: "",
          humanite: false,
          concept: archetype.label,
          icon: "",
          groupConcept: faction.label,
          personalProblem: motivation,
          appearance: { face: "", clothing: "" },
          crewPosition: { position: "", shipId: "" }
        },
        attributes: {
          strength: { value: attributes.strength },
          agility: { value: attributes.agility },
          wits: { value: attributes.wits },
          empathy: { value: attributes.empathy }
        },
        skills,
        hitPoints: { value: hpMax },
        mindPoints: { value: mpMax },
        experience: { value: 0 },
        radiation: { value: 0 },
        reputation: { value: randRange(scale.rep[0], scale.rep[1]) },
        birr: randRange(scale.birr[0], scale.birr[1]),
        movementRate: 10,
        notes
      },
      items: embeddedItems
    };

    const actor = await Actor.implementation.create(actorData);
    const summary = `${archetype.label} "${npcName}" — ${faction.label} (${difficulty})`;
    ui.notifications.info(`NPC generated: ${npcName} (${archetype.label})`);
    return { actor, journal: null, summary };

  } else {
    // Journal entry output
    let html = `<h2>${npcName}</h2>`;
    html += `<p><strong>Role:</strong> ${archetype.label} — ${archetype.description}</p>`;
    html += `<p><strong>Faction:</strong> ${faction.label}</p>`;
    html += `<p><strong>Difficulty:</strong> ${difficulty.charAt(0).toUpperCase() + difficulty.slice(1)}</p>`;
    html += `<h3>Appearance</h3>`;
    html += `<p>${build}. ${age}. ${feature}.</p>`;
    html += `<h3>Personality</h3><ul>`;
    for (const trait of traits) {
      html += `<li>${trait}</li>`;
    }
    html += `</ul>`;
    html += `<p><strong>Motivation:</strong> ${motivation}</p>`;
    html += `<p><strong>Quirk:</strong> ${quirk}</p>`;

    if (archetype.talents && archetype.talents.length > 0) {
      const talentNames = archetype.talents
        .map(k => TALENTS[k]?.name || k)
        .join(", ");
      html += `<p><strong>Talents:</strong> ${talentNames}</p>`;
    }

    if (includeMysticPowers && archetype.mysticPowers) {
      const count = randRange(1, 2);
      const selected = pickMultiple(MYSTIC_POWER_KEYS, count);
      const names = selected.map(k => {
        const word = k.replace("mystical", "");
        return word.charAt(0).toUpperCase() + word.slice(1);
      });
      html += `<p><strong>Mystic Powers:</strong> ${names.join(", ")}</p>`;
    }

    html += `<hr><p><em>Generated by Coriolis AIO Generator</em></p>`;

    const journal = await JournalEntry.implementation.create({
      name: `NPC: ${npcName}`,
      pages: [{
        name: npcName,
        type: "text",
        text: { content: html, format: 1 }
      }]
    });

    const summary = `${archetype.label} "${npcName}" — ${faction.label} (Journal)`;
    ui.notifications.info(`NPC generated: ${npcName} (${archetype.label})`);
    return { actor: null, journal, summary };
  }
}
