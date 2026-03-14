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
    description: "A trader hawking wares in a bazaar or negotiating bulk contracts.",
    weapons: ["vulcanCricket"],
    gear: ["communicator", "computerTablet"],
    talents: ["languageknowledge", "judgeofcharacter"]
  },
  informant: {
    label: "Informant",
    keyAttribute: "wits",
    keySkills: ["infiltration", "observation", "manipulation"],
    description: "Someone with ears everywhere and information for sale.",
    weapons: ["vulcanCricket", "knife"],
    gear: ["communicator", "lockPicks"],
    talents: ["informant", "camouflage"]
  },
  bureaucrat: {
    label: "Bureaucrat",
    keyAttribute: "empathy",
    keySkills: ["manipulation", "culture", "command"],
    description: "A functionary who controls access to permits, docking rights, or restricted zones.",
    weapons: [],
    gear: ["communicator", "computerTablet"],
    talents: ["faction_standing", "languageknowledge"]
  },
  crimeBoss: {
    label: "Crime Boss",
    keyAttribute: "empathy",
    keySkills: ["command", "manipulation", "rangedcombat"],
    description: "A shadowy figure who runs the local underworld with charm and violence.",
    weapons: ["vulcanPistol", "knife"],
    armor: "lightVest",
    gear: ["communicator", "tabak"],
    talents: ["intimidating", "quickdraw"]
  },
  mystic: {
    label: "Mystic",
    keyAttribute: "wits",
    keySkills: ["mysticpowers", "observation", "culture"],
    mysticPowers: true,
    description: "A seer, healer, or hermit touched by the Icons — or something darker.",
    weapons: ["staff"],
    gear: ["prayerBeads", "incense"],
    talents: ["thirdeye"]
  },
  scholar: {
    label: "Scholar",
    keyAttribute: "wits",
    keySkills: ["science", "culture", "datadjinn"],
    description: "An academic researching ancient texts, xenobiology, or portal mechanics.",
    weapons: [],
    gear: ["communicator", "computerTablet"],
    talents: ["researcher", "hacker"]
  },
  factionLeader: {
    label: "Faction Leader",
    keyAttribute: "empathy",
    keySkills: ["command", "manipulation", "observation"],
    description: "A charismatic or ruthless figure at the head of a local faction cell.",
    weapons: ["vulcanPistol", "knife"],
    armor: "lightVest",
    gear: ["communicator"],
    talents: ["intimidating", "combatveteran"]
  },
  technician: {
    label: "Technician",
    keyAttribute: "wits",
    keySkills: ["technology", "science", "dexterity"],
    description: "A skilled mechanic, engineer, or shipwright who can fix or build anything.",
    weapons: ["knife"],
    gear: ["communicator", "medkit"],
    talents: ["mechanic", "fieldmedicurg"]
  },
  smuggler: {
    label: "Smuggler",
    keyAttribute: "agility",
    keySkills: ["pilot", "infiltration", "manipulation"],
    description: "A daring courier who moves contraband past customs and blockades.",
    weapons: ["vulcanPistol", "knife"],
    armor: "lightVest",
    gear: ["communicator", "lockPicks"],
    talents: ["quickdraw", "rugged"]
  },
  pilgrim: {
    label: "Pilgrim",
    keyAttribute: "empathy",
    keySkills: ["culture", "survival", "medicurgy"],
    description: "A devout traveler on a sacred journey across the Third Horizon.",
    weapons: ["staff"],
    gear: ["prayerBeads", "medkit"],
    talents: ["blessing", "lastrites"]
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

// ── Physical Descriptors ───────────────────────────────────

export const PHYSICAL_BUILDS = [
  "Tall and lean",
  "Short and stocky",
  "Broad-shouldered and muscular",
  "Wiry and nimble",
  "Average build, unremarkable frame",
  "Heavyset and imposing",
  "Slender and graceful",
  "Compact and athletic",
  "Gaunt and hollow-cheeked",
  "Lanky with long limbs"
];

export const AGE_RANGES = [
  "Young, barely into adulthood",
  "In their mid-twenties",
  "Early thirties, in their prime",
  "Middle-aged, lines of experience on their face",
  "Weathered, somewhere past fifty",
  "Elderly but sharp-eyed",
  "Ageless — hard to pin down exactly"
];

export const DISTINGUISHING_FEATURES = [
  "A prominent scar across the left cheek",
  "Striking heterochromatic eyes",
  "A cybernetic implant visible at the temple",
  "Ritual tattoos along the jawline",
  "A crooked nose, broken and reset more than once",
  "Unusually pale skin, almost translucent",
  "Dark skin weathered by solar radiation",
  "A missing finger on the right hand",
  "A shaved head with intricate Icon markings",
  "Deep-set eyes that seem to see too much",
  "An ornate earring dangling from one ear",
  "Calloused hands that speak of hard labor",
  "A serene, almost unsettling calm to their expression",
  "A burn mark on the back of their neck",
  "Bright, alert eyes constantly scanning the surroundings"
];
