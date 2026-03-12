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
  if (!game.user.isGM && !game.user.can("ACTOR_CREATE")) return;

  // Avoid injecting duplicate buttons on re-renders
  const container = html instanceof jQuery ? html[0] : html;
  if (container.querySelector(".coriolis-aio-gen-sidebar-btn")) return;

  const btn = document.createElement("button");
  btn.type = "button";
  btn.classList.add("coriolis-aio-gen-sidebar-btn");
  btn.innerHTML = `<i class="fa-solid fa-dice-d20"></i> ${game.i18n.localize("CORIOLIS_AIO.Button.Generate")}`;
  btn.addEventListener("click", (e) => {
    e.preventDefault();
    openUnifiedDialog();
  });

  // Try multiple selectors to find the right insertion point in v13
  const headerActions = container.querySelector(".header-actions")
    ?? container.querySelector(".directory-header .action-buttons")
    ?? container.querySelector(".directory-header");

  if (headerActions) {
    headerActions.appendChild(btn);
  } else {
    // Fallback: prepend to the container itself
    container.prepend(btn);
  }

  console.log(`${MODULE_ID} | AIO Generator button added to Actor Directory`);
});
