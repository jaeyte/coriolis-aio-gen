/**
 * Coriolis AIO Character Generator — Module entry point.
 *
 * Registers hooks to add a "Generate Character" button to the Actors sidebar
 * and wires up the generation dialog.
 */

import { openGeneratorDialog } from "./dialog.js";

const MODULE_ID = "coriolis-aio-gen";

Hooks.once("init", () => {
  console.log(`${MODULE_ID} | Initializing Coriolis AIO Character Generator`);
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
 * Add the "Generate Character" button to the Actors Directory sidebar header.
 */
Hooks.on("getActorDirectoryEntryContext", () => {
  // Context menu entries if needed in the future
});

Hooks.on("renderActorDirectory", (app, html) => {
  // Only for GMs and users with actor creation permission
  if (!game.user.isGM && !game.user.can("ACTOR_CREATE")) return;

  // Find the header actions area
  const headerActions = html.find ? html.find(".header-actions") : html[0]?.querySelector(".header-actions");
  const actionsEl = headerActions instanceof jQuery ? headerActions[0] : headerActions;

  if (!actionsEl) return;

  // Don't add the button twice
  if (actionsEl.querySelector(".coriolis-aio-generate-btn")) return;

  const btn = document.createElement("button");
  btn.type = "button";
  btn.classList.add("coriolis-aio-generate-btn");
  btn.innerHTML = `<i class="fas fa-dice-d20"></i> ${game.i18n.localize("CORIOLIS_AIO.Button.Generate")}`;
  btn.addEventListener("click", async (ev) => {
    ev.preventDefault();
    ev.stopPropagation();
    await openGeneratorDialog();
  });

  actionsEl.appendChild(btn);
});
