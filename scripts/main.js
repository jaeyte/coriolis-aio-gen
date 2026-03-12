/**
 * Coriolis AIO Generator — Module entry point.
 *
 * Exposes the generator dialog via:
 *  1. A hotbar macro (auto-created on first load)
 *  2. The module API: game.modules.get("coriolis-aio-gen").api.openDialog()
 *  3. The v13 ActorDirectory header controls dropdown (if supported)
 */

import { openUnifiedDialog } from "./unified-dialog.js";

const MODULE_ID = "coriolis-aio-gen";
const MACRO_NAME = "AIO Generator";

/* ---------- lifecycle hooks ---------- */

Hooks.once("init", () => {
  console.log(`${MODULE_ID} | Initializing Coriolis AIO Generator`);

  // Register module settings
  game.settings.register(MODULE_ID, "aiProvider", {
    name: "CORIOLIS_AIO.Settings.Provider",
    hint: "CORIOLIS_AIO.Settings.ProviderHint",
    scope: "world",
    config: true,
    type: String,
    default: "gemini",
    choices: {
      gemini: "Google Gemini (free tier)",
      openrouter: "OpenRouter (free models)",
      anthropic: "Anthropic Claude (paid)"
    }
  });

  game.settings.register(MODULE_ID, "aiApiKey", {
    name: "CORIOLIS_AIO.Settings.ApiKey",
    hint: "CORIOLIS_AIO.Settings.ApiKeyHint",
    scope: "world",
    config: true,
    type: String,
    default: ""
  });
});

Hooks.once("ready", async () => {
  if (game.system.id !== "yzecoriolis") {
    console.warn(
      `${MODULE_ID} | This module requires the yzecoriolis system. Current system: ${game.system.id}`
    );
    return;
  }
  console.log(
    `${MODULE_ID} | Ready — system: ${game.system.id} v${game.system.version}`
  );

  // Expose the public API
  game.modules.get(MODULE_ID).api = {
    openDialog: openUnifiedDialog
  };

  // Auto-create the hotbar macro for GMs on first load
  if (game.user.isGM) {
    await ensureMacro();
  }
});

/* ---------- hotbar macro ---------- */

const MACRO_COMMAND = `game.modules.get("coriolis-aio-gen").api.openDialog();`;

async function ensureMacro() {
  const existing = game.macros.find(
    (m) => m.name === MACRO_NAME && m.command === MACRO_COMMAND
  );
  if (existing) return;

  const macro = await Macro.create({
    name: MACRO_NAME,
    type: "script",
    img: "icons/svg/dice-target.svg",
    command: MACRO_COMMAND,
    flags: { [MODULE_ID]: { autoCreated: true } }
  });

  // Place on the first empty hotbar slot
  const bar = game.user.getHotbarMacros();
  const emptySlot = bar.find((s) => !s.macro);
  if (emptySlot && macro) {
    await game.user.assignHotbarMacro(macro, emptySlot.slot);
  }

  ui.notifications.info(
    `${MACRO_NAME} macro added to your hotbar. Click it to open the generator!`
  );
}

/* ---------- header controls (v13 fallback) ---------- */

Hooks.on("getHeaderControlsActorDirectory", (_app, controls) => {
  if (!game.user.isGM && !game.user.can("ACTOR_CREATE")) return;
  controls.push({
    icon: "fa-solid fa-dice-d20",
    label: game.i18n.localize("CORIOLIS_AIO.Button.Generate"),
    action: "coriolisAioGenerate",
    onClick: () => openUnifiedDialog(),
  });
});
