/**
 * Encounter generator for Coriolis: The Third Horizon.
 *
 * Generates a complete encounter with:
 *  - Scaled enemy NPCs (as Foundry actors) with embedded weapons/armor
 *  - Loot summary (items + birr) placed in a journal entry
 *  - Difficulty scaling based on tier + party XP
 */

import { ENEMIES, ENEMY_WEAPONS, ENEMY_ARMOR, ENEMY_GEAR, ENEMY_CATEGORIES, DIFFICULTY_TIERS, getXPTier } from "./data/enemies.js";
import { ENCOUNTER_TEMPLATES } from "./data/encounters.js";
import { LOOT_TABLES, LOOT_TIERS, TIER_ORDER, filterByTier, weightedPick } from "./data/loot.js";
import { TALENTS } from "./data/talents.js";
import { resolveTalent, resolveItem } from "./compendium-resolver.js";
import { generateName } from "./data/names.js";

// ── Utility ──────────────────────────────────────────────────

function pick(arr) {
  return arr[Math.floor(Math.random() * arr.length)];
}

function randRange(min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

function clamp(val, min, max) {
  return Math.max(min, Math.min(max, val));
}

// ── Stat Scaling ─────────────────────────────────────────────

/**
 * Scale an enemy template's stats based on difficulty tier and party XP.
 *
 * @param {object} template - Enemy template from ENEMIES
 * @param {object} difficultyTier - From DIFFICULTY_TIERS
 * @param {object} xpTier - From getXPTier()
 * @returns {object} Scaled attributes and skills
 */
function scaleStats(template, difficultyTier, xpTier) {
  const scale = difficultyTier.statScale;
  const bonus = xpTier.statBonus;

  const attributes = {};
  for (const [attr, base] of Object.entries(template.attributes)) {
    attributes[attr] = clamp(Math.round(base * scale) + bonus, 1, 8);
  }

  const skills = {};
  for (const [skill, base] of Object.entries(template.skills)) {
    skills[skill] = clamp(Math.round(base * scale) + Math.floor(bonus / 2), 0, 8);
  }

  return { attributes, skills };
}

// ── Enemy Actor Creation ─────────────────────────────────────

const ALL_SKILLS = [
  "dexterity", "force", "infiltration", "manipulation",
  "meleecombat", "observation", "rangedcombat", "survival",
  "command", "culture", "datadjinn", "medicurgy",
  "mysticpowers", "pilot", "science", "technology"
];

/**
 * Create a single enemy NPC actor from a template with scaling applied.
 *
 * @param {string} enemyKey - Key in ENEMIES
 * @param {object} difficultyTier - Difficulty settings
 * @param {object} xpTier - XP-based scaling
 * @param {string} [nameOverride] - Optional custom name
 * @returns {Promise<Actor>}
 */
async function createEnemyActor(enemyKey, difficultyTier, xpTier, nameOverride) {
  const template = ENEMIES[enemyKey];
  if (!template) {
    console.warn(`coriolis-aio-gen | Unknown enemy key: ${enemyKey}`);
    return null;
  }

  const category = ENEMY_CATEGORIES[template.category];
  const { attributes, skills } = scaleStats(template, difficultyTier, xpTier);

  // Build full skills object (all 16 skills, default 0)
  const fullSkills = {};
  for (const skill of ALL_SKILLS) {
    fullSkills[skill] = { value: skills[skill] || 0 };
  }

  // HP/MP
  const hpMax = Math.max(1, Math.round((attributes.strength + attributes.agility) * category.hpMultiplier));
  const mpMax = attributes.wits + attributes.empathy;

  // Name
  const name = nameOverride || `${template.name} (${generateName().split(" ")[0]})`;

  // Embedded items
  const embeddedItems = [];

  // Weapons
  for (const wKey of template.weapons) {
    const wData = ENEMY_WEAPONS[wKey];
    if (wData) {
      const resolved = await resolveItem({ ...wData });
      embeddedItems.push(resolved);
    }
  }

  // Ammunition for ranged weapons
  const AMMO_MAP = {
    vulcanCricket: { ammoKey: "vulcanAmmo", qty: 1 },
    vulcanPistol:  { ammoKey: "vulcanAmmo", qty: 1 },
    vulcanCarbine: { ammoKey: "vulcanAmmo", qty: 2 },
    thermPistol:   { ammoKey: "thermCells", qty: 1 },
    thermRifle:    { ammoKey: "thermCells", qty: 2 }
  };
  const ammoNeeded = {};
  for (const wKey of template.weapons) {
    const mapping = AMMO_MAP[wKey];
    if (mapping) {
      ammoNeeded[mapping.ammoKey] = (ammoNeeded[mapping.ammoKey] || 0) + mapping.qty;
    }
  }
  for (const [ammoKey, qty] of Object.entries(ammoNeeded)) {
    const ammoData = ENEMY_GEAR[ammoKey];
    if (ammoData) {
      const resolved = await resolveItem({ ...ammoData, system: { ...ammoData.system, quantity: qty } });
      embeddedItems.push(resolved);
    }
  }

  // Armor
  if (template.armor) {
    const aData = ENEMY_ARMOR[template.armor];
    if (aData) {
      const resolved = await resolveItem({ ...aData });
      embeddedItems.push(resolved);
    }
  }

  // Gear
  if (template.gear) {
    for (const gKey of template.gear) {
      const gData = ENEMY_GEAR[gKey];
      if (gData) {
        const resolved = await resolveItem({ ...gData });
        embeddedItems.push(resolved);
      }
    }
  }

  // Talents (limited by category talent slots)
  const talentKeys = template.talents.slice(0, category.talentSlots);
  for (const tKey of talentKeys) {
    const talentItem = await resolveTalent(tKey);
    if (talentItem) embeddedItems.push(talentItem);
  }

  const actorData = {
    name,
    type: "npc",
    system: {
      bio: {
        origin: "",
        upbringing: "",
        humanite: false,
        concept: `${category.label} — ${template.name}`,
        icon: "",
        groupConcept: "",
        personalProblem: "",
        appearance: { face: "", clothing: "" },
        crewPosition: { position: "", shipId: "" }
      },
      attributes: {
        strength: { value: attributes.strength },
        agility: { value: attributes.agility },
        wits: { value: attributes.wits },
        empathy: { value: attributes.empathy }
      },
      skills: fullSkills,
      hitPoints: { value: hpMax, max: hpMax },
      mindPoints: { value: mpMax, max: mpMax },
      experience: { value: 0 },
      radiation: { value: 0 },
      reputation: { value: 0 },
      birr: 0,
      movementRate: 10,
      notes: `${template.description}\n\nCategory: ${category.label}\nDifficulty-scaled by Coriolis AIO Generator.`
    },
    items: embeddedItems
  };

  return Actor.implementation.create(actorData);
}

// ── Loot Generation ──────────────────────────────────────────

/**
 * Generate loot for an encounter.
 *
 * @param {string} gearTier - Gear tier from enemy category ("basic", "standard", "advanced", "elite")
 * @param {number} lootScale - Multiplier from difficulty tier
 * @param {number} lootBonus - Bonus multiplier from encounter template
 * @returns {object} { birr, items: [{name, type, system}], valuables: [{name, birrValue}] }
 */
function generateLoot(gearTier, lootScale, lootBonus) {
  const tierData = LOOT_TIERS[gearTier] || LOOT_TIERS.basic;
  const effectiveScale = lootScale * (1 + lootBonus);

  // Birr
  const baseBirr = randRange(tierData.birrRange[0], tierData.birrRange[1]);
  const birr = Math.round(baseBirr * effectiveScale);

  // Item count
  const baseCount = randRange(tierData.itemCount[0], tierData.itemCount[1]);
  const itemCount = Math.max(1, Math.round(baseCount * effectiveScale));

  const items = [];
  const valuables = [];

  for (let i = 0; i < itemCount; i++) {
    // Pick a random loot category
    const categoryRoll = Math.random();
    let category;
    if (categoryRoll < 0.25) category = "weapons";
    else if (categoryRoll < 0.40) category = "armor";
    else if (categoryRoll < 0.75) category = "gear";
    else category = "valuables";

    const pool = filterByTier(LOOT_TABLES[category], gearTier);
    if (pool.length === 0) continue;

    const entry = weightedPick(pool);

    if (category === "valuables") {
      valuables.push({ name: entry.name, birrValue: Math.round(entry.birrValue * effectiveScale) });
    } else {
      items.push({ name: entry.name, ...entry.item });
    }
  }

  return { birr, items, valuables };
}

// ── Loot Journal Entry ───────────────────────────────────────

/**
 * Create a journal entry summarizing the encounter loot.
 *
 * @param {string} encounterName - Name of the encounter
 * @param {object} loot - Loot data from generateLoot()
 * @returns {Promise<JournalEntry>}
 */
async function createLootJournal(encounterName, loot) {
  let html = `<h2>Encounter Loot: ${encounterName}</h2>`;
  html += `<p><strong>Birr found:</strong> ${loot.birr}</p>`;

  if (loot.items.length > 0) {
    html += `<h3>Items</h3><ul>`;
    for (const item of loot.items) {
      html += `<li><strong>${item.name}</strong> (${item.type})</li>`;
    }
    html += `</ul>`;
  }

  if (loot.valuables.length > 0) {
    html += `<h3>Valuables</h3><ul>`;
    for (const val of loot.valuables) {
      html += `<li><strong>${val.name}</strong> — worth ~${val.birrValue} birr</li>`;
    }
    html += `</ul>`;
  }

  const totalValuablesBirr = loot.valuables.reduce((sum, v) => sum + v.birrValue, 0);
  html += `<hr><p><strong>Total value:</strong> ${loot.birr + totalValuablesBirr} birr (${loot.birr} cash + ${totalValuablesBirr} in valuables)</p>`;
  html += `<p><em>Generated by Coriolis AIO Generator</em></p>`;

  return JournalEntry.implementation.create({
    name: `Loot: ${encounterName}`,
    pages: [{
      name: "Loot Summary",
      type: "text",
      text: { content: html, format: 1 }
    }]
  });
}

// ── Main Encounter Generator ─────────────────────────────────

/**
 * Generate a complete encounter.
 *
 * @param {object} options
 * @param {string} [options.templateKey] - Encounter template key, or random
 * @param {string} [options.difficulty="normal"] - Difficulty tier key
 * @param {number} [options.partySize=4] - Number of players
 * @param {number} [options.partyXP=0] - Total XP spent by the party (average per player)
 * @param {boolean} [options.generateLoot=true] - Whether to generate a loot journal
 * @returns {Promise<{actors: Actor[], journal: JournalEntry|null, summary: string}>}
 */
export async function generateEncounter(options = {}) {
  const difficulty = options.difficulty || "normal";
  const partySize = options.partySize ?? 4;
  const partyXP = options.partyXP ?? 0;
  const shouldGenerateLoot = options.generateLoot !== false;

  // Resolve difficulty and XP tiers
  const difficultyTier = DIFFICULTY_TIERS[difficulty] || DIFFICULTY_TIERS.normal;
  const xpTier = getXPTier(partyXP);

  // Pick encounter template
  let templateKey = options.templateKey;
  if (!templateKey) {
    const keys = Object.keys(ENCOUNTER_TEMPLATES);
    templateKey = keys[Math.floor(Math.random() * keys.length)];
  }
  const template = ENCOUNTER_TEMPLATES[templateKey];
  if (!template) {
    ui.notifications.error("Unknown encounter template.");
    return { actors: [], journal: null, summary: "Error: unknown template" };
  }

  // Scale enemy counts by party size (baseline is 4 players)
  const partySizeScale = partySize / 4;
  const countScale = difficultyTier.enemyCountScale * partySizeScale;

  // Create enemy actors
  const actors = [];
  let highestCategory = "minion";

  for (const group of template.enemies) {
    const enemyTemplate = ENEMIES[group.enemyKey];
    if (!enemyTemplate) continue;

    // Update highest category for loot tier
    const catOrder = ["minion", "regular", "elite", "boss"];
    if (catOrder.indexOf(enemyTemplate.category) > catOrder.indexOf(highestCategory)) {
      highestCategory = enemyTemplate.category;
    }

    // Calculate count
    const baseCount = randRange(group.count[0], group.count[1]);
    const scaledCount = Math.max(1, Math.round(baseCount * countScale));

    for (let i = 0; i < scaledCount; i++) {
      const actor = await createEnemyActor(group.enemyKey, difficultyTier, xpTier);
      if (actor) actors.push(actor);
    }
  }

  // Generate loot
  let journal = null;
  const gearTier = ENEMY_CATEGORIES[highestCategory]?.gearTier || "basic";

  if (shouldGenerateLoot) {
    const loot = generateLoot(gearTier, difficultyTier.lootScale, template.lootBonus);
    journal = await createLootJournal(template.label, loot);
  }

  // Build summary
  const enemyCounts = {};
  for (const actor of actors) {
    const baseName = actor.name.replace(/\s*\(.*\)$/, "");
    enemyCounts[baseName] = (enemyCounts[baseName] || 0) + 1;
  }
  const enemyList = Object.entries(enemyCounts)
    .map(([name, count]) => `${count}x ${name}`)
    .join(", ");

  const summary = `${template.label} (${difficultyTier.label} / ${xpTier.label}): ${enemyList}`;

  ui.notifications.info(`Encounter generated: ${template.label} — ${actors.length} enemies created.`);

  return { actors, journal, summary, templateKey };
}
