/**
 * Coriolis AIO Generator — Module entry point.
 *
 * Exposes the generator dialog via:
 *  1. A button injected into the Actor Directory sidebar
 *  2. The module API: game.modules.get("coriolis-aio-gen").api.openDialog()
 */

import { openUnifiedDialog } from "./unified-dialog.js";

const MODULE_ID = "coriolis-aio-gen";

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
    default: "groq",
    choices: {
      groq: "Groq (free tier)",
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

  game.settings.register(MODULE_ID, "aiModel", {
    name: "CORIOLIS_AIO.Settings.Model",
    hint: "CORIOLIS_AIO.Settings.ModelHint",
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

  // Expose the public API
  game.modules.get(MODULE_ID).api = {
    openDialog: openUnifiedDialog
  };
});

/* ---------- Actor Directory sidebar button ---------- */

Hooks.on("renderActorDirectory", (app, html) => {
  if (!game.user.isGM && !game.user.hasPermission("ACTOR_CREATE")) return;

  // Foundry v13 passes a plain HTMLElement; earlier versions may pass jQuery
  const container = html instanceof jQuery ? html[0] : html;

  // Avoid injecting duplicate buttons on re-renders (ApplicationV2 partial renders)
  if (container.querySelector(".coriolis-aio-gen-sidebar-btn")) return;

  const btn = document.createElement("button");
  btn.type = "button";
  btn.classList.add("coriolis-aio-gen-sidebar-btn");
  btn.innerHTML = `<i class="fas fa-dice-d20"></i> ${game.i18n.localize("CORIOLIS_AIO.Button.Generate")}`;
  btn.addEventListener("click", (e) => {
    e.preventDefault();
    openUnifiedDialog();
  });

  // Try multiple selectors for Foundry v13 (ApplicationV2) and earlier versions.
  // v13 uses .header-actions or .action-buttons for its button container;
  // older versions use .directory-header.
  const actionBar = container.querySelector(".header-actions")
    || container.querySelector(".action-buttons")
    || container.querySelector(".directory-header");

  if (actionBar) {
    actionBar.insertAdjacentElement("afterend", btn);
  } else {
    // Last resort: insert at the top of the container
    container.prepend(btn);
  }

  console.log(`${MODULE_ID} | AIO Generator button added to Actor Directory`);
});
