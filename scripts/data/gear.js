/**
 * Starting gear tables by sub-concept gear key.
 *
 * Each entry lists the items a character of that sub-concept starts with.
 * Weapon/armor/gear entries match the yzecoriolis item schema.
 */

export const STARTING_GEAR = {
  // ── Artist ─────────────────────────────────────────────────
  courtesan: {
    weapons: [
      { name: "Knife", type: "weapon", system: { damage: 1, range: "contact", melee: true, weight: "L", techTier: "P", bonus: 0, initiative: 1 } }
    ],
    armor: [],
    gear: [
      { name: "Communicator", type: "gear", system: { weight: "T", techTier: "O" } },
      { name: "Exquisite Clothing", type: "gear", system: { weight: "L", techTier: "O" } },
      { name: "Cosmetic Kit", type: "gear", system: { weight: "L", techTier: "O" } },
      { name: "Tabak", type: "gear", system: { weight: "T", techTier: "P", quantity: 5 } }
    ]
  },
  musician: {
    weapons: [],
    armor: [],
    gear: [
      { name: "Communicator", type: "gear", system: { weight: "T", techTier: "O" } },
      { name: "Musical Instrument", type: "gear", system: { weight: "N", techTier: "O" } },
      { name: "Portable Sound System", type: "gear", system: { weight: "L", techTier: "O" } }
    ]
  },
  poet: {
    weapons: [],
    armor: [],
    gear: [
      { name: "Communicator", type: "gear", system: { weight: "T", techTier: "O" } },
      { name: "Computer Tablet", type: "gear", system: { weight: "L", techTier: "O" } },
      { name: "Fine Clothing", type: "gear", system: { weight: "L", techTier: "O" } }
    ]
  },

  // ── Data Spider ────────────────────────────────────────────
  analyst: {
    weapons: [],
    armor: [],
    gear: [
      { name: "Communicator", type: "gear", system: { weight: "T", techTier: "O" } },
      { name: "Computer", type: "gear", system: { weight: "L", techTier: "O" } },
      { name: "Sensor Package", type: "gear", system: { weight: "L", techTier: "O" } }
    ]
  },
  correspondent: {
    weapons: [],
    armor: [],
    gear: [
      { name: "Communicator", type: "gear", system: { weight: "T", techTier: "O" } },
      { name: "Computer", type: "gear", system: { weight: "L", techTier: "O" } },
      { name: "Camera Drone", type: "gear", system: { weight: "L", techTier: "O" } },
      { name: "Press Pass", type: "gear", system: { weight: "T", techTier: "O" } }
    ]
  },
  dataDjinn: {
    weapons: [],
    armor: [],
    gear: [
      { name: "Communicator", type: "gear", system: { weight: "T", techTier: "O" } },
      { name: "Computer", type: "gear", system: { weight: "L", techTier: "O" } },
      { name: "Tools (Ordinary)", type: "gear", system: { weight: "N", techTier: "O" } },
      { name: "Proximity Sensor", type: "gear", system: { weight: "L", techTier: "O" } }
    ]
  },

  // ── Fugitive ───────────────────────────────────────────────
  criminal: {
    weapons: [
      { name: "Vulcan Pistol", type: "weapon", system: { damage: 2, range: "short", melee: false, weight: "L", techTier: "O", bonus: 1, initiative: 0 } }
    ],
    armor: [],
    gear: [
      { name: "Communicator", type: "gear", system: { weight: "T", techTier: "O" } },
      { name: "Lock Pick Set", type: "gear", system: { weight: "T", techTier: "O" } },
      { name: "Fake ID Tag", type: "gear", system: { weight: "T", techTier: "O" } }
    ]
  },
  mystic: {
    weapons: [
      { name: "Knife", type: "weapon", system: { damage: 1, range: "contact", melee: true, weight: "L", techTier: "P", bonus: 0, initiative: 1 } }
    ],
    armor: [],
    gear: [
      { name: "Communicator", type: "gear", system: { weight: "T", techTier: "O" } },
      { name: "Prayer Beads", type: "gear", system: { weight: "T", techTier: "P" } },
      { name: "Mystical Focus", type: "gear", system: { weight: "T", techTier: "P" } }
    ]
  },
  revolutionary: {
    weapons: [
      { name: "Vulcan Pistol", type: "weapon", system: { damage: 2, range: "short", melee: false, weight: "L", techTier: "O", bonus: 1, initiative: 0 } }
    ],
    armor: [],
    gear: [
      { name: "Communicator", type: "gear", system: { weight: "T", techTier: "O" } },
      { name: "Pamphlets", type: "gear", system: { weight: "T", techTier: "P" } },
      { name: "Disguise Kit", type: "gear", system: { weight: "L", techTier: "O" } }
    ]
  },

  // ── Negotiator ─────────────────────────────────────────────
  agitator: {
    weapons: [],
    armor: [],
    gear: [
      { name: "Communicator", type: "gear", system: { weight: "T", techTier: "O" } },
      { name: "Computer Tablet", type: "gear", system: { weight: "L", techTier: "O" } },
      { name: "Fine Clothing", type: "gear", system: { weight: "L", techTier: "O" } }
    ]
  },
  diplomat: {
    weapons: [],
    armor: [],
    gear: [
      { name: "Communicator", type: "gear", system: { weight: "T", techTier: "O" } },
      { name: "Computer Tablet", type: "gear", system: { weight: "L", techTier: "O" } },
      { name: "Fine Clothing", type: "gear", system: { weight: "L", techTier: "O" } },
      { name: "Faction Badge", type: "gear", system: { weight: "T", techTier: "O" } }
    ]
  },
  peddler: {
    weapons: [],
    armor: [],
    gear: [
      { name: "Communicator", type: "gear", system: { weight: "T", techTier: "O" } },
      { name: "Trade Goods", type: "gear", system: { weight: "N", techTier: "O" } },
      { name: "Calculator", type: "gear", system: { weight: "T", techTier: "O" } }
    ]
  },

  // ── Operative ──────────────────────────────────────────────
  assassin: {
    weapons: [
      { name: "Knife", type: "weapon", system: { damage: 1, range: "contact", melee: true, weight: "L", techTier: "P", bonus: 0, initiative: 1 } },
      { name: "Vulcan Pistol", type: "weapon", system: { damage: 2, range: "short", melee: false, weight: "L", techTier: "O", bonus: 1, initiative: 0 } }
    ],
    armor: [],
    gear: [
      { name: "Communicator", type: "gear", system: { weight: "T", techTier: "O" } },
      { name: "Poison Vial", type: "gear", system: { weight: "T", techTier: "O" } }
    ]
  },
  guard: {
    weapons: [
      { name: "Vulcan Cricket", type: "weapon", system: { damage: 2, range: "short", melee: false, weight: "L", techTier: "O", bonus: 1, initiative: 0 } }
    ],
    armor: [
      { name: "Light Armor Vest", type: "armor", system: { armorRating: 2, weight: "N", techTier: "O" } }
    ],
    gear: [
      { name: "Communicator", type: "gear", system: { weight: "T", techTier: "O" } },
      { name: "Handcuffs", type: "gear", system: { weight: "T", techTier: "O" } }
    ]
  },
  spy: {
    weapons: [
      { name: "Vulcan Pistol", type: "weapon", system: { damage: 2, range: "short", melee: false, weight: "L", techTier: "O", bonus: 1, initiative: 0 } }
    ],
    armor: [],
    gear: [
      { name: "Communicator", type: "gear", system: { weight: "T", techTier: "O" } },
      { name: "Disguise Kit", type: "gear", system: { weight: "L", techTier: "O" } },
      { name: "Spy Glass", type: "gear", system: { weight: "L", techTier: "O" } }
    ]
  },

  // ── Pilot ──────────────────────────────────────────────────
  driver: {
    weapons: [
      { name: "Vulcan Pistol", type: "weapon", system: { damage: 2, range: "short", melee: false, weight: "L", techTier: "O", bonus: 1, initiative: 0 } }
    ],
    armor: [],
    gear: [
      { name: "Communicator", type: "gear", system: { weight: "T", techTier: "O" } },
      { name: "Flight Suit", type: "gear", system: { weight: "N", techTier: "O" } },
      { name: "Tools (Ordinary)", type: "gear", system: { weight: "N", techTier: "O" } }
    ]
  },
  fighterPilot: {
    weapons: [
      { name: "Vulcan Pistol", type: "weapon", system: { damage: 2, range: "short", melee: false, weight: "L", techTier: "O", bonus: 1, initiative: 0 } }
    ],
    armor: [
      { name: "Flight Suit", type: "armor", system: { armorRating: 1, weight: "N", techTier: "O" } }
    ],
    gear: [
      { name: "Communicator", type: "gear", system: { weight: "T", techTier: "O" } },
      { name: "Survival Kit", type: "gear", system: { weight: "L", techTier: "O" } }
    ]
  },
  freighterPilot: {
    weapons: [],
    armor: [],
    gear: [
      { name: "Communicator", type: "gear", system: { weight: "T", techTier: "O" } },
      { name: "Flight Suit", type: "gear", system: { weight: "N", techTier: "O" } },
      { name: "Tools (Ordinary)", type: "gear", system: { weight: "N", techTier: "O" } },
      { name: "Navigation Charts", type: "gear", system: { weight: "T", techTier: "O" } }
    ]
  },

  // ── Preacher ───────────────────────────────────────────────
  ascetic: {
    weapons: [
      { name: "Staff", type: "weapon", system: { damage: 1, range: "contact", melee: true, weight: "N", techTier: "P", bonus: 0, initiative: 0 } }
    ],
    armor: [],
    gear: [
      { name: "Communicator", type: "gear", system: { weight: "T", techTier: "O" } },
      { name: "Prayer Beads", type: "gear", system: { weight: "T", techTier: "P" } },
      { name: "Holy Book", type: "gear", system: { weight: "L", techTier: "P" } }
    ]
  },
  missionary: {
    weapons: [],
    armor: [],
    gear: [
      { name: "Communicator", type: "gear", system: { weight: "T", techTier: "O" } },
      { name: "Prayer Beads", type: "gear", system: { weight: "T", techTier: "P" } },
      { name: "Holy Book", type: "gear", system: { weight: "L", techTier: "P" } },
      { name: "Medicurgy Kit", type: "gear", system: { weight: "L", techTier: "O" } }
    ]
  },
  prophet: {
    weapons: [],
    armor: [],
    gear: [
      { name: "Communicator", type: "gear", system: { weight: "T", techTier: "O" } },
      { name: "Prayer Beads", type: "gear", system: { weight: "T", techTier: "P" } },
      { name: "Ritual Focus", type: "gear", system: { weight: "T", techTier: "P" } },
      { name: "Fine Robes", type: "gear", system: { weight: "L", techTier: "O" } }
    ]
  },

  // ── Scientist ──────────────────────────────────────────────
  archaeologist: {
    weapons: [
      { name: "Knife", type: "weapon", system: { damage: 1, range: "contact", melee: true, weight: "L", techTier: "P", bonus: 0, initiative: 1 } }
    ],
    armor: [],
    gear: [
      { name: "Communicator", type: "gear", system: { weight: "T", techTier: "O" } },
      { name: "Computer Tablet", type: "gear", system: { weight: "L", techTier: "O" } },
      { name: "Archaeological Tools", type: "gear", system: { weight: "N", techTier: "O" } },
      { name: "Survey Scanner", type: "gear", system: { weight: "L", techTier: "O" } }
    ]
  },
  medicurg: {
    weapons: [],
    armor: [],
    gear: [
      { name: "Communicator", type: "gear", system: { weight: "T", techTier: "O" } },
      { name: "Medicurgy Kit", type: "gear", system: { weight: "L", techTier: "O" } },
      { name: "Computer Tablet", type: "gear", system: { weight: "L", techTier: "O" } },
      { name: "Medlab Drugs", type: "gear", system: { weight: "T", techTier: "O", quantity: 3 } }
    ]
  },
  technician: {
    weapons: [],
    armor: [],
    gear: [
      { name: "Communicator", type: "gear", system: { weight: "T", techTier: "O" } },
      { name: "Tools (Advanced)", type: "gear", system: { weight: "N", techTier: "A" } },
      { name: "Computer Tablet", type: "gear", system: { weight: "L", techTier: "O" } },
      { name: "Spare Parts", type: "gear", system: { weight: "L", techTier: "O" } }
    ]
  },

  // ── Ship Worker ────────────────────────────────────────────
  deckhand: {
    weapons: [
      { name: "Knife", type: "weapon", system: { damage: 1, range: "contact", melee: true, weight: "L", techTier: "P", bonus: 0, initiative: 1 } }
    ],
    armor: [],
    gear: [
      { name: "Communicator", type: "gear", system: { weight: "T", techTier: "O" } },
      { name: "Tools (Ordinary)", type: "gear", system: { weight: "N", techTier: "O" } },
      { name: "Work Gloves", type: "gear", system: { weight: "T", techTier: "P" } }
    ]
  },
  dockWorker: {
    weapons: [
      { name: "Crowbar", type: "weapon", system: { damage: 2, range: "contact", melee: true, weight: "N", techTier: "P", bonus: 1, initiative: -1 } }
    ],
    armor: [],
    gear: [
      { name: "Communicator", type: "gear", system: { weight: "T", techTier: "O" } },
      { name: "Tools (Ordinary)", type: "gear", system: { weight: "N", techTier: "O" } },
      { name: "Exo Loader License", type: "gear", system: { weight: "T", techTier: "O" } }
    ]
  },
  engineer: {
    weapons: [],
    armor: [],
    gear: [
      { name: "Communicator", type: "gear", system: { weight: "T", techTier: "O" } },
      { name: "Tools (Advanced)", type: "gear", system: { weight: "N", techTier: "A" } },
      { name: "Computer Tablet", type: "gear", system: { weight: "L", techTier: "O" } },
      { name: "Spare Parts", type: "gear", system: { weight: "L", techTier: "O" } }
    ]
  },

  // ── Soldier ────────────────────────────────────────────────
  legionnaire: {
    weapons: [
      { name: "Vulcan Carbine", type: "weapon", system: { damage: 3, range: "long", melee: false, weight: "N", techTier: "O", bonus: 2, initiative: -2, automatic: true } }
    ],
    armor: [
      { name: "Armor Vest", type: "armor", system: { armorRating: 4, weight: "N", techTier: "O" } }
    ],
    gear: [
      { name: "Communicator", type: "gear", system: { weight: "T", techTier: "O" } },
      { name: "Survival Kit", type: "gear", system: { weight: "L", techTier: "O" } }
    ]
  },
  mercenary: {
    weapons: [
      { name: "Vulcan Carbine", type: "weapon", system: { damage: 3, range: "long", melee: false, weight: "N", techTier: "O", bonus: 2, initiative: -2, automatic: true } },
      { name: "Knife", type: "weapon", system: { damage: 1, range: "contact", melee: true, weight: "L", techTier: "P", bonus: 0, initiative: 1 } }
    ],
    armor: [
      { name: "Light Armor Vest", type: "armor", system: { armorRating: 2, weight: "N", techTier: "O" } }
    ],
    gear: [
      { name: "Communicator", type: "gear", system: { weight: "T", techTier: "O" } }
    ]
  },
  officer: {
    weapons: [
      { name: "Vulcan Pistol", type: "weapon", system: { damage: 2, range: "short", melee: false, weight: "L", techTier: "O", bonus: 1, initiative: 0 } }
    ],
    armor: [
      { name: "Light Armor Vest", type: "armor", system: { armorRating: 2, weight: "N", techTier: "O" } }
    ],
    gear: [
      { name: "Communicator", type: "gear", system: { weight: "T", techTier: "O" } },
      { name: "Computer Tablet", type: "gear", system: { weight: "L", techTier: "O" } },
      { name: "Officer's Insignia", type: "gear", system: { weight: "T", techTier: "O" } }
    ]
  },

  // ── Trailblazer ────────────────────────────────────────────
  colonist: {
    weapons: [
      { name: "Vulcan Pistol", type: "weapon", system: { damage: 2, range: "short", melee: false, weight: "L", techTier: "O", bonus: 1, initiative: 0 } }
    ],
    armor: [],
    gear: [
      { name: "Communicator", type: "gear", system: { weight: "T", techTier: "O" } },
      { name: "Survival Kit", type: "gear", system: { weight: "L", techTier: "O" } },
      { name: "Tools (Ordinary)", type: "gear", system: { weight: "N", techTier: "O" } }
    ]
  },
  prospector: {
    weapons: [
      { name: "Vulcan Pistol", type: "weapon", system: { damage: 2, range: "short", melee: false, weight: "L", techTier: "O", bonus: 1, initiative: 0 } }
    ],
    armor: [],
    gear: [
      { name: "Communicator", type: "gear", system: { weight: "T", techTier: "O" } },
      { name: "Survey Scanner", type: "gear", system: { weight: "L", techTier: "O" } },
      { name: "Geologist's Tools", type: "gear", system: { weight: "N", techTier: "O" } }
    ]
  },
  scout: {
    weapons: [
      { name: "Vulcan Carbine", type: "weapon", system: { damage: 3, range: "long", melee: false, weight: "N", techTier: "O", bonus: 2, initiative: -2 } }
    ],
    armor: [],
    gear: [
      { name: "Communicator", type: "gear", system: { weight: "T", techTier: "O" } },
      { name: "Survival Kit", type: "gear", system: { weight: "L", techTier: "O" } },
      { name: "Binoculars", type: "gear", system: { weight: "L", techTier: "O" } }
    ]
  }
};
