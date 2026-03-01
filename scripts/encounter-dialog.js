/**
 * Encounter generation config dialog.
 */

import { ENCOUNTER_TEMPLATES } from "./data/encounters.js";
import { DIFFICULTY_TIERS } from "./data/enemies.js";
import { generateEncounter } from "./encounter-generator.js";

/**
 * Open the encounter generation dialog.
 */
export async function openEncounterDialog() {
  const templatePath = "modules/coriolis-aio-gen/templates/encounter-dialog.hbs";

  // Mark "normal" as default
  const difficulties = {};
  for (const [key, tier] of Object.entries(DIFFICULTY_TIERS)) {
    difficulties[key] = { ...tier, default: key === "normal" };
  }

  const templateData = {
    templates: ENCOUNTER_TEMPLATES,
    difficulties
  };

  const html = await renderTemplate(templatePath, templateData);

  return new Promise((resolve) => {
    const dialog = new Dialog({
      title: game.i18n.localize("CORIOLIS_AIO.Encounter.Title"),
      content: html,
      buttons: {
        generate: {
          icon: '<i class="fas fa-skull-crossbones"></i>',
          label: game.i18n.localize("CORIOLIS_AIO.Dialog.Generate"),
          callback: async (html) => {
            const form = html[0].querySelector("form");
            const options = {
              templateKey: form.templateKey.value || undefined,
              difficulty: form.difficulty.value,
              partySize: parseInt(form.partySize.value) || 4,
              partyXP: parseInt(form.partyXP.value) || 0,
              generateLoot: form.generateLoot.checked
            };

            try {
              const result = await generateEncounter(options);
              resolve(result);
            } catch (err) {
              console.error("coriolis-aio-gen | Encounter generation failed:", err);
              ui.notifications.error(
                game.i18n.localize("CORIOLIS_AIO.Error.EncounterFailed")
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
        _setupTemplateDescription(html);
      }
    }, {
      width: 440,
      classes: ["coriolis-aio-gen-dialog-window"]
    });

    dialog.render(true);
  });
}

/**
 * Show encounter template description when selection changes.
 */
function _setupTemplateDescription(html) {
  const select = html.find ? html.find("#aio-encounter-template") : html[0].querySelector("#aio-encounter-template");
  const desc = html.find ? html.find("#aio-encounter-desc") : html[0].querySelector("#aio-encounter-desc");

  const selectEl = select instanceof jQuery ? select[0] : select;
  const descEl = desc instanceof jQuery ? desc[0] : desc;

  if (!selectEl || !descEl) return;

  function updateDesc() {
    const key = selectEl.value;
    if (key && ENCOUNTER_TEMPLATES[key]) {
      descEl.textContent = ENCOUNTER_TEMPLATES[key].description;
    } else {
      descEl.textContent = "";
    }
  }

  selectEl.addEventListener("change", updateDesc);
  updateDesc();
}
