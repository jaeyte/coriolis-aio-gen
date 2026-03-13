/**
 * Character concepts and sub-concepts for Coriolis: The Third Horizon.
 *
 * Each concept defines:
 *  - keyAttribute: the attribute most associated with the concept
 *  - subConcepts: each sub-concept has concept skill recommendations and starting gear keys
 *  - conceptSkills: which skills the concept emphasises
 *  - conceptTalents: talents available to this concept at creation
 *
 * Attribute point budget: 14 points total, min 2 max 5 per attribute.
 * Skill point budget: varies by concept (typically 8-10 concept skill points + upbringing bonus).
 */

export const CONCEPTS = {
  artist: {
    label: "Artist",
    keyAttribute: "empathy",
    conceptSkills: ["culture", "dexterity", "manipulation", "observation"],
    conceptTalents: ["exquisite", "seductive"],
    subConcepts: {
      courtesan: {
        label: "Courtesan",
        gearKey: "courtesan",
        bonusSkills: ["manipulation", "culture"]
      },
      musician: {
        label: "Musician",
        gearKey: "musician",
        bonusSkills: ["culture", "dexterity"]
      },
      poet: {
        label: "Poet",
        gearKey: "poet",
        bonusSkills: ["culture", "manipulation"]
      }
    }
  },
  dataSpider: {
    label: "Data Spider",
    keyAttribute: "wits",
    conceptSkills: ["datadjinn", "infiltration", "manipulation", "science"],
    conceptTalents: ["hacker", "informant"],
    subConcepts: {
      analyst: {
        label: "Analyst",
        gearKey: "analyst",
        bonusSkills: ["datadjinn", "science"]
      },
      correspondent: {
        label: "Correspondent",
        gearKey: "correspondent",
        bonusSkills: ["datadjinn", "manipulation"]
      },
      dataDjinn: {
        label: "Data Djinn",
        gearKey: "dataDjinn",
        bonusSkills: ["datadjinn", "technology"]
      }
    }
  },
  fugitive: {
    label: "Fugitive",
    keyAttribute: "agility",
    conceptSkills: ["dexterity", "infiltration", "meleecombat", "survival"],
    conceptTalents: ["rugged", "wanted"],
    subConcepts: {
      criminal: {
        label: "Criminal",
        gearKey: "criminal",
        bonusSkills: ["infiltration", "dexterity"]
      },
      mystic: {
        label: "Mystic",
        gearKey: "mystic",
        bonusSkills: ["mysticpowers", "survival"]
      },
      revolutionary: {
        label: "Revolutionary",
        gearKey: "revolutionary",
        bonusSkills: ["rangedcombat", "manipulation"]
      }
    }
  },
  negotiator: {
    label: "Negotiator",
    keyAttribute: "empathy",
    conceptSkills: ["command", "culture", "manipulation", "observation"],
    conceptTalents: ["languageknowledge", "faction_standing"],
    subConcepts: {
      agitator: {
        label: "Agitator",
        gearKey: "agitator",
        bonusSkills: ["manipulation", "command"]
      },
      diplomat: {
        label: "Diplomat",
        gearKey: "diplomat",
        bonusSkills: ["culture", "manipulation"]
      },
      peddler: {
        label: "Peddler",
        gearKey: "peddler",
        bonusSkills: ["manipulation", "observation"]
      }
    }
  },
  operative: {
    label: "Operative",
    keyAttribute: "agility",
    conceptSkills: ["dexterity", "infiltration", "meleecombat", "rangedcombat"],
    conceptTalents: ["assassinsguild", "zerogtraining"],
    subConcepts: {
      assassin: {
        label: "Assassin",
        gearKey: "assassin",
        bonusSkills: ["infiltration", "meleecombat"]
      },
      guard: {
        label: "Guard",
        gearKey: "guard",
        bonusSkills: ["rangedcombat", "observation"]
      },
      spy: {
        label: "Spy",
        gearKey: "spy",
        bonusSkills: ["infiltration", "manipulation"]
      }
    }
  },
  pilot: {
    label: "Pilot",
    keyAttribute: "agility",
    conceptSkills: ["pilot", "rangedcombat", "datadjinn", "technology"],
    conceptTalents: ["nimble", "toughpilot"],
    subConcepts: {
      driver: {
        label: "Driver",
        gearKey: "driver",
        bonusSkills: ["pilot", "rangedcombat"]
      },
      fighterPilot: {
        label: "Fighter Pilot",
        gearKey: "fighterPilot",
        bonusSkills: ["pilot", "rangedcombat"]
      },
      freighterPilot: {
        label: "Freighter Pilot",
        gearKey: "freighterPilot",
        bonusSkills: ["pilot", "technology"]
      }
    }
  },
  preacher: {
    label: "Preacher",
    keyAttribute: "empathy",
    conceptSkills: ["culture", "manipulation", "mysticpowers", "observation"],
    conceptTalents: ["blessing", "lastrites"],
    subConcepts: {
      ascetic: {
        label: "Ascetic",
        gearKey: "ascetic",
        bonusSkills: ["mysticpowers", "survival"]
      },
      missionary: {
        label: "Missionary",
        gearKey: "missionary",
        bonusSkills: ["culture", "manipulation"]
      },
      prophet: {
        label: "Prophet",
        gearKey: "prophet",
        bonusSkills: ["manipulation", "observation"]
      }
    }
  },
  scientist: {
    label: "Scientist",
    keyAttribute: "wits",
    conceptSkills: ["datadjinn", "medicurgy", "observation", "science"],
    conceptTalents: ["fieldmedicurg", "researcher"],
    subConcepts: {
      archaeologist: {
        label: "Archaeologist",
        gearKey: "archaeologist",
        bonusSkills: ["science", "observation"]
      },
      medicurg: {
        label: "Medicurg",
        gearKey: "medicurg",
        bonusSkills: ["medicurgy", "science"]
      },
      technician: {
        label: "Technician",
        gearKey: "technician",
        bonusSkills: ["technology", "science"]
      }
    }
  },
  shipWorker: {
    label: "Ship Worker",
    keyAttribute: "strength",
    conceptSkills: ["dexterity", "force", "meleecombat", "technology"],
    conceptTalents: ["mechanic", "tough"],
    subConcepts: {
      deckhand: {
        label: "Deckhand",
        gearKey: "deckhand",
        bonusSkills: ["force", "meleecombat"]
      },
      dockWorker: {
        label: "Dock Worker",
        gearKey: "dockWorker",
        bonusSkills: ["force", "technology"]
      },
      engineer: {
        label: "Engineer",
        gearKey: "engineer",
        bonusSkills: ["technology", "datadjinn"]
      }
    }
  },
  soldier: {
    label: "Soldier",
    keyAttribute: "strength",
    conceptSkills: ["force", "meleecombat", "rangedcombat", "survival"],
    conceptTalents: ["combatveteran", "ninelives"],
    subConcepts: {
      legionnaire: {
        label: "Legionnaire",
        gearKey: "legionnaire",
        bonusSkills: ["rangedcombat", "survival"]
      },
      mercenary: {
        label: "Mercenary",
        gearKey: "mercenary",
        bonusSkills: ["rangedcombat", "meleecombat"]
      },
      officer: {
        label: "Officer",
        gearKey: "officer",
        bonusSkills: ["command", "rangedcombat"]
      }
    }
  },
  trailblazer: {
    label: "Trailblazer",
    keyAttribute: "wits",
    conceptSkills: ["observation", "pilot", "science", "survival"],
    conceptTalents: ["catlike", "pointman"],
    subConcepts: {
      colonist: {
        label: "Colonist",
        gearKey: "colonist",
        bonusSkills: ["survival", "science"]
      },
      prospector: {
        label: "Prospector",
        gearKey: "prospector",
        bonusSkills: ["survival", "observation"]
      },
      scout: {
        label: "Scout",
        gearKey: "scout",
        bonusSkills: ["observation", "survival"]
      }
    }
  }
};

/**
 * Attribute point distribution rules.
 */
export const ATTRIBUTE_RULES = {
  totalPoints: 14,
  min: 2,
  max: 5
};

/**
 * Skill point rules. Concept skills get up to conceptMax.
 * Characters also get bonus skill points from upbringing.
 */
export const SKILL_RULES = {
  conceptPoints: 8,
  maxPerSkill: 5,
  conceptMax: 3
};
