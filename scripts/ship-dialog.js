/**
 * Ship generation config dialog.
 */

import { SHIP_CLASSES } from "./data/ships.js";
import { generateShip } from "./ship-generator.js";

/**
 * Open the ship generation dialog.
 */
export async function openShipDialog() {
  const templatePath = "modules/coriolis-aio-gen/templates/ship-dialog.hbs";

  const templateData = {
    shipClasses: SHIP_CLASSES
  };

  const html = await renderTemplate(templatePath, templateData);

  return new Promise((resolve) => {
    const dialog = new Dialog({
      title: game.i18n.localize("CORIOLIS_AIO.Ship.Title"),
      content: html,
      buttons: {
        generate: {
          icon: '<i class="fas fa-rocket"></i>',
          label: game.i18n.localize("CORIOLIS_AIO.Dialog.Generate"),
          callback: async (html) => {
            const form = html[0].querySelector("form");
            const options = {
              classKey: form.classKey.value || undefined,
              name: form.shipName.value || undefined,
              includeProblem: form.includeProblem.checked
            };

            try {
              const result = await generateShip(options);
              resolve(result);
            } catch (err) {
              console.error("coriolis-aio-gen | Ship generation failed:", err);
              ui.notifications.error(
                game.i18n.localize("CORIOLIS_AIO.Error.ShipFailed")
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
        _setupClassDescription(html);
      }
    }, {
      width: 440,
      classes: ["coriolis-aio-gen-dialog-window"]
    });

    dialog.render(true);
  });
}

/**
 * Show ship class description when selection changes.
 */
function _setupClassDescription(html) {
  const select = html.find ? html.find("#aio-ship-class") : html[0].querySelector("#aio-ship-class");
  const desc = html.find ? html.find("#aio-ship-class-desc") : html[0].querySelector("#aio-ship-class-desc");

  const selectEl = select instanceof jQuery ? select[0] : select;
  const descEl = desc instanceof jQuery ? desc[0] : desc;

  if (!selectEl || !descEl) return;

  function updateDesc() {
    const key = selectEl.value;
    if (key && SHIP_CLASSES[key]) {
      descEl.textContent = SHIP_CLASSES[key].description;
    } else {
      descEl.textContent = "";
    }
  }

  selectEl.addEventListener("change", updateDesc);
  updateDesc();
}
