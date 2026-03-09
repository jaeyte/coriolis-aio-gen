/**
 * Mission/Quest data for the Coriolis AIO Generator.
 *
 * Each mission template defines an objective, a complication, a patron
 * archetype, potential antagonist types, linked encounter/ship encounter
 * templates, and a reward tier.
 */

// ── Mission Templates ─────────────────────────────────────────

export const MISSION_TEMPLATES = {
  cargoRun: {
    label: "Cargo Run",
    description: "Transport sensitive cargo from one system to another before the deadline. Simple — until someone decides they want it.",
    objective: "Deliver the cargo to the destination intact and on time.",
    environment: "ship",
    patronArchetypes: ["merchant", "smuggler", "bureaucrat"],
    antagonistArchetypes: ["crimeBoss", "smuggler"],
    linkedEncounters: ["pirateAmbush", "barFight"],
    linkedShipEncounters: ["pirateAmbush", "smugglerChase"],
    rewardTier: "standard",
    rewardBonus: 0
  },
  bountyHunt: {
    label: "Bounty Hunt",
    description: "A target needs to be found and brought in — alive or dead. The crew must track them through the stations and shadows of the Third Horizon.",
    objective: "Locate and apprehend (or eliminate) the target.",
    environment: "station",
    patronArchetypes: ["factionLeader", "crimeBoss", "bureaucrat"],
    antagonistArchetypes: ["smuggler", "crimeBoss", "informant"],
    linkedEncounters: ["assassinStrike", "barFight", "mercenarySquad"],
    linkedShipEncounters: ["smugglerChase"],
    rewardTier: "advanced",
    rewardBonus: 0.2
  },
  factionDiplomacy: {
    label: "Faction Diplomacy",
    description: "Serve as intermediaries between two factions on the brink of conflict. Betrayal lurks behind every polite smile.",
    objective: "Broker a deal or alliance between the two parties without bloodshed.",
    environment: "station",
    patronArchetypes: ["factionLeader", "bureaucrat", "merchant"],
    antagonistArchetypes: ["factionLeader", "informant"],
    linkedEncounters: ["consortiumRaid", "assassinStrike"],
    linkedShipEncounters: ["factionBlockade"],
    rewardTier: "advanced",
    rewardBonus: 0.3
  },
  artifactRecovery: {
    label: "Artifact Recovery",
    description: "Venture into ancient ruins to retrieve a relic of the Portal Builders — or something older and darker.",
    objective: "Find and extract the artifact from the ruins.",
    environment: "ruins",
    patronArchetypes: ["scholar", "mystic", "factionLeader"],
    antagonistArchetypes: ["mystic", "scholar", "crimeBoss"],
    linkedEncounters: ["cultistAmbush", "darkRitual", "darkboundAttack"],
    linkedShipEncounters: ["ghostShip", "unknownContact"],
    rewardTier: "elite",
    rewardBonus: 0.4
  },
  smugglersRun: {
    label: "Smuggler's Run",
    description: "Move illegal goods past a blockade or customs checkpoint. The pay is good — the risk is higher.",
    objective: "Deliver the contraband without getting caught.",
    environment: "ship",
    patronArchetypes: ["smuggler", "crimeBoss", "merchant"],
    antagonistArchetypes: ["bureaucrat", "factionLeader"],
    linkedEncounters: ["legionCheckpoint", "consortiumRaid"],
    linkedShipEncounters: ["legionIntercept", "factionBlockade"],
    rewardTier: "standard",
    rewardBonus: 0.3
  },
  pilgrimEscort: {
    label: "Pilgrim Escort",
    description: "Protect a group of pilgrims on their sacred journey to a distant shrine. The Dark between the Stars has other plans.",
    objective: "Escort the pilgrims safely to their destination.",
    environment: "any",
    patronArchetypes: ["pilgrim", "mystic"],
    antagonistArchetypes: ["crimeBoss", "mystic"],
    linkedEncounters: ["cultistAmbush", "darkboundAttack", "wildHunt"],
    linkedShipEncounters: ["pirateAmbush", "ghostShip"],
    rewardTier: "standard",
    rewardBonus: 0
  },
  stationIntrigue: {
    label: "Station Intrigue",
    description: "Someone on the station is pulling strings, and the crew has been hired to find out who — and why.",
    objective: "Uncover the conspiracy and neutralize the threat.",
    environment: "station",
    patronArchetypes: ["informant", "bureaucrat", "factionLeader"],
    antagonistArchetypes: ["crimeBoss", "informant", "factionLeader"],
    linkedEncounters: ["assassinStrike", "securityAlert", "consortiumRaid"],
    linkedShipEncounters: [],
    rewardTier: "advanced",
    rewardBonus: 0.2
  },
  rescueMission: {
    label: "Rescue Mission",
    description: "Someone important has been taken — kidnapped, imprisoned, or stranded. Time is running out.",
    objective: "Find and extract the captive before it's too late.",
    environment: "any",
    patronArchetypes: ["factionLeader", "merchant", "pilgrim"],
    antagonistArchetypes: ["crimeBoss", "smuggler"],
    linkedEncounters: ["pirateAmbush", "mercenarySquad", "securityAlert"],
    linkedShipEncounters: ["pirateAmbush", "mercenaryAmbush"],
    rewardTier: "advanced",
    rewardBonus: 0.1
  },
  derelictSalvage: {
    label: "Derelict Salvage",
    description: "A drifting wreck has been located — its cargo is valuable, but so is whatever killed its crew.",
    objective: "Board the derelict, salvage the cargo, and survive.",
    environment: "ship",
    patronArchetypes: ["merchant", "technician", "smuggler"],
    antagonistArchetypes: ["mystic", "crimeBoss"],
    linkedEncounters: ["darkboundAttack", "verminInfestation"],
    linkedShipEncounters: ["ghostShip", "unknownContact"],
    rewardTier: "advanced",
    rewardBonus: 0.3
  },
  darkInvestigation: {
    label: "Dark Investigation",
    description: "Strange events plague a station or settlement. Disappearances, whispers in the dark, dreams of the void. Something from the Dark between the Stars is at work.",
    objective: "Investigate the disturbances and end the threat.",
    environment: "any",
    patronArchetypes: ["mystic", "scholar", "factionLeader"],
    antagonistArchetypes: ["mystic"],
    linkedEncounters: ["darkRitual", "djinnEncounter", "cultistAmbush"],
    linkedShipEncounters: ["ghostShip"],
    rewardTier: "elite",
    rewardBonus: 0.3
  }
};

// ── Complications ──────────────────────────────────────────────
// Randomly applied twists that make missions more interesting.

export const MISSION_COMPLICATIONS = [
  "The patron is lying about the true objective.",
  "A rival crew is after the same target.",
  "The antagonist is a former ally or family member of a crew member.",
  "The cargo / artifact is cursed or emits dark energy.",
  "There's a mole among the crew's contacts feeding information to the enemy.",
  "The destination is under quarantine — no ships allowed in or out.",
  "The payment is in a currency or favor that's hard to collect.",
  "Local authorities are already investigating and won't welcome interference.",
  "The patron has a hidden agenda that conflicts with the crew's morals.",
  "A third faction intervenes halfway through with their own demands.",
  "The mission must be completed before a portal closes — time limit.",
  "The target / artifact is not what it appears to be.",
  "An old enemy of the crew shows up at the worst possible moment.",
  "The rendezvous point has been compromised.",
  "The Icons send cryptic visions that complicate decision-making.",
  "Environmental hazard: radiation leak, hull breach, or atmospheric storm.",
  "The antagonist offers a counter-deal that's tempting.",
  "Key information was wrong — the crew arrives underprepared.",
  "A crew member's personal problem intersects with the mission.",
  "The reward is significantly larger than expected — which means the danger is too."
];

// ── Locations ──────────────────────────────────────────────────
// Specific location flavor for mission briefings.

export const MISSION_LOCATIONS = {
  station: [
    "Coriolis Station, the heart of the Third Horizon",
    "a bustling trade bazaar on Dabaran's orbital",
    "a dimly-lit docking bay on the Algol fringe",
    "a restricted zone aboard a Consortium station",
    "a Nomad flotilla drifting between portals",
    "a crumbling station in the Kua asteroid belt"
  ],
  ship: [
    "deep space between portals",
    "the shipping lanes near Mira",
    "a debris field from an ancient battle",
    "the shadow of a gas giant's rings",
    "a contested trade route through Sadaal space",
    "the void near an unstable portal"
  ],
  ruins: [
    "a Portal Builder ruin on a barren moon",
    "an abandoned temple beneath Kua's jungles",
    "a sealed vault in the ice wastes of Zalos",
    "a derelict Firstcome research facility",
    "a crumbling tomb-complex under the sands of Dabaran",
    "a forgotten station in a dead system"
  ],
  wilderness: [
    "the dense jungles of Kua",
    "a frozen wasteland on Zalos",
    "the red deserts of Dabaran",
    "a volcanic island chain on a frontier world",
    "a toxic swamp on a barely-terraformed moon"
  ],
  any: [
    "somewhere in the Third Horizon",
    "a location known only to the patron",
    "coordinates encrypted in a data chip"
  ]
};

// ── Reward descriptions ────────────────────────────────────────

export const MISSION_REWARD_TIERS = {
  basic:    { label: "Modest",     birrRange: [500, 1500],  description: "Barely worth the fuel costs, but work is work." },
  standard: { label: "Fair",       birrRange: [1500, 5000], description: "Decent pay for decent work. Standard contract rates." },
  advanced: { label: "Lucrative",  birrRange: [5000, 15000], description: "Serious money — someone wants this done right." },
  elite:    { label: "Fortune",    birrRange: [15000, 50000], description: "Life-changing birr. The kind of job legends are made of." }
};
