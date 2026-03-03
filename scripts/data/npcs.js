/**
 * Quick NPC data for narrative NPC generation.
 *
 * Archetypes define the NPC's role and base stat bias.
 * Personality traits, motivations, quirks, and factions add flavor.
 */

// ── Archetypes ──────────────────────────────────────────────

export const NPC_ARCHETYPES = {
  merchant: {
    label: "Merchant",
    keyAttribute: "empathy",
    keySkills: ["manipulation", "culture", "observation"],
    description: "A trader hawking wares in a bazaar or negotiating bulk contracts."
  },
  informant: {
    label: "Informant",
    keyAttribute: "wits",
    keySkills: ["infiltration", "observation", "manipulation"],
    description: "Someone with ears everywhere and information for sale."
  },
  bureaucrat: {
    label: "Bureaucrat",
    keyAttribute: "empathy",
    keySkills: ["manipulation", "culture", "command"],
    description: "A functionary who controls access to permits, docking rights, or restricted zones."
  },
  crimeBoss: {
    label: "Crime Boss",
    keyAttribute: "empathy",
    keySkills: ["command", "manipulation", "rangedcombat"],
    description: "A shadowy figure who runs the local underworld with charm and violence."
  },
  mystic: {
    label: "Mystic",
    keyAttribute: "wits",
    keySkills: ["mysticpowers", "observation", "culture"],
    description: "A seer, healer, or hermit touched by the Icons — or something darker."
  },
  scholar: {
    label: "Scholar",
    keyAttribute: "wits",
    keySkills: ["science", "culture", "datadjinn"],
    description: "An academic researching ancient texts, xenobiology, or portal mechanics."
  },
  factionLeader: {
    label: "Faction Leader",
    keyAttribute: "empathy",
    keySkills: ["command", "manipulation", "observation"],
    description: "A charismatic or ruthless figure at the head of a local faction cell."
  },
  technician: {
    label: "Technician",
    keyAttribute: "wits",
    keySkills: ["technology", "science", "dexterity"],
    description: "A skilled mechanic, engineer, or shipwright who can fix or build anything."
  },
  smuggler: {
    label: "Smuggler",
    keyAttribute: "agility",
    keySkills: ["pilot", "infiltration", "manipulation"],
    description: "A daring courier who moves contraband past customs and blockades."
  },
  pilgrim: {
    label: "Pilgrim",
    keyAttribute: "empathy",
    keySkills: ["culture", "survival", "medicurgy"],
    description: "A devout traveler on a sacred journey across the Third Horizon."
  }
};

// ── Factions ────────────────────────────────────────────────

export const NPC_FACTIONS = {
  consortium:    { label: "The Consortium" },
  legion:        { label: "The Legion" },
  church:        { label: "The Church of the Icons" },
  syndicate:     { label: "The Syndicate" },
  nomads:        { label: "Nomad Federation" },
  draconites:    { label: "The Draconites" },
  temple:        { label: "Ahlam's Temple" },
  freeLeague:    { label: "The Free League" },
  hegemony:      { label: "Zenithian Hegemony" },
  independent:   { label: "Independent" }
};

// ── Personality Traits ──────────────────────────────────────

export const PERSONALITY_TRAITS = [
  "Cautious and calculating",
  "Jovial and loud",
  "Paranoid and suspicious",
  "Devout and pious",
  "Cynical and world-weary",
  "Generous to a fault",
  "Cold and detached",
  "Impulsive and reckless",
  "Sly and evasive",
  "Warm and maternal/paternal",
  "Obsessively tidy",
  "Perpetually nervous",
  "Quietly confident",
  "Brash and confrontational",
  "Melancholic and poetic",
  "Shrewd and pragmatic",
  "Idealistic and naive",
  "Sardonic and dry",
  "Humble and self-deprecating",
  "Fiercely loyal"
];

// ── Motivations ─────────────────────────────────────────────

export const MOTIVATIONS = [
  "Seeking revenge for a past betrayal",
  "Protecting their family at any cost",
  "Paying off a crippling debt",
  "Searching for a missing loved one",
  "Atoning for past sins",
  "Climbing to the top of the faction hierarchy",
  "Uncovering a dangerous secret",
  "Escaping their former life",
  "Fulfilling a sacred vow to the Icons",
  "Hoarding wealth for an uncertain future",
  "Pursuing forbidden knowledge",
  "Building a better life in a new system",
  "Proving themselves worthy of respect",
  "Serving a cause greater than themselves",
  "Surviving one more day in a hostile universe"
];

// ── Quirks ──────────────────────────────────────────────────

export const QUIRKS = [
  "Speaks in the third person",
  "Never makes direct eye contact",
  "Constantly chews tabak",
  "Hums an unfamiliar melody when nervous",
  "Has a prosthetic hand that clicks when gripping",
  "Wears an outdated environmental suit everywhere",
  "Collects small trinkets from every system visited",
  "Quotes the Icons in casual conversation",
  "Has a distinctive facial scar",
  "Insists on shaking hands with the left hand",
  "Carries an ancient paper book at all times",
  "Laughs at inappropriate moments",
  "Whispers when angry instead of shouting",
  "Refuses to eat food prepared by others",
  "Has a nervous habit of counting things aloud",
  "Wears prayer beads wrapped around their wrist",
  "Always stands with their back to the wall",
  "Smells faintly of engine grease and incense",
  "Has a pet — a small, iridescent lizard from Kua",
  "Speaks with a thick Dabaran accent"
];
