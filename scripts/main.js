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
  setTimeout(() => {
    try {
      const dir = ui.actors;
      const root =
        dir?.element instanceof HTMLElement
          ? dir.element
          : dir?.element?.[0] ?? dir?.element?.get?.(0);
      if (root) injectButton(root);
    } catch { /* ignored */ }
  }, 500);
});

/* ---------- DOM injection (cross-version) ---------- */

/**
 * Resolve the root HTMLElement from the render hook's html parameter.
 * Handles jQuery objects (v12) and vanilla HTMLElements (v13+).
 */
function resolveRoot(html) {
  if (html instanceof HTMLElement) return html;
  if (html?.jquery) return html[0];
  if (html?.[0] instanceof HTMLElement) return html[0];
  return null;
}

/**
 * Try to find the "Create Actor" button so we can insert directly after it.
 * Returns the button element or null.
 */
function findCreateActorButton(root) {
  for (const sel of [
    "[data-action='createDocument']",
    "[data-action='createEntry']",
    "[data-action='create']",
    "button.create-entry",
    "button.create-document",
  ]) {
    const btn = root.querySelector(sel);
    if (btn) return btn;
  }
  return null;
}

/**
 * Find the best container element in the sidebar header to append our button.
 * Used as a fallback when the Create Actor button cannot be found.
 */
function findActionsContainer(root) {
  // v12 selectors
  const v12 = root.querySelector(".header-actions");
  if (v12) return v12;

  // v13 selectors (ApplicationV2 DocumentDirectory)
  for (const sel of [
    ".action-buttons",
    ".directory-header .action-buttons",
    "[data-application-part='header'] .action-buttons",
    ".directory-controls",
    ".header-controls",
  ]) {
    const el = root.querySelector(sel);
    if (el) return el;
  }

  // v13 part-based fallbacks
  const headerPart = root.querySelector("[data-application-part='header']");
  if (headerPart) return headerPart;

  const dirHeader = root.querySelector(".directory-header");
  if (dirHeader) return dirHeader;

  const header = root.querySelector("header");
  if (header) return header;

  return null;
}

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
 * Inject the AIO Generator button into the given root element, positioned
 * directly after the "Create Actor" button.  Falls back to appending to the
 * actions container if the Create Actor button cannot be located.
 */
function injectButton(root) {
  if (!game.user.isGM && !game.user.can("ACTOR_CREATE")) return;
  if (root.querySelector(`.${BTN_CLASS}`)) return; // already injected

  const btn = createButton();

  // Preferred: insert directly after the Create Actor button
  const createBtn = findCreateActorButton(root);
  if (createBtn) {
    createBtn.insertAdjacentElement("afterend", btn);
    console.log(`${MODULE_ID} | Injected AIO Generator button after Create Actor`);
    return;
  }

  // Fallback: append to the actions container
  const container = findActionsContainer(root);
  if (container) {
    container.appendChild(btn);
    console.log(`${MODULE_ID} | Injected AIO Generator button into actions container`);
    return;
  }

  console.warn(
    `${MODULE_ID} | Could not find sidebar actions container to inject button.`
  );
}

/* ---------- render hooks ---------- */

// Primary: fires every time the ActorDirectory is rendered (v12 + v13).
Hooks.on("renderActorDirectory", (app, html) => {
  const root = resolveRoot(html);
  if (!root) {
    console.warn(`${MODULE_ID} | renderActorDirectory: could not resolve root element`);
    return;
  }
  injectButton(root);
});

// v13 fallback: fires when the user switches sidebar tabs.
Hooks.on("changeSidebarTab", (app) => {
  if (app?.id !== "actors" && app?.tabName !== "actors" && app?.constructor?.name !== "ActorDirectory") return;
  const root = resolveRoot(app.element ?? app._element);
  if (root) injectButton(root);
});

// v13 fallback: fires when the entire sidebar renders.
Hooks.on("renderSidebar", (_app, html) => {
  const root = resolveRoot(html);
  if (!root) return;
  // Find the actors tab panel inside the sidebar
  const actorsPanel =
    root.querySelector("#actors") ??
    root.querySelector("[data-tab='actors']") ??
    root.querySelector("[data-tab-group] [data-tab='actors']");
  if (actorsPanel) injectButton(actorsPanel);
});
