/**
 * Character generation config dialog.
 */

import { CONCEPTS } from "./data/concepts.js";
import { ORIGINS, UPBRINGINGS, ICONS } from "./data/backgrounds.js";
import { GROUP_CONCEPTS } from "./data/group-concepts.js";
import { generateCharacter } from "./generator.js";

/**
 * Open the character generation dialog.
 */
export async function openGeneratorDialog() {
  const templatePath = "modules/coriolis-aio-gen/templates/generator-dialog.hbs";

  const templateData = {
    concepts: CONCEPTS,
    groupConcepts: GROUP_CONCEPTS,
    upbringings: UPBRINGINGS,
    origins: ORIGINS,
    icons: ICONS
  };

  const html = await renderTemplate(templatePath, templateData);

  return new Promise((resolve) => {
    const dialog = new Dialog({
      title: game.i18n.localize("CORIOLIS_AIO.Dialog.Title"),
      content: html,
      buttons: {
        generate: {
          icon: '<i class="fas fa-dice"></i>',
          label: game.i18n.localize("CORIOLIS_AIO.Dialog.Generate"),
          callback: async (html) => {
            const form = html[0].querySelector("form");
            const options = {
              actorType: form.actorType.value,
              name: form.name.value || undefined,
              conceptKey: form.conceptKey.value || undefined,
              subConceptKey: form.subConceptKey.value || undefined,
              groupConceptKey: form.groupConceptKey.value || undefined,
              upbringingKey: form.upbringingKey.value || undefined,
              originKey: form.originKey.value || undefined,
              iconKey: form.iconKey.value || undefined
            };

            try {
              const actor = await generateCharacter(options);
              resolve(actor);
            } catch (err) {
              console.error("coriolis-aio-gen | Generation failed:", err);
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
        _setupDynamicSubConcepts(html);
      }
    }, {
      width: 420,
      classes: ["coriolis-aio-gen-dialog-window"]
    });

    dialog.render(true);
  });
}

/**
 * Wire up dynamic sub-concept dropdown based on selected concept.
 */
function _setupDynamicSubConcepts(html) {
  const conceptSelect = html.find ? html.find("#aio-concept") : html[0].querySelector("#aio-concept");
  const subConceptSelect = html.find ? html.find("#aio-subconcept") : html[0].querySelector("#aio-subconcept");

  const conceptEl = conceptSelect instanceof jQuery ? conceptSelect[0] : conceptSelect;
  const subConceptEl = subConceptSelect instanceof jQuery ? subConceptSelect[0] : subConceptSelect;

  if (!conceptEl || !subConceptEl) return;

  function updateSubConcepts() {
    const key = conceptEl.value;
    // Clear existing options
    subConceptEl.innerHTML = `<option value="">${game.i18n.localize("CORIOLIS_AIO.Dialog.Random")}</option>`;

    if (key && CONCEPTS[key]) {
      const subs = CONCEPTS[key].subConcepts;
      for (const [subKey, subData] of Object.entries(subs)) {
        const opt = document.createElement("option");
        opt.value = subKey;
        opt.textContent = subData.label;
        subConceptEl.appendChild(opt);
      }
    }
  }

  conceptEl.addEventListener("change", updateSubConcepts);

  // Initialize if a concept is already selected
  if (conceptEl.value) updateSubConcepts();
}
