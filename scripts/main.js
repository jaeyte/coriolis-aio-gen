/**
 * Coriolis AIO Generator — Module entry point.
 *
 * Registers hooks to add "Generate Character" and "Generate Encounter" buttons
 * to the Actors sidebar and wires up the generation dialogs.
 */

import { openGeneratorDialog } from "./dialog.js";
import { openEncounterDialog } from "./encounter-dialog.js";

const MODULE_ID = "coriolis-aio-gen";

Hooks.once("init", () => {
  console.log(`${MODULE_ID} | Initializing Coriolis AIO Generator`);
});

Hooks.once("ready", () => {
  // Verify we're running in the yzecoriolis system
  if (game.system.id !== "yzecoriolis") {
    console.warn(
      `${MODULE_ID} | This module requires the yzecoriolis system. Current system: ${game.system.id}`
    );
    return;
  }

  console.log(`${MODULE_ID} | Ready — system: ${game.system.id} v${game.system.version}`);
});

/**
 * Add generator buttons to the Actors Directory sidebar header.
 */
Hooks.on("renderActorDirectory", (app, html) => {
  // Only for GMs and users with actor creation permission
  if (!game.user.isGM && !game.user.can("ACTOR_CREATE")) return;

  // Find the header actions area
  const headerActions = html.find ? html.find(".header-actions") : html[0]?.querySelector(".header-actions");
  const actionsEl = headerActions instanceof jQuery ? headerActions[0] : headerActions;

  if (!actionsEl) return;

  // Don't add buttons twice
  if (actionsEl.querySelector(".coriolis-aio-generate-btn")) return;

  // Character generator button
  const charBtn = document.createElement("button");
  charBtn.type = "button";
  charBtn.classList.add("coriolis-aio-generate-btn");
  charBtn.innerHTML = `<i class="fas fa-dice-d20"></i> ${game.i18n.localize("CORIOLIS_AIO.Button.Generate")}`;
  charBtn.addEventListener("click", async (ev) => {
    ev.preventDefault();
    ev.stopPropagation();
    await openGeneratorDialog();
  });

  // Encounter generator button
  const encBtn = document.createElement("button");
  encBtn.type = "button";
  encBtn.classList.add("coriolis-aio-generate-btn", "coriolis-aio-encounter-btn");
  encBtn.innerHTML = `<i class="fas fa-skull-crossbones"></i> ${game.i18n.localize("CORIOLIS_AIO.Button.Encounter")}`;
  encBtn.addEventListener("click", async (ev) => {
    ev.preventDefault();
    ev.stopPropagation();
    await openEncounterDialog();
  });

  actionsEl.appendChild(charBtn);
  actionsEl.appendChild(encBtn);
});
