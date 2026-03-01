/**
 * Compendium Resolver — attempts to pull item/talent data from installed
 * compendium packs before falling back to built-in data definitions.
 *
 * Priority:
 *  1. coriolis-corerules compendium packs (premium module)
 *  2. World-level compendiums
 *  3. Built-in data from scripts/data/
 */

import { TALENTS } from "./data/talents.js";

/**
 * Cache discovered compendium packs on first use.
 */
let _packCache = null;

function getItemPacks() {
  if (_packCache) return _packCache;

  _packCache = [];
  for (const pack of game.packs) {
    if (pack.metadata.type !== "Item") continue;
    _packCache.push({
      pack,
      priority: pack.metadata.packageName === "coriolis-corerules" ? 0
        : pack.metadata.packageName === "yzecoriolis" ? 1
        : 2
    });
  }
  _packCache.sort((a, b) => a.priority - b.priority);
  return _packCache;
}

/**
 * Search compendium packs for an item by name and optional type.
 * Returns a plain object suitable for embedded item creation, or null.
 *
 * @param {string} name - Item name to search for
 * @param {string} [type] - Optional item type filter (e.g., "talent", "weapon")
 * @returns {Promise<object|null>}
 */
export async function resolveFromCompendium(name, type) {
  const packs = getItemPacks();

  for (const { pack } of packs) {
    // Ensure the index is loaded
    if (!pack.index.size) {
      await pack.getIndex();
    }

    // Search by name (case-insensitive)
    const entry = pack.index.find(e => {
      const nameMatch = e.name.toLowerCase() === name.toLowerCase();
      if (type && e.type) return nameMatch && e.type === type;
      return nameMatch;
    });

    if (entry) {
      const doc = await pack.getDocument(entry._id);
      return doc.toObject();
    }
  }

  return null;
}

/**
 * Resolve a talent — try compendium first, fall back to built-in data.
 *
 * @param {string} talentKey - Key from TALENTS object
 * @returns {Promise<object>} Item data object for embedded creation
 */
export async function resolveTalent(talentKey) {
  const builtIn = TALENTS[talentKey];
  if (!builtIn) {
    console.warn(`coriolis-aio-gen | Unknown talent key: ${talentKey}`);
    return null;
  }

  // Try compendium
  const compendiumItem = await resolveFromCompendium(builtIn.name, "talent");
  if (compendiumItem) {
    return compendiumItem;
  }

  // Fall back to built-in
  return {
    name: builtIn.name,
    type: "talent",
    system: {
      description: builtIn.description,
      category: builtIn.category,
      groupConcept: builtIn.groupConcept || "",
      cost: 0
    }
  };
}

/**
 * Resolve a gear/weapon/armor item — try compendium first, fall back to provided data.
 *
 * @param {object} itemData - Built-in item data with name, type, and system fields
 * @returns {Promise<object>} Item data object for embedded creation
 */
export async function resolveItem(itemData) {
  const compendiumItem = await resolveFromCompendium(itemData.name, itemData.type);
  if (compendiumItem) {
    // Preserve quantity from built-in data if specified
    if (itemData.system?.quantity && compendiumItem.system) {
      compendiumItem.system.quantity = itemData.system.quantity;
    }
    return compendiumItem;
  }

  // Use built-in data as-is
  return { ...itemData };
}

/**
 * Resolve multiple items in parallel.
 *
 * @param {object[]} items - Array of built-in item data objects
 * @returns {Promise<object[]>}
 */
export async function resolveItems(items) {
  return Promise.all(items.map(item => resolveItem(item)));
}

/**
 * Clear the pack cache (useful if packs change during a session).
 */
export function clearCache() {
  _packCache = null;
}
