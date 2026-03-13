/**
 * Group concepts define the crew type. Each group concept has associated talents.
 */

export const GROUP_CONCEPTS = {
  freeTraders: {
    label: "Free Traders",
    description: "Merchants and smugglers travelling the Horizon for profit.",
    talents: ["anoseforbirr", "everythingisforsale"]
  },
  mercenaries: {
    label: "Mercenaries",
    description: "Guns for hire, soldiers of fortune, and bodyguards.",
    talents: ["assault", "charge"]
  },
  agents: {
    label: "Agents",
    description: "Spies, operatives, and covert agents working in the shadows.",
    talents: ["camouflage", "quickdraw"]
  },
  explorers: {
    label: "Explorers",
    description: "Seekers of lost worlds, ancient ruins, and forgotten portals.",
    talents: ["trailblazing", "quickthinker"]
  },
  pilgrims: {
    label: "Pilgrims",
    description: "Faithful travellers on a spiritual journey across the Horizon.",
    talents: ["blessing", "prayerpower"]
  }
};
