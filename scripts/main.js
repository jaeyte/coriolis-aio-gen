/**
 * Coriolis AIO Generator — Module entry point.
 *
 * Injects an "AIO Generator" button directly below the "Create Actor" button
 * in the Actors sidebar. Also adds it to the v13 header controls dropdown
 * as a fallback.
 */

import { openUnifiedDialog } from "./unified-dialog.js";

const MODULE_ID = "coriolis-aio-gen";
const BTN_CLASS = "coriolis-aio-generate-btn";

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

  // Delayed fallback for edge cases (sidebar rendered before hooks fired)
  setTimeout(() => injectButton(null), 500);
  setTimeout(() => injectButton(null), 2000);
});

/* ---------- DOM button injection ---------- */

function createButton() {
  const btn = document.createElement("button");
  btn.type = "button";
  btn.classList.add(BTN_CLASS);
  btn.innerHTML = `<i class="fas fa-dice-d20"></i> ${game.i18n.localize("CORIOLIS_AIO.Button.Generate")}`;
  btn.addEventListener("click", (ev) => {
    ev.preventDefault();
    ev.stopPropagation();
    openUnifiedDialog();
  });
  return btn;
}

/**
 * Inject the AIO Generator button below the "Create Actor" button.
 *
 * Searches multiple candidate roots to handle v13 ApplicationV2's
 * partial DOM delivery in render hooks.
 */
function injectButton(hookElement) {
  if (!game.user.isGM && !game.user.can("ACTOR_CREATE")) return;

  // Build candidate roots: hook element → ui.actors → document.body
  const candidates = [];
  if (hookElement instanceof HTMLElement) candidates.push(hookElement);
  try {
    const dirEl = ui.actors?.element;
    const el = dirEl instanceof HTMLElement ? dirEl : dirEl?.[0] ?? dirEl?.get?.(0);
    if (el instanceof HTMLElement) candidates.push(el);
  } catch { /* ui.actors may not exist yet */ }
  candidates.push(document.body);

  for (const root of candidates) {
    if (root.querySelector(`.${BTN_CLASS}`)) return;

    // Find the "Create Actor" button
    const createBtn = root.querySelector(
      [
        "#actors [data-action='createDocument']",
        "#actors [data-action='create']",
        "[data-tab='actors'] [data-action='createDocument']",
        "[data-tab='actors'] [data-action='create']",
        "[data-action='createDocument']",
        "[data-action='create']",
        "button.create-entry",
        "button.create-document"
      ].join(", ")
    );

    if (createBtn) {
      createBtn.insertAdjacentElement("afterend", createButton());
      return;
    }

    // Fallback: append to the action buttons container
    const container = root.querySelector(
      [
        "#actors .header-actions",
        "#actors .action-buttons",
        "[data-tab='actors'] .header-actions",
        "[data-tab='actors'] .action-buttons",
        ".header-actions",
        ".action-buttons",
        "[data-application-part='header']",
        ".directory-header"
      ].join(", ")
    );

    if (container) {
      container.appendChild(createButton());
      return;
    }
  }
}

/* ---------- render hooks ---------- */

// Primary: fires every time the ActorDirectory renders.
Hooks.on("renderActorDirectory", (_app, html) => {
  const root = html instanceof HTMLElement ? html : html?.[0] ?? null;
  injectButton(root);
});

// Fires when user switches sidebar tabs.
Hooks.on("changeSidebarTab", (app) => {
  if (app?.id !== "actors" && app?.tabName !== "actors") return;
  const el = app.element ?? app._element;
  const root = el instanceof HTMLElement ? el : el?.[0] ?? null;
  injectButton(root);
});

// v13: fires when the entire sidebar renders.
Hooks.on("renderSidebar", () => {
  setTimeout(() => injectButton(null), 100);
});

// v13: fires when any ApplicationV2 renders — catch ActorDirectory.
Hooks.on("renderApplication", (app, html) => {
  if (app?.id !== "actors" && app?.tabName !== "actors") return;
  const root = html instanceof HTMLElement ? html : html?.[0] ?? null;
  injectButton(root);
});

// Also in header controls dropdown as fallback.
Hooks.on("getHeaderControlsActorDirectory", (_app, controls) => {
  if (!game.user.isGM && !game.user.can("ACTOR_CREATE")) return;
  controls.push({
    icon: "fa-solid fa-dice-d20",
    label: game.i18n.localize("CORIOLIS_AIO.Button.Generate"),
    action: "coriolisAioGenerate",
    onClick: () => openUnifiedDialog(),
  });
});
