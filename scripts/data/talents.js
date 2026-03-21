/**
 * Talent definitions for character generation.
 *
 * Each talent has:
 *  - name: display name
 *  - category: "group", "icon", "general", "humanite", "cybernetic", "bionicsculpt", "mysticalpowers"
 *  - description: short rules text
 *  - groupConcept: (group talents only) which group concept it belongs to
 *
 * These serve as fallback data when compendium packs are not available.
 */

export const TALENTS = {
  // ── Group Concept Talents ──────────────────────────────────
  anoseforbirr: {
    name: "A Nose for Birr",
    category: "group",
    groupConcept: "freeTraders",
    description: "You always find the best deals. When buying or selling goods, you can re-roll one failed die."
  },
  everythingisforsale: {
    name: "Everything is for Sale",
    category: "group",
    groupConcept: "freeTraders",
    description: "You can always find a buyer or seller for any goods, no matter how rare or illegal."
  },
  assault: {
    name: "Assault",
    category: "group",
    groupConcept: "mercenaries",
    description: "When attacking in close combat, you may spend Darkness Points to add +1 to your attack for each point spent."
  },
  charge: {
    name: "Charge",
    category: "group",
    groupConcept: "mercenaries",
    description: "You can charge into close combat from short range. You get +2 to your attack roll when charging."
  },
  camouflage: {
    name: "Camouflage",
    category: "group",
    groupConcept: "agents",
    description: "You blend into your surroundings naturally. +2 to Infiltration when remaining unseen."
  },
  quickdraw: {
    name: "Quickdraw",
    category: "group",
    groupConcept: "agents",
    description: "You can draw a weapon and attack in the same action without penalty."
  },
  trailblazing: {
    name: "Trailblazing",
    category: "group",
    groupConcept: "explorers",
    description: "You can navigate unknown terrain with ease. +2 to Survival checks when navigating."
  },
  quickthinker: {
    name: "Quick Thinker",
    category: "group",
    groupConcept: "explorers",
    description: "You act fast in dangerous situations. +2 to initiative."
  },
  blessing: {
    name: "Blessing",
    category: "group",
    groupConcept: "pilgrims",
    description: "You can bless a person, giving them +1 to their next roll. Costs 1 MP."
  },
  prayerpower: {
    name: "The Power of the Prayer",
    category: "group",
    groupConcept: "pilgrims",
    description: "Your prayers have real power. When you pray for the Icons, you get +1 to the prayer roll."
  },

  // ── Concept Talents ────────────────────────────────────────
  // Artist
  exquisite: {
    name: "Exquisite",
    category: "general",
    description: "Your performances are legendary. When performing art, you can re-roll all failed dice once."
  },
  seductive: {
    name: "Seductive",
    category: "general",
    description: "You have a natural allure. +2 to Manipulation when using seduction."
  },
  // Data Spider
  hacker: {
    name: "Hacker",
    category: "general",
    description: "You can hack computer systems with ease. +2 to Data Djinn when hacking."
  },
  informant: {
    name: "Informant",
    category: "general",
    description: "You always have contacts who can provide information. +2 to Manipulation when gathering intel."
  },
  // Fugitive
  rugged: {
    name: "Rugged",
    category: "general",
    description: "You are toughened by a hard life. +2 to Survival in harsh environments."
  },
  wanted: {
    name: "Wanted",
    category: "general",
    description: "You are used to running. +2 to Infiltration when fleeing or hiding from pursuers."
  },
  // Negotiator
  languageknowledge: {
    name: "Language Knowledge",
    category: "general",
    description: "You speak many languages of the Horizon. You can communicate in any common language."
  },
  faction_standing: {
    name: "Faction Standing",
    category: "general",
    description: "You have standing with a faction. +2 to Manipulation when dealing with that faction."
  },
  // Operative
  assassinsguild: {
    name: "Assassin's Guild",
    category: "general",
    description: "You are trained by the Assassin's Guild. +2 to damage when attacking an unaware target."
  },
  zerogtraining: {
    name: "Zero-G Training",
    category: "general",
    description: "You are trained for zero gravity. No penalties in zero-G environments."
  },
  // Pilot
  nimble: {
    name: "Nimble",
    category: "general",
    description: "You are quick and agile. +2 to Pilot when performing evasive maneuvers."
  },
  toughpilot: {
    name: "Zero-G Tough",
    category: "general",
    description: "You can withstand extreme G-forces. +2 to Force when resisting G-force effects."
  },
  // Preacher
  lastrites: {
    name: "Last Rites",
    category: "general",
    description: "You can perform the last rites, bringing peace to the dying. The dying person recovers 1 MP."
  },
  // Scientist
  fieldmedicurg: {
    name: "Field Medicurg",
    category: "general",
    description: "You can treat injuries in the field. +2 to Medicurgy when treating wounds outside a medical facility."
  },
  researcher: {
    name: "Researcher",
    category: "general",
    description: "You are skilled at research. +2 to Science when researching in a library or database."
  },
  // Ship Worker
  mechanic: {
    name: "Mechanic",
    category: "general",
    description: "You can fix almost anything. +2 to Technology when repairing machines and vehicles."
  },
  tough: {
    name: "Tough",
    category: "general",
    description: "You are physically resilient. You can ignore the effects of one critical injury."
  },
  // Soldier
  combatveteran: {
    name: "Combat Veteran",
    category: "general",
    description: "You have seen much combat. You can re-roll one die when making a combat-related skill check."
  },
  ninelives: {
    name: "Nine Lives",
    category: "general",
    description: "You seem impossible to kill. Once per session, when you would be killed, you survive with 1 HP instead."
  },
  // Trailblazer
  catlike: {
    name: "Cat-Like",
    category: "general",
    description: "You always land on your feet. +2 to Dexterity when performing acrobatic feats."
  },
  pointman: {
    name: "Point Man",
    category: "general",
    description: "You are always alert. +2 to Observation when scouting ahead."
  },

  // ── General Talents ────────────────────────────────────────
  defensive: {
    name: "Defensive",
    category: "general",
    description: "You are skilled at defending yourself. +2 to armor rating when actively defending."
  },
  executioner: {
    name: "Executioner",
    category: "general",
    description: "You are a ruthless killer. +1 damage with melee weapons."
  },
  intimidating: {
    name: "Intimidating",
    category: "general",
    description: "Your presence is frightening. +2 to Manipulation when using intimidation."
  },
  thirdeye: {
    name: "Third Eye",
    category: "general",
    description: "You have an uncanny awareness. You can sense mystical phenomena within short range."
  },
  judgeofcharacter: {
    name: "Judge of Character",
    category: "general",
    description: "You can read people easily. +2 to Observation when trying to read someone's intentions."
  },

  // ── Icon Talents ───────────────────────────────────────────
  iconladyoftears: {
    name: "Icon Talent: Lady of Tears",
    category: "icon",
    description: "Once per session, you may invoke the Lady of Tears to heal 2 MP for yourself or an ally."
  },
  icondancer: {
    name: "Icon Talent: The Dancer",
    category: "icon",
    description: "Once per session, you may invoke the Dancer to gain +3 to a Dexterity check."
  },
  icongambler: {
    name: "Icon Talent: The Gambler",
    category: "icon",
    description: "Once per session, you may invoke the Gambler to re-roll all dice for one check."
  },
  iconmerchant: {
    name: "Icon Talent: The Merchant",
    category: "icon",
    description: "Once per session, you may invoke the Merchant to get a favorable price on any transaction."
  },
  icondeckhand: {
    name: "Icon Talent: The Deckhand",
    category: "icon",
    description: "Once per session, you may invoke the Deckhand to automatically succeed on a Technology check."
  },
  icontraveler: {
    name: "Icon Talent: The Traveler",
    category: "icon",
    description: "Once per session, you may invoke the Traveler to find passage or safe haven."
  },
  iconmessenger: {
    name: "Icon Talent: The Messenger",
    category: "icon",
    description: "Once per session, you may invoke the Messenger to deliver or receive a crucial message."
  },
  iconjudge: {
    name: "Icon Talent: The Judge",
    category: "icon",
    description: "Once per session, you may invoke the Judge to compel someone to speak the truth."
  },
  iconfaceless: {
    name: "Icon Talent: The Faceless One",
    category: "icon",
    description: "Once per session, you may invoke the Faceless One to go unnoticed by everyone present."
  },
  iconexecutioner: {
    name: "Icon Talent: The Executioner",
    category: "icon",
    description: "Once per session, you may invoke the Executioner to deal maximum damage on an attack."
  },
  icondraconite: {
    name: "Icon Talent: The Draconite",
    category: "icon",
    description: "Once per session, you may invoke the Draconite to resist a mystical power or effect."
  },
  iconahlam: {
    name: "Icon Talent: Ahlam's Beloved",
    category: "icon",
    description: "Once per session, you may invoke Ahlam to gain +3 to a Manipulation check."
  },
  icondreamer: {
    name: "Icon Talent: The Dreamer",
    category: "icon",
    description: "Once per session, you may invoke the Dreamer to receive a prophetic vision or hint from the GM."
  },
  iconmartyr: {
    name: "Icon Talent: The Martyr",
    category: "icon",
    description: "Once per session, you may invoke the Martyr to absorb damage meant for an ally."
  },
  iconguardian: {
    name: "Icon Talent: The Guardian",
    category: "icon",
    description: "Once per session, you may invoke the Guardian to protect an ally from all damage for one round."
  },
  iconseekers: {
    name: "Icon Talent: The Seekers",
    category: "icon",
    description: "Once per session, you may invoke the Seekers to locate a hidden or lost object."
  },

  // ── Humanite Talents ───────────────────────────────────────
  humanitepheromones: {
    name: "Pheromones",
    category: "humanite",
    description: "You exude pheromones that make people more receptive to you. +2 to Manipulation."
  },
  humaniteresistant: {
    name: "Resistant",
    category: "humanite",
    description: "Your humanite body is resistant to environmental hazards. +2 to Survival against toxins and radiation."
  },
  humanitenightvision: {
    name: "Night Vision",
    category: "humanite",
    description: "You can see in near-total darkness. No penalties for darkness."
  },
  humaniteregenerative: {
    name: "Regenerative",
    category: "humanite",
    description: "You heal faster than normal humans. Recover 1 extra HP per day of rest."
  },
  humaniteaquatic: {
    name: "Aquatic",
    category: "humanite",
    description: "You can breathe underwater and swim at normal movement speed."
  },

  // ── Cybernetic Talents ─────────────────────────────────────
  cyberneticacceleratedreflexes: {
    name: "Accelerated Reflexes",
    category: "cybernetic",
    description: "Cybernetic reflex boosters. +2 to initiative."
  },
  cyberneticbodyarmor: {
    name: "Body Armor",
    category: "cybernetic",
    description: "Sub-dermal armor plating. +2 to armor rating."
  },
  cyberneticenhancedsenses: {
    name: "Enhanced Senses",
    category: "cybernetic",
    description: "Cybernetic sensory enhancement. +2 to Observation."
  },
  cyberneticmuscleaugmentation: {
    name: "Muscle Augmentation",
    category: "cybernetic",
    description: "Cybernetic muscle fibers. +2 to Force."
  },
  cyberneticneurallink: {
    name: "Neural Link",
    category: "cybernetic",
    description: "Direct neural interface with computer systems. +2 to Data Djinn."
  },
  cyberneticservoarms: {
    name: "Servo Arms",
    category: "cybernetic",
    description: "Cybernetic servo arms. +2 to Technology when repairing or building."
  },

  // ── Mystic Power Talents ───────────────────────────────────
  mysticalclairvoyant: {
    name: "Clairvoyant",
    category: "mysticalpowers",
    description: "You can see distant places and events by entering a meditative trance."
  },
  mysticaltelekinesis: {
    name: "Telekinesis",
    category: "mysticalpowers",
    description: "You can move objects with your mind."
  },
  mysticaltelepathy: {
    name: "Telepathy",
    category: "mysticalpowers",
    description: "You can read surface thoughts and communicate mentally."
  },
  mysticalpremonition: {
    name: "Premonition",
    category: "mysticalpowers",
    description: "You receive visions of the near future, granting advantage in dangerous situations."
  },
  mysticalmindwalker: {
    name: "Mind Walker",
    category: "mysticalpowers",
    description: "You can enter another person's mind and experience their memories."
  }
};

/**
 * Icon talent key lookup by icon key.
 */
export const ICON_TALENT_MAP = {
  ladyoftears: "iconladyoftears",
  dancer: "icondancer",
  gambler: "icongambler",
  merchant: "iconmerchant",
  deckhand: "icondeckhand",
  traveler: "icontraveler",
  messenger: "iconmessenger",
  judge: "iconjudge",
  faceless: "iconfaceless",
  executioner: "iconexecutioner",
  draconite: "icondraconite",
  ahlam: "iconahlam",
  dreamer: "icondreamer",
  martyr: "iconmartyr",
  guardian: "iconguardian",
  seekers: "iconseekers"
};
