/**
 * Core character generation logic for Coriolis: The Third Horizon.
 *
 * Follows the rulebook character creation steps:
 *  1. Pick concept + sub-concept
 *  2. Pick background (origin, upbringing, icon)
 *  3. Distribute attribute points (14 total, min 2, max 5)
 *  4. Distribute skill points (concept skills + upbringing bonus)
 *  5. Select starting talent
 *  6. Determine starting gear
 *  7. Generate personal details
 *  8. Calculate derived stats
 *  9. Create actor with embedded items
 */

import { CONCEPTS, ATTRIBUTE_RULES, SKILL_RULES } from "./data/concepts.js";
import { ORIGINS, UPBRINGINGS, ICONS, PERSONAL_PROBLEMS, APPEARANCE_FACES, APPEARANCE_CLOTHING } from "./data/backgrounds.js";
import { generateName } from "./data/names.js";
import { GROUP_CONCEPTS } from "./data/group-concepts.js";
import { STARTING_GEAR } from "./data/gear.js";
import { TALENTS, ICON_TALENT_MAP } from "./data/talents.js";
import { resolveTalent, resolveItems } from "./compendium-resolver.js";

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

// ── Attribute Distribution ───────────────────────────────────

const ALL_ATTRIBUTES = ["strength", "agility", "wits", "empathy"];

/**
 * Distribute attribute points with a bias toward the concept's key attribute.
 * Total = 14, each attribute in [2, 5].
 */
function distributeAttributes(keyAttribute) {
  const attrs = {};
  const { totalPoints, min, max } = ATTRIBUTE_RULES;

  // Start everyone at min
  for (const attr of ALL_ATTRIBUTES) {
    attrs[attr] = min;
  }
  let remaining = totalPoints - (min * ALL_ATTRIBUTES.length); // 14 - 8 = 6

  // Give key attribute a boost first (try to get it to 4 or 5)
  const keyBoost = Math.min(max - min, remaining, 2 + Math.floor(Math.random() * 2)); // 2-3
  attrs[keyAttribute] += keyBoost;
  remaining -= keyBoost;

  // Distribute remaining points randomly among all attributes
  const order = shuffle(ALL_ATTRIBUTES);
  while (remaining > 0) {
    let distributed = false;
    for (const attr of order) {
      if (remaining <= 0) break;
      if (attrs[attr] < max) {
        const add = Math.min(max - attrs[attr], remaining, 1);
        attrs[attr] += add;
        remaining -= add;
        distributed = true;
      }
    }
    if (!distributed) break;
  }

  return attrs;
}

// ── Skill Distribution ───────────────────────────────────────

const ALL_SKILLS = [
  "dexterity", "force", "infiltration", "manipulation",
  "meleecombat", "observation", "rangedcombat", "survival",
  "command", "culture", "datadjinn", "medicurgy",
  "mysticpowers", "pilot", "science", "technology"
];

/**
 * Distribute skill points:
 *  - conceptPoints go to concept skills and sub-concept bonus skills
 *  - upbringing bonus points can go to any skill
 */
function distributeSkills(conceptData, subConceptData, upbringingData) {
  const skills = {};
  for (const skill of ALL_SKILLS) {
    skills[skill] = 0;
  }

  const { conceptPoints, conceptMax } = SKILL_RULES;
  let remaining = conceptPoints;

  // Prioritize sub-concept bonus skills (give them 2-3 each)
  for (const skill of subConceptData.bonusSkills) {
    const add = Math.min(conceptMax, remaining, 2 + Math.floor(Math.random() * 2));
    skills[skill] += add;
    remaining -= add;
  }

  // Spread remaining concept points across concept skills
  const otherConceptSkills = shuffle(
    conceptData.conceptSkills.filter(s => !subConceptData.bonusSkills.includes(s))
  );
  for (const skill of otherConceptSkills) {
    if (remaining <= 0) break;
    const add = Math.min(conceptMax - skills[skill], remaining, 1 + Math.floor(Math.random() * 2));
    skills[skill] += add;
    remaining -= add;
  }

  // If there are still remaining concept points, spread across concept skills
  if (remaining > 0) {
    for (const skill of shuffle(conceptData.conceptSkills)) {
      if (remaining <= 0) break;
      if (skills[skill] < conceptMax) {
        const add = Math.min(conceptMax - skills[skill], remaining);
        skills[skill] += add;
        remaining -= add;
      }
    }
  }

  // Upbringing bonus points can go to any skill
  let bonusRemaining = upbringingData.bonusSkillPoints;
  const allSkillsShuffle = shuffle(ALL_SKILLS);
  // Spread bonus points: first to concept skills, then to others
  const bonusOrder = [
    ...shuffle(conceptData.conceptSkills),
    ...allSkillsShuffle.filter(s => !conceptData.conceptSkills.includes(s))
  ];

  for (const skill of bonusOrder) {
    if (bonusRemaining <= 0) break;
    const max = SKILL_RULES.maxPerSkill;
    if (skills[skill] < max) {
      const add = Math.min(max - skills[skill], bonusRemaining, 1 + Math.floor(Math.random() * 2));
      skills[skill] += add;
      bonusRemaining -= add;
    }
  }

  // Dump any remaining points
  while (bonusRemaining > 0) {
    let dumped = false;
    for (const skill of allSkillsShuffle) {
      if (bonusRemaining <= 0) break;
      if (skills[skill] < SKILL_RULES.maxPerSkill) {
        skills[skill]++;
        bonusRemaining--;
        dumped = true;
      }
    }
    if (!dumped) break;
  }

  return skills;
}

// ── Talent Selection ─────────────────────────────────────────

/**
 * Select a starting talent for the character.
 * Characters get one talent at creation, chosen from their concept talents.
 */
function selectTalent(conceptData) {
  if (conceptData.conceptTalents.length === 0) return null;
  return pick(conceptData.conceptTalents);
}

// ── Main Generator ───────────────────────────────────────────

/**
 * Generate a complete character.
 *
 * @param {object} options - Generation options (any can be null/undefined for random)
 * @param {string} [options.actorType="character"] - "character" or "npc"
 * @param {string} [options.conceptKey] - Concept key or random
 * @param {string} [options.subConceptKey] - Sub-concept key or random
 * @param {string} [options.groupConceptKey] - Group concept key or random
 * @param {string} [options.upbringingKey] - Upbringing key or random
 * @param {string} [options.originKey] - Origin key or random
 * @param {string} [options.name] - Character name or auto-generated
 * @param {string} [options.iconKey] - Icon key or random
 * @returns {Promise<Actor>} The created Foundry actor
 */
export async function generateCharacter(options = {}) {
  const actorType = options.actorType || "character";

  // 1. Concept + Sub-concept
  const conceptKey = options.conceptKey || pickKey(CONCEPTS);
  const concept = CONCEPTS[conceptKey];

  const subConceptKey = options.subConceptKey || pickKey(concept.subConcepts);
  const subConcept = concept.subConcepts[subConceptKey];

  // 2. Background
  const originObj = options.originKey
    ? ORIGINS.find(o => o.key === options.originKey)
    : pick(ORIGINS);

  const upbringingKey = options.upbringingKey || pickKey(UPBRINGINGS);
  const upbringing = UPBRINGINGS[upbringingKey];

  const iconObj = options.iconKey
    ? ICONS.find(i => i.key === options.iconKey)
    : pick(ICONS);

  const groupConceptKey = options.groupConceptKey || pickKey(GROUP_CONCEPTS);
  const groupConcept = GROUP_CONCEPTS[groupConceptKey];

  // 3. Attributes
  const attributes = distributeAttributes(concept.keyAttribute);

  // 4. Skills
  const skills = distributeSkills(concept, subConcept, upbringing);

  // 5. Talent
  const talentKey = selectTalent(concept);

  // 6. Personal details
  const charName = options.name || generateName({ includeNickname: true });
  const personalProblem = pick(PERSONAL_PROBLEMS);
  const face = pick(APPEARANCE_FACES);
  const clothing = pick(APPEARANCE_CLOTHING);

  // 7. Derived stats
  const hpMax = attributes.strength + attributes.agility;
  const mpMax = attributes.wits + attributes.empathy;

  // 8. Build system data
  const systemData = {
    bio: {
      origin: originObj.label,
      upbringing: upbringing.label,
      humanite: false,
      concept: `${concept.label} / ${subConcept.label}`,
      icon: iconObj.label,
      groupConcept: groupConcept.label,
      personalProblem,
      appearance: {
        face,
        clothing
      },
      crewPosition: {
        position: "",
        shipId: ""
      }
    },
    attributes: {
      strength: { value: attributes.strength },
      agility: { value: attributes.agility },
      wits: { value: attributes.wits },
      empathy: { value: attributes.empathy }
    },
    skills: {},
    hitPoints: { value: hpMax },
    mindPoints: { value: mpMax },
    experience: { value: 0 },
    radiation: { value: 0 },
    reputation: { value: upbringing.startingReputation },
    birr: upbringing.startingBirr,
    movementRate: 10,
    notes: `Generated by Coriolis AIO Generator.\nConcept: ${concept.label} / ${subConcept.label}\nGroup Concept: ${groupConcept.label}`
  };

  // Build skills object
  for (const skill of ALL_SKILLS) {
    systemData.skills[skill] = { value: skills[skill] };
  }

  // 9. Build embedded items
  const embeddedItems = [];

  // Concept talent
  if (talentKey) {
    const talentItem = await resolveTalent(talentKey);
    if (talentItem) embeddedItems.push(talentItem);
  }

  // Icon talent
  const iconTalentKey = ICON_TALENT_MAP[iconObj.key];
  if (iconTalentKey) {
    const iconTalentItem = await resolveTalent(iconTalentKey);
    if (iconTalentItem) embeddedItems.push(iconTalentItem);
  }

  // Group concept talent (pick one at random)
  if (groupConcept.talents.length > 0) {
    const groupTalentKey = pick(groupConcept.talents);
    const groupTalentItem = await resolveTalent(groupTalentKey);
    if (groupTalentItem) embeddedItems.push(groupTalentItem);
  }

  // Starting gear
  const gearData = STARTING_GEAR[subConcept.gearKey];
  if (gearData) {
    const allGearItems = [
      ...(gearData.weapons || []),
      ...(gearData.armor || []),
      ...(gearData.gear || [])
    ];
    const resolvedGear = await resolveItems(allGearItems);
    embeddedItems.push(...resolvedGear);
  }

  // 10. Create the actor
  const actorData = {
    name: charName,
    type: actorType,
    system: systemData,
    items: embeddedItems
  };

  const actor = await Actor.implementation.create(actorData);

  // Notify user
  ui.notifications.info(
    `Generated ${concept.label} (${subConcept.label}): ${charName}`
  );

  return actor;
}
