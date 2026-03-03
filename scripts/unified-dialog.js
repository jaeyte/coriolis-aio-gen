/**
 * Unified AIO Generator dialog.
 *
 * Combines character, encounter, ship, ship encounter, party, and NPC
 * generators into a single dialog with tabbed navigation.
 */

import { CONCEPTS } from "./data/concepts.js";
import { ORIGINS, UPBRINGINGS, ICONS } from "./data/backgrounds.js";
import { GROUP_CONCEPTS } from "./data/group-concepts.js";
import { ENCOUNTER_TEMPLATES } from "./data/encounters.js";
import { DIFFICULTY_TIERS } from "./data/enemies.js";
import { SHIP_CLASSES } from "./data/ships.js";
import { SHIP_ENCOUNTER_TEMPLATES } from "./data/ship-encounters.js";
import { NPC_ARCHETYPES, NPC_FACTIONS } from "./data/npcs.js";
import { generateCharacter } from "./generator.js";
import { generateEncounter } from "./encounter-generator.js";
import { generateShip } from "./ship-generator.js";
import { generateShipEncounter } from "./ship-encounter-generator.js";
import { generateParty } from "./party-generator.js";
import { generateQuickNPC } from "./npc-generator.js";

/**
 * Open the unified AIO generator dialog.
 *
 * @param {string} [initialTab="character"] - Which generator to show initially
 */
export async function openUnifiedDialog(initialTab = "character") {
  const templatePath = "modules/coriolis-aio-gen/templates/unified-dialog.hbs";

  // Mark "normal" as default difficulty
  const difficulties = {};
  for (const [key, tier] of Object.entries(DIFFICULTY_TIERS)) {
    difficulties[key] = { ...tier, default: key === "normal" };
  }

  const templateData = {
    initialTab,
    concepts: CONCEPTS,
    groupConcepts: GROUP_CONCEPTS,
    upbringings: UPBRINGINGS,
    origins: ORIGINS,
    icons: ICONS,
    encounterTemplates: ENCOUNTER_TEMPLATES,
    difficulties,
    shipClasses: SHIP_CLASSES,
    shipEncounterTemplates: SHIP_ENCOUNTER_TEMPLATES,
    npcArchetypes: NPC_ARCHETYPES,
    npcFactions: NPC_FACTIONS
  };

  const html = await renderTemplate(templatePath, templateData);

  return new Promise((resolve) => {
    const dialog = new Dialog({
      title: game.i18n.localize("CORIOLIS_AIO.Unified.Title"),
      content: html,
      buttons: {
        generate: {
          icon: '<i class="fas fa-dice-d20"></i>',
          label: game.i18n.localize("CORIOLIS_AIO.Dialog.Generate"),
          callback: async (html) => {
            const form = html[0].querySelector("form");
            const genType = form.generatorType.value;

            try {
              let result;
              if (genType === "character") {
                result = await _generateCharacterFromForm(form);
              } else if (genType === "encounter") {
                result = await _generateEncounterFromForm(form);
              } else if (genType === "ship") {
                result = await _generateShipFromForm(form);
              } else if (genType === "shipEncounter") {
                result = await _generateShipEncounterFromForm(form);
              } else if (genType === "party") {
                result = await _generatePartyFromForm(form);
              } else if (genType === "npc") {
                result = await _generateNPCFromForm(form);
              }
              resolve(result);
            } catch (err) {
              console.error(`coriolis-aio-gen | ${genType} generation failed:`, err);
              ui.notifications.error(
                game.i18n.localize("CORIOLIS_AIO.Error.GenerationFailed")
              );
              resolve(null);
            }
          }
        },
        cancel: {
          icon: '<i class="fas fa-times"></i>',
          label: game.i18n.localize("CORIOLIS_AIO.Dialog.Cancel"),
          callback: () => resolve(null)
        }
      },
      default: "generate",
      render: (html) => {
        _setupTabSwitching(html);
        _setupDynamicSubConcepts(html);
        _setupEncounterDescription(html);
        _setupShipClassDescription(html);
        _setupShipEncounterDescription(html);
      }
    }, {
      width: 520,
      classes: ["coriolis-aio-gen-dialog-window"]
    });

    dialog.render(true);
  });
}

// ── Form → Generator Dispatchers ────────────────────────────

function _generateCharacterFromForm(form) {
  return generateCharacter({
    actorType: form.actorType.value,
    name: form.charName.value || undefined,
    conceptKey: form.conceptKey.value || undefined,
    subConceptKey: form.subConceptKey.value || undefined,
    groupConceptKey: form.groupConceptKey.value || undefined,
    upbringingKey: form.upbringingKey.value || undefined,
    originKey: form.originKey.value || undefined,
    iconKey: form.iconKey.value || undefined
  });
}

async function _generateEncounterFromForm(form) {
  const templateKey = form.templateKey.value || undefined;
  const difficulty = form.difficulty.value;
  const partySize = parseInt(form.partySize.value) || 4;
  const partyXP = parseInt(form.partyXP.value) || 0;

  const result = await generateEncounter({
    templateKey,
    difficulty,
    partySize,
    partyXP,
    generateLoot: form.generateLoot.checked
  });

  // Optionally generate the linked enemy ship
  if (form.generateEnemyShip.checked && templateKey) {
    const template = ENCOUNTER_TEMPLATES[templateKey];
    if (template?.linkedShipEncounter) {
      await generateShipEncounter({
        templateKey: template.linkedShipEncounter,
        difficulty,
        partySize,
        partyXP,
        generateSalvage: true
      });
    }
  }

  return result;
}

function _generateShipFromForm(form) {
  return generateShip({
    classKey: form.classKey.value || undefined,
    name: form.shipName.value || undefined,
    includeProblem: form.includeProblem.checked
  });
}

async function _generateShipEncounterFromForm(form) {
  const templateKey = form.shipEncounterTemplate.value || undefined;
  const difficulty = form.shipEncounterDifficulty.value;
  const partySize = parseInt(form.shipEncounterPartySize.value) || 4;
  const partyXP = parseInt(form.shipEncounterPartyXP.value) || 0;

  const result = await generateShipEncounter({
    templateKey,
    difficulty,
    partySize,
    partyXP,
    generateSalvage: form.generateSalvage.checked
  });

  // Optionally generate the linked boarding party encounter
  if (form.generateBoardingParty.checked && templateKey) {
    const template = SHIP_ENCOUNTER_TEMPLATES[templateKey];
    if (template?.linkedEncounter) {
      await generateEncounter({
        templateKey: template.linkedEncounter,
        difficulty,
        partySize,
        partyXP,
        generateLoot: true
      });
    }
  }

  return result;
}

function _generatePartyFromForm(form) {
  return generateParty({
    partySize: parseInt(form.partyGenSize.value) || 4,
    groupConceptKey: form.partyGroupConceptKey.value || undefined,
    allowDuplicates: form.allowDuplicates.checked
  });
}

function _generateNPCFromForm(form) {
  return generateQuickNPC({
    archetypeKey: form.npcArchetype.value || undefined,
    factionKey: form.npcFaction.value || undefined,
    name: form.npcName.value || undefined,
    createActor: form.npcCreateActor.checked
  });
}

// ── Tab Switching ───────────────────────────────────────────

function _setupTabSwitching(html) {
  const root = html.find ? html[0] : html;
  const tabs = root.querySelectorAll(".coriolis-gen-tab");
  const panels = root.querySelectorAll(".coriolis-gen-panel");
  const hiddenInput = root.querySelector("input[name='generatorType']");

  for (const tab of tabs) {
    tab.addEventListener("click", () => {
      const target = tab.dataset.tab;

      // Update active tab
      for (const t of tabs) t.classList.toggle("active", t.dataset.tab === target);

      // Show/hide panels
      for (const p of panels) p.classList.toggle("hidden", p.dataset.panel !== target);

      // Update hidden input
      if (hiddenInput) hiddenInput.value = target;
    });
  }
}

// ── Dynamic Sub-Concepts ────────────────────────────────────

function _setupDynamicSubConcepts(html) {
  const root = html.find ? html[0] : html;
  const conceptEl = root.querySelector("#aio-concept");
  const subConceptEl = root.querySelector("#aio-subconcept");
  if (!conceptEl || !subConceptEl) return;

  function updateSubConcepts() {
    const key = conceptEl.value;
    subConceptEl.innerHTML = `<option value="">${game.i18n.localize("CORIOLIS_AIO.Dialog.Random")}</option>`;
    if (key && CONCEPTS[key]) {
      for (const [subKey, subData] of Object.entries(CONCEPTS[key].subConcepts)) {
        const opt = document.createElement("option");
        opt.value = subKey;
        opt.textContent = subData.label;
        subConceptEl.appendChild(opt);
      }
    }
  }

  conceptEl.addEventListener("change", updateSubConcepts);
  if (conceptEl.value) updateSubConcepts();
}

// ── Encounter Description ───────────────────────────────────

function _setupEncounterDescription(html) {
  const root = html.find ? html[0] : html;
  const selectEl = root.querySelector("#aio-encounter-template");
  const descEl = root.querySelector("#aio-encounter-desc");
  if (!selectEl || !descEl) return;

  function updateDesc() {
    const key = selectEl.value;
    descEl.textContent = key && ENCOUNTER_TEMPLATES[key]
      ? ENCOUNTER_TEMPLATES[key].description
      : "";
  }

  selectEl.addEventListener("change", updateDesc);
  updateDesc();
}

// ── Ship Class Description ──────────────────────────────────

function _setupShipClassDescription(html) {
  const root = html.find ? html[0] : html;
  const selectEl = root.querySelector("#aio-ship-class");
  const descEl = root.querySelector("#aio-ship-class-desc");
  if (!selectEl || !descEl) return;

  function updateDesc() {
    const key = selectEl.value;
    descEl.textContent = key && SHIP_CLASSES[key]
      ? SHIP_CLASSES[key].description
      : "";
  }

  selectEl.addEventListener("change", updateDesc);
  updateDesc();
}

// ── Ship Encounter Description ──────────────────────────────

function _setupShipEncounterDescription(html) {
  const root = html.find ? html[0] : html;
  const selectEl = root.querySelector("#aio-ship-encounter-template");
  const descEl = root.querySelector("#aio-ship-encounter-desc");
  if (!selectEl || !descEl) return;

  function updateDesc() {
    const key = selectEl.value;
    descEl.textContent = key && SHIP_ENCOUNTER_TEMPLATES[key]
      ? SHIP_ENCOUNTER_TEMPLATES[key].description
      : "";
  }

  selectEl.addEventListener("change", updateDesc);
  updateDesc();
}
