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
 * Resolve the root HTMLElement from the render hook's html parameter.
 * Handles jQuery objects (Foundry v12) and vanilla HTMLElements (Foundry v13+).
 */
function resolveRoot(html) {
  if (html instanceof HTMLElement) return html;
  if (html?.jquery) return html[0];
  if (html?.[0] instanceof HTMLElement) return html[0];
  return null;
}

/**
 * Find a suitable container element for injecting our generator buttons.
 * Tries multiple selectors for cross-version compatibility.
 */
function findActionsContainer(root) {
  // v12: jQuery-era sidebar used .header-actions
  const v12Actions = root.querySelector(".header-actions");
  if (v12Actions) return v12Actions;

  // v13: ApplicationV2 sidebar — look for the action buttons area
  const v13Actions = root.querySelector(".action-buttons");
  if (v13Actions) return v13Actions;

  // v13 fallback: find the parent of the Create Document button
  const createBtn = root.querySelector("[data-action='createEntry']")
    || root.querySelector("[data-action='createDocument']");
  if (createBtn?.parentElement) return createBtn.parentElement;

  // v13 fallback: the header part element
  const headerPart = root.querySelector("[data-application-part='header']");
  if (headerPart) return headerPart;

  return null;
}

/**
 * Create a generator button element.
 */
function createGeneratorButton(iconClass, labelKey, extraClasses, handler) {
  const btn = document.createElement("button");
  btn.type = "button";
  btn.classList.add("coriolis-aio-generate-btn", ...extraClasses);
  btn.innerHTML = `<i class="${iconClass}"></i> ${game.i18n.localize(labelKey)}`;
  btn.addEventListener("click", async (ev) => {
    ev.preventDefault();
    ev.stopPropagation();
    await handler();
  });
  return btn;
}

/**
 * Add generator buttons to the Actors Directory sidebar header.
 * Works with both Foundry v12 (jQuery) and v13+ (ApplicationV2 / HTMLElement).
 */
Hooks.on("renderActorDirectory", (app, html) => {
  // Only for GMs and users with actor creation permission
  if (!game.user.isGM && !game.user.can("ACTOR_CREATE")) return;

  const root = resolveRoot(html);
  if (!root) return;

  // Don't add buttons twice (guards against v13 partial re-renders)
  if (root.querySelector(".coriolis-aio-generate-btn")) return;

  const actionsEl = findActionsContainer(root);
  if (!actionsEl) {
    console.warn(`${MODULE_ID} | Could not find sidebar actions container to inject buttons`);
    return;
  }

  const charBtn = createGeneratorButton(
    "fas fa-dice-d20",
    "CORIOLIS_AIO.Button.Generate",
    [],
    openGeneratorDialog
  );

  const encBtn = createGeneratorButton(
    "fas fa-skull-crossbones",
    "CORIOLIS_AIO.Button.Encounter",
    ["coriolis-aio-encounter-btn"],
    openEncounterDialog
  );

  actionsEl.appendChild(charBtn);
  actionsEl.appendChild(encBtn);
});
