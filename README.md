# Coriolis AIO Generator

A Foundry VTT v13 module for **Coriolis: The Third Horizon** (`yzecoriolis`) that provides eight generators in a single tabbed dialog — characters, encounters, ships, ship encounters, parties, NPCs, AI-powered NPCs, and missions.

## Features at a Glance

| Generator | Output | Key Details |
|---|---|---|
| **Character** | Actor (character/NPC) | 11 concepts, 33 sub-concepts, full attributes/skills/talents/gear |
| **Encounter** | Enemy actors + loot journal | 16 templates, 20 enemy types, 4 difficulty tiers, XP scaling |
| **Ship** | Ship actor with modules | 9 ship classes, 18+ modules, functional weapons with damage/range/crit |
| **Ship Encounter** | Enemy ship + crew actors | 10 enemy ships, 9 templates, salvage loot, boarding party linking |
| **Party** | 3–6 characters in a folder | Crew position assignment via concept affinity matching |
| **Quick NPC** | Actor or journal entry | 10 archetypes, 10 factions, personality/motivation/quirk, gear loadouts, mystic powers |
| **AI NPC** | Full NPC actor | Free-text prompt to complete actor via LLM (Groq, Gemini, OpenRouter, or Anthropic) |
| **Mission** | Journal briefing + NPCs | 10 templates, patron/antagonist NPCs, linked encounters, reward scaling |

## Getting Started

1. Install the module (see [Installation](#installation))
2. Enable it in your world's Module Management
3. Click the **AIO Generator** button in the **Actors** sidebar header to open the generator
4. Pick a tab, configure options, and click **Generate**

The generator can also be opened from a script macro: `game.modules.get("coriolis-aio-gen").api.openDialog()`.

For the **AI NPC** tab, configure an API key in **Module Settings > Coriolis AIO Generator** first.

---

## Character Generator

Creates complete, rulebook-compliant characters:

- **14 attribute points** distributed across Strength, Agility, Wits, Empathy (min 2, max 5), weighted by concept
- **Concept + upbringing skill points** assigned to appropriate skills
- **Starting talent** from the concept talent pool, plus **Icon talent** and **group concept talent**
- **Starting gear** (weapons, armor, equipment) embedded as items based on sub-concept
- Randomly generated **name**, **personal problem**, **appearance**, and **background**

### 11 Concepts with 33 Sub-Concepts

| Concept | Sub-Concepts |
|---|---|
| Artist | Courtesan, Musician, Poet |
| Data Spider | Analyst, Correspondent, Data Djinn |
| Fugitive | Criminal, Mystic, Revolutionary |
| Negotiator | Agitator, Diplomat, Peddler |
| Operative | Assassin, Guard, Spy |
| Pilot | Driver, Fighter Pilot, Freighter Pilot |
| Preacher | Ascetic, Missionary, Prophet |
| Scientist | Archaeologist, Medicurg, Technician |
| Ship Worker | Deckhand, Dock Worker, Engineer |
| Soldier | Legionnaire, Mercenary, Officer |
| Trailblazer | Colonist, Prospector, Scout |

### Backgrounds

- 10 origins, 3 upbringings (Plebeian/Stationary/Privileged), 16 Icons
- 5 group concepts (Free Traders, Mercenaries, Agents, Explorers, Pilgrims)
- 70+ talents (concept, group, icon, general, humanite, cybernetic, mystic)
- Arabic/Persian-inspired name generator with 110+ first names and 60+ family names

---

## Encounter Generator

Creates scaled combat encounters with enemy actors and loot:

- **16 encounter templates** — Bar Fight, Pirate Ambush, Legion Checkpoint, Consortium Raid, Assassin Strike, Dark Ritual, Djinn Encounter, and more
- **20 enemy types** across 9 factions (criminals, Legion, Consortium, cultists, beasts, darkbound)
- **4 threat categories** — Minion (60% HP), Regular (100%), Elite (140%), Boss (200%)
- **Difficulty scaling** — Easy/Normal/Hard/Deadly affects stats, enemy count, and loot
- **XP scaling** — enemy stats scale with party experience (Novice through Legendary)
- **Loot generation** — tiered loot journal with birr, weapons, armor, gear, and valuables
- **Ship encounter linking** — optionally auto-generate a linked ship encounter for pirate templates

---

## Ship Generator

Creates ship actors with functional modules and weapons:

- **9 ship classes** — Light Freighter, Courier, Patrol Boat, Bulk Hauler, Armed Merchant, Exploration Vessel, Warship, Luxury Yacht, Colony Ship
- **18+ ship modules** including 6 weapon types with full combat stats (damage, range, crit, bonus)
- Stats rolled from class ranges: hull points, armor, speed, maneuverability, signature
- Optional **ship quirk/problem** for narrative flavor
- Crew positions, module slots, and energy points all set correctly

### Weapon Modules

| Weapon | Damage | Range | Crit | Bonus |
|---|---|---|---|---|
| Turret | 3 | Medium | 3 | +1 |
| Torpedo Launcher | 6 | Long | 2 | 0 |
| Autocannon | 2 | Short | 3 | +2 |
| Point Defense | 1 | Short | 0 | +3 |
| Heavy Cannon | 5 | Long | 1 | -1 |
| Mining Laser | 3 | Short | 2 | +1 |

---

## Ship Encounter Generator

Creates space combat encounters with enemy ships and crew:

- **10 enemy ship templates** — Pirate Skiff, Corsair Flagship, Legion Cutter, Smuggler Runner, Darkbound Hulk, and more
- **9 encounter templates** — Pirate Ambush, Corsair Fleet, Legion Intercept, Mercenary Ambush, Ghost Ship, and more
- **4 ship categories** — Fodder (0.7x hull), Standard (1.0x), Heavy (1.3x), Flagship (1.6x)
- **Key crew NPCs** generated per ship with weapons, armor, gear, and talents (captain, pilot, gunner, engineer, etc.)
- **Salvage loot** journal generation from defeated ships
- **Boarding party linking** — auto-generate a linked personal combat encounter

---

## Party Generator

Creates a complementary group of 3–6 characters:

- Each character gets a **unique concept** (unless duplicates are allowed)
- **Crew positions** assigned via greedy affinity matching (e.g., Pilot concept → pilot position)
- Shared **group concept** for the whole party
- Characters grouped in a **Foundry folder** for organization

---

## Quick NPC Generator

Creates narrative NPCs as actors or journal entries:

- **10 archetypes** — Merchant, Informant, Bureaucrat, Crime Boss, Mystic, Scholar, Faction Leader, Technician, Smuggler, Pilgrim
- **10 factions** — Consortium, Legion, Church, Syndicate, Nomad Federation, Draconites, Ahlam's Temple, Free League, Zenithian Hegemony, Independent
- **20 personality traits**, **15 motivations**, **20 quirks** for rich characterization
- **Gear loadouts** per archetype — weapons, armor, and equipment resolved from compendiums
- **Mystic powers** — qualifying archetypes (Mystic) receive 1–2 random mystic power talents from the compendium
- Actor output includes simplified attributes/skills; journal output provides a narrative description

---

## AI NPC Generator

Creates complete NPC actors from a free-text description using an LLM:

- Describe any NPC in plain language and the AI generates a full actor with attributes, skills, talents, gear, and narrative background
- **Stats validation** — attributes are clamped to 2–5 (total 14), skills to 0–5, following Coriolis rules
- **Compendium enrichment** — AI-generated items are matched against installed compendiums for proper icons and data
- **Mystic powers** supported for supernatural NPCs

### Supported Providers

| Provider | Cost | Default Model |
|---|---|---|
| **Groq** | Free tier (30 RPM, 14,400 RPD) | `llama-3.3-70b-versatile` |
| **Google Gemini** | Free tier (10 RPM, 250 RPD) | `gemini-2.5-flash` |
| **OpenRouter** | Free models available | `google/gemini-2.5-flash:free` |
| **Anthropic** | Paid | `claude-sonnet-4-6` |

### Setup

1. Go to **Module Settings > Coriolis AIO Generator**
2. Select your **AI Provider** (Groq is the default)
3. Enter your **API Key**:
   - Groq: [console.groq.com](https://console.groq.com)
   - Gemini: [aistudio.google.com/apikey](https://aistudio.google.com/apikey)
   - OpenRouter: [openrouter.ai/keys](https://openrouter.ai/keys)
   - Anthropic: [console.anthropic.com](https://console.anthropic.com)

---

## Mission Generator

Creates complete mission briefings with linked content:

- **10 mission templates** — Cargo Run, Bounty Hunt, Faction Diplomacy, Artifact Recovery, Smuggler's Run, Pilgrim Escort, Station Intrigue, Rescue Mission, Derelict Salvage, Dark Investigation
- **20 random complications** that twist the mission (betrayals, time limits, rival crews, cursed cargo)
- **Patron NPC** auto-generated from the mission's faction
- **Antagonist NPC** auto-generated from a rival faction
- **Linked combat encounter** — optionally create enemies appropriate to the mission
- **Linked ship encounter** — optionally create a space combat scenario
- **Reward scaling** by tier: Modest (500–1,500 birr) through Fortune (15,000–50,000 birr)
- Location flavor drawn from the mission's environment (station, ship, ruins, wilderness)

---

## Compendium-First Resolution

When the premium **Coriolis Core Rulebook** module (`coriolis-corerules`) is installed, all generators automatically pull talent and item data from its compendium packs for richer descriptions and proper icons. Without it, the module falls back to built-in data.

Resolution priority:
1. `coriolis-corerules` compendium packs (premium module)
2. World-level compendiums
3. Built-in module data

---

## Installation

### Via Manifest URL

1. In Foundry VTT, go to **Add-on Modules** > **Install Module**
2. Paste the manifest URL:
   ```
   https://raw.githubusercontent.com/jaeyte/coriolis-aio-gen/main/module.json
   ```
3. Click **Install**

### Manual Installation

1. Download or clone into your Foundry `Data/modules/` directory:
   ```
   cd /path/to/foundry/Data/modules/
   git clone https://github.com/jaeyte/coriolis-aio-gen.git
   ```
2. Restart Foundry VTT
3. Enable the module in your world's **Module Management** settings

## Requirements

- **Foundry VTT** v13
- **Coriolis: The Third Horizon** system (`yzecoriolis`) v4.0.0+
- Optional: **Coriolis Core Rulebook** module (`coriolis-corerules`) for enhanced compendium data

## Module Structure

```
coriolis-aio-gen/
├── module.json
├── scripts/
│   ├── main.js                      # Entry point, hooks, header controls
│   ├── unified-dialog.js            # Tabbed dialog with all 8 generators
│   ├── generator.js                 # Character generation
│   ├── encounter-generator.js       # Encounter generation with scaling
│   ├── ship-generator.js            # Ship generation with modules/weapons
│   ├── ship-encounter-generator.js  # Ship encounter + crew + salvage
│   ├── party-generator.js           # Party generation with crew roles
│   ├── npc-generator.js             # Quick NPC generation
│   ├── ai-npc-generator.js          # AI-powered NPC generation via LLM
│   ├── mission-generator.js         # Mission briefing generation
│   ├── compendium-resolver.js       # Compendium-first item resolution
│   └── data/
│       ├── concepts.js              # 11 concepts, 33 sub-concepts
│       ├── talents.js               # 70+ talent definitions
│       ├── gear.js                  # Starting gear per sub-concept
│       ├── names.js                 # Name generator
│       ├── backgrounds.js           # Origins, upbringings, icons, appearance
│       ├── group-concepts.js        # 5 group concepts
│       ├── enemies.js               # 20 enemy templates, weapons, armor
│       ├── loot.js                  # Tiered loot tables
│       ├── encounters.js            # 16 encounter templates
│       ├── ships.js                 # 9 ship classes, 18+ modules
│       ├── ship-encounters.js       # 10 enemy ships, 9 ship encounter templates
│       ├── crew-roles.js            # Concept-to-crew-position affinity mapping
│       ├── npcs.js                  # 10 archetypes, factions, traits, quirks
│       └── missions.js              # 10 mission templates, complications, locations
├── templates/
│   └── unified-dialog.hbs           # Tabbed dialog template
├── styles/
│   └── generator.css                # Themed dialog styles
└── lang/
    └── en.json                      # English localization
```

## Changelog

### v3.2.0
- **Groq AI provider** — added as default AI provider with free tier support (`llama-3.3-70b-versatile`)
- **Combat-ready ship crew NPCs** — crew members now spawn with weapons, armor, gear, and talents
- **HP/MP token bar fix** — all generators now set `max` field on hitPoints/mindPoints for working token bars
- **Linked encounter fix** — random template selection no longer silently skips linked ship/boarding encounters
- **Loot table fixes** — corrected weapon stats (Thermal Carbine, Accelerator Pistol ranges) and added missing bonus/initiative fields
- **Ammo coverage** — added thermRifle to all AMMO_MAPs for consistent ammunition generation
- **Scout Vulcan Carbine** — added missing `automatic: true` flag
- **Mystic power names** — fixed "Mind Walker" display name in journal output

### v3.1.0
- Bump version; fix grenade type for compendium lookup

### v3.0.0
- NPC difficulty scaling and weapon range tiers
- Major content expansion

## License

This project is provided as-is for use with Foundry VTT. Coriolis: The Third Horizon is a product of Free League Publishing.
