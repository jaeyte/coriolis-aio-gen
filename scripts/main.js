/**
 * Coriolis AIO Generator — Module entry point.
 *
 * Registers hooks to add "Generate Character" and "Generate Encounter" buttons
 * to the Actors sidebar and wires up the generation dialogs.
 *
 * Supports both Foundry v12 (Application / jQuery) and v13+ (ApplicationV2 / HTMLElement).
 */

import { openGeneratorDialog } from "./dialog.js";
import { openEncounterDialog } from "./encounter-dialog.js";
import { openShipDialog } from "./ship-dialog.js";

const MODULE_ID = "coriolis-aio-gen";
const BTN_CLASS = "coriolis-aio-generate-btn";

/* ---------- lifecycle hooks ---------- */

Hooks.once("init", () => {
  console.log(`${MODULE_ID} | Initializing Coriolis AIO Generator`);

  // v13: register our custom actions on the ActorDirectory class so that
  // header controls added via getHeaderControlsActorDirectory actually work.
  try {
    const cls =
      CONFIG.ui?.actors ??
      globalThis.foundry?.applications?.sidebar?.tabs?.ActorDirectory;
    if (cls?.DEFAULT_OPTIONS) {
      const actions = (cls.DEFAULT_OPTIONS.actions ??= {});
      actions.coriolisAioGenerate = () => openGeneratorDialog();
      actions.coriolisAioEncounter = () => openEncounterDialog();
      actions.coriolisAioShip = () => openShipDialog();
      console.log(`${MODULE_ID} | Registered custom actions on ActorDirectory`);
    }
  } catch (e) {
    // Not critical — DOM injection will still work as a fallback.
    console.debug(`${MODULE_ID} | Could not register ActorDirectory actions:`, e);
  }
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

  // Ultimate fallback: try injecting into the already-rendered sidebar after
  // a short delay.  Covers edge cases where the directory was rendered before
  // any of our hooks fired (e.g. v13 cabinet-style sidebar).
  setTimeout(() => {
    try {
      const dir = ui.actors;
      const root =
        dir?.element instanceof HTMLElement
          ? dir.element
          : dir?.element?.[0] ?? dir?.element?.get?.(0);
      if (root) injectButtons(root);
    } catch { /* ignored */ }
  }, 500);
});

/* ---------- v13 header controls hook ---------- */

Hooks.on("getHeaderControlsActorDirectory", (app, controls) => {
  if (!game.user.isGM && !game.user.can("ACTOR_CREATE")) return;

  controls.push(
    {
      icon: "fa-solid fa-dice-d20",
      label: "CORIOLIS_AIO.Button.Generate",
      action: "coriolisAioGenerate",
    },
    {
      icon: "fa-solid fa-skull-crossbones",
      label: "CORIOLIS_AIO.Button.Encounter",
      action: "coriolisAioEncounter",
    },
    {
      icon: "fa-solid fa-rocket",
      label: "CORIOLIS_AIO.Button.Ship",
      action: "coriolisAioShip",
    }
  );

  console.log(`${MODULE_ID} | Added header controls via getHeaderControlsActorDirectory`);
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
 * Find the best container element in the sidebar header to append our buttons.
 * Tries a broad set of selectors for cross-version compatibility.
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

  // Find the parent of the "Create Actor" / "Create Document" button
  for (const sel of [
    "[data-action='createDocument']",
    "[data-action='createEntry']",
    "[data-action='create']",
    "button.create-entry",
    "button.create-document",
  ]) {
    const btn = root.querySelector(sel);
    if (btn?.parentElement) return btn.parentElement;
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
 * Create a styled generator button.
 */
function createButton(iconClass, labelKey, extraClasses, handler) {
  const btn = document.createElement("button");
  btn.type = "button";
  btn.classList.add(BTN_CLASS, ...extraClasses);
  btn.innerHTML = `<i class="${iconClass}"></i> ${game.i18n.localize(labelKey)}`;
  btn.addEventListener("click", async (ev) => {
    ev.preventDefault();
    ev.stopPropagation();
    await handler();
  });
  return btn;
}

/**
 * Inject the two generator buttons into the given root element unless they
 * are already present.  Wraps them in a themed container so they sit
 * side-by-side with the Coriolis visual treatment.
 */
function injectButtons(root) {
  if (!game.user.isGM && !game.user.can("ACTOR_CREATE")) return;
  if (root.querySelector(".coriolis-aio-btn-group")) return; // already injected

  const container = findActionsContainer(root);
  if (!container) {
    console.warn(
      `${MODULE_ID} | Could not find sidebar actions container to inject buttons.`
    );
    return;
  }

  // Wrapper keeps both buttons on one row with themed styling
  const group = document.createElement("div");
  group.classList.add("coriolis-aio-btn-group");

  group.appendChild(
    createButton("fas fa-dice-d20", "CORIOLIS_AIO.Button.Generate", [], openGeneratorDialog)
  );
  group.appendChild(
    createButton(
      "fas fa-skull-crossbones",
      "CORIOLIS_AIO.Button.Encounter",
      ["coriolis-aio-encounter-btn"],
      openEncounterDialog
    )
  );
  group.appendChild(
    createButton(
      "fas fa-rocket",
      "CORIOLIS_AIO.Button.Ship",
      ["coriolis-aio-ship-btn"],
      openShipDialog
    )
  );

  container.appendChild(group);

  console.log(`${MODULE_ID} | Injected generator buttons into sidebar`);
}

/**
 * Bind click listeners to any header-controls buttons that were added via
 * the getHeaderControls hook but whose actions may not have been registered
 * early enough.
 */
function bindHeaderControlActions(root) {
  for (const [action, handler] of [
    ["coriolisAioGenerate", openGeneratorDialog],
    ["coriolisAioEncounter", openEncounterDialog],
    ["coriolisAioShip", openShipDialog],
  ]) {
    const el = root.querySelector(`[data-action='${action}']`);
    if (el && !el.dataset.coriolisAioBound) {
      el.addEventListener("click", (ev) => {
        ev.preventDefault();
        ev.stopPropagation();
        handler();
      });
      el.dataset.coriolisAioBound = "1";
    }
  }
}

/* ---------- render hooks ---------- */

// Primary: fires every time the ActorDirectory is rendered (v12 + v13).
Hooks.on("renderActorDirectory", (app, html) => {
  const root = resolveRoot(html);
  if (!root) {
    console.warn(`${MODULE_ID} | renderActorDirectory: could not resolve root element`);
    return;
  }
  injectButtons(root);
  bindHeaderControlActions(root);
});

// v13 fallback: fires when the user switches sidebar tabs.
Hooks.on("changeSidebarTab", (app) => {
  if (app?.id !== "actors" && app?.tabName !== "actors" && app?.constructor?.name !== "ActorDirectory") return;
  const root = resolveRoot(app.element ?? app._element);
  if (root) injectButtons(root);
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
  if (actorsPanel) injectButtons(actorsPanel);
});
