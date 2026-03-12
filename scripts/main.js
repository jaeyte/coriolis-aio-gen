/**
 * Coriolis AIO Generator — Module entry point.
 *
 * Adds an "AIO Generator" header control button to the Actors sidebar using the
 * Foundry v13 getHeaderControls hook (ApplicationV2).
 */

import { openUnifiedDialog } from "./unified-dialog.js";

const MODULE_ID = "coriolis-aio-gen";

/* ---------- lifecycle hooks ---------- */

Hooks.once("init", () => {
  console.log(`${MODULE_ID} | Initializing Coriolis AIO Generator`);

  // Register module settings
  game.settings.register(MODULE_ID, "anthropicApiKey", {
    name: "CORIOLIS_AIO.Settings.ApiKey",
    hint: "CORIOLIS_AIO.Settings.ApiKeyHint",
    scope: "world",
    config: true,
    type: String,
    default: ""
  });
});

Hooks.once("ready", () => {
  if (game.system.id !== "yzecoriolis") {
    console.warn(
      `${MODULE_ID} | This module requires the yzecoriolis system. Current system: ${game.system.id}`
    );
    return;
  }
  console.log(
    `${MODULE_ID} | Ready — system: ${game.system.id} v${game.system.version}`
  );
});

/* ---------- header control ---------- */

// Add "AIO Generator" button to the ActorDirectory header via the v13 hook.
Hooks.on("getHeaderControlsActorDirectory", (_app, controls) => {
  if (!game.user.isGM && !game.user.can("ACTOR_CREATE")) return;
  controls.push({
    icon: "fa-solid fa-dice-d20",
    label: game.i18n.localize("CORIOLIS_AIO.Button.Generate"),
    action: "coriolisAioGenerate",
    onClick: () => openUnifiedDialog(),
  });
});
