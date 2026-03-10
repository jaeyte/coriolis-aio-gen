/**
 * Coriolis AIO Generator — Module entry point.
 *
 * Registers hooks to add a single "AIO Generator" button directly below the
 * "Create Actor" button in the Actors sidebar.
 *
 * Supports both Foundry v12 (Application / jQuery) and v13+ (ApplicationV2 / HTMLElement).
 */

import { openUnifiedDialog } from "./unified-dialog.js";

const MODULE_ID = "coriolis-aio-gen";
const BTN_CLASS = "coriolis-aio-generate-btn";

/* ---------- lifecycle hooks ---------- */

Hooks.once("init", () => {
  console.log(`${MODULE_ID} | Initializing Coriolis AIO Generator`);
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

  // Fallback: try injecting into the already-rendered sidebar after a short
  // delay.  Covers edge cases where the directory was rendered before any of
  // our hooks fired (e.g. v13 cabinet-style sidebar).
  setTimeout(() => injectButton(null), 500);
  // Second attempt with a longer delay for slow-loading worlds
  setTimeout(() => injectButton(null), 2000);
});

/* ---------- DOM injection ---------- */

/**
 * Create the AIO Generator button element.
 */
function createButton() {
  const btn = document.createElement("button");
  btn.type = "button";
  btn.classList.add(BTN_CLASS);
  btn.innerHTML = `<i class="fas fa-dice-d20"></i> ${game.i18n.localize("CORIOLIS_AIO.Button.Generate")}`;
  btn.addEventListener("click", async (ev) => {
    ev.preventDefault();
    ev.stopPropagation();
    await openUnifiedDialog();
  });
  return btn;
}

/**
 * Attempt to inject the AIO Generator button into the Actors sidebar.
 *
 * In Foundry v13 (ApplicationV2), render hooks may only pass a partial
 * element (e.g. the list area) that does not include the header/action
 * buttons.  To handle this reliably we search multiple candidate roots:
 *   1. The element provided by the hook (if any)
 *   2. The ui.actors application element
 *   3. The global document (last resort)
 *
 * Within each root we look for the "Create Actor / Create Document" button
 * and insert directly after it, or fall back to the header actions container.
 */
function injectButton(hookElement) {
  if (!game.user.isGM && !game.user.can("ACTOR_CREATE")) return;

  // Build ordered list of candidate root elements to search.
  const candidates = [];
  if (hookElement instanceof HTMLElement) candidates.push(hookElement);
  try {
    const dirEl = ui.actors?.element;
    const el =
      dirEl instanceof HTMLElement ? dirEl : dirEl?.[0] ?? dirEl?.get?.(0);
    if (el instanceof HTMLElement) candidates.push(el);
  } catch { /* ui.actors may not exist yet */ }
  candidates.push(document.body);

  for (const root of candidates) {
    // Skip if already injected within this root
    if (root.querySelector(`.${BTN_CLASS}`)) return;

    // --- Try to find the "Create Actor" button ---
    const createBtn = root.querySelector(
      [
        // v13 ApplicationV2 DocumentDirectory
        "#actors [data-action='createDocument']",
        "#actors [data-action='create']",
        "[data-tab='actors'] [data-action='createDocument']",
        "[data-tab='actors'] [data-action='create']",
        // Direct child selectors (when root IS the actors panel)
        "[data-action='createDocument']",
        "[data-action='createEntry']",
        "[data-action='create']",
        // v12 class-based
        "button.create-entry",
        "button.create-document",
      ].join(", ")
    );

    if (createBtn) {
      const btn = createButton();
      createBtn.insertAdjacentElement("afterend", btn);
      console.log(`${MODULE_ID} | Injected button after Create Actor button`);
      return;
    }

    // --- Fallback: find the header/actions container ---
    const container = root.querySelector(
      [
        "#actors .header-actions",
        "#actors .action-buttons",
        "#actors .directory-header",
        "[data-tab='actors'] .header-actions",
        "[data-tab='actors'] .action-buttons",
        "[data-tab='actors'] .directory-header",
        ".header-actions",
        ".action-buttons",
        "[data-application-part='header'] .action-buttons",
        ".directory-header .action-buttons",
        ".directory-controls",
        ".header-controls",
        "[data-application-part='header']",
        ".directory-header",
      ].join(", ")
    );

    if (container) {
      const btn = createButton();
      container.appendChild(btn);
      console.log(`${MODULE_ID} | Injected button into actions container`);
      return;
    }
  }

  console.warn(`${MODULE_ID} | Could not find a place to inject the button`);
}

/* ---------- render hooks ---------- */

// Primary: fires every time the ActorDirectory is rendered.
Hooks.on("renderActorDirectory", (_app, html) => {
  const root = html instanceof HTMLElement ? html : html?.[0] ?? null;
  injectButton(root);
});

// Fires when the user switches sidebar tabs.
Hooks.on("changeSidebarTab", (app) => {
  if (app?.id !== "actors" && app?.tabName !== "actors" && app?.constructor?.name !== "ActorDirectory") return;
  const el = app.element ?? app._element;
  const root = el instanceof HTMLElement ? el : el?.[0] ?? null;
  injectButton(root);
});

// Fires when the entire sidebar renders (v13).
Hooks.on("renderSidebar", () => {
  // Delay slightly to let the sidebar DOM settle.
  setTimeout(() => injectButton(null), 100);
});

// Fires when any ApplicationV2 renders — catch ActorDirectory specifically.
Hooks.on("renderApplication", (app, html) => {
  if (app?.id !== "actors" && app?.tabName !== "actors" && app?.constructor?.name !== "ActorDirectory") return;
  const root = html instanceof HTMLElement ? html : html?.[0] ?? null;
  injectButton(root);
});
