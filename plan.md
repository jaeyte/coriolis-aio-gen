# Coriolis AIO Character Generator — Implementation Plan

## Overview
A Foundry VTT v13 module for the `yzecoriolis` system that generates complete, ready-to-play characters/NPCs with attributes, skills, talents, and gear automatically embedded on the actor.

## Module Structure
```
coriolis-aio-gen/
├── module.json                  # Module manifest (Foundry v13 format)
├── scripts/
│   ├── main.js                  # Module init, hooks, UI button registration
│   ├── generator.js             # Core generation logic / orchestrator
│   ├── data/
│   │   ├── concepts.js          # 11 concepts + sub-concepts, attribute/skill profiles
│   │   ├── talents.js           # All talents with full data (name, category, description, effects)
│   │   ├── gear.js              # Starting gear tables per concept/sub-concept
│   │   ├── names.js             # Name tables (Arabic/Persian-inspired, by origin)
│   │   ├── backgrounds.js       # Origins, upbringings, icons, personal problems
│   │   └── group-concepts.js    # Group concepts and their talents
│   ├── compendium-resolver.js   # Try compendium lookup first, fall back to built-in data
│   └── dialog.js                # Generation config dialog UI
├── templates/
│   └── generator-dialog.hbs     # Handlebars template for the config dialog
├── styles/
│   └── generator.css            # Dialog styling
└── lang/
    └── en.json                  # i18n strings
```

## Step-by-Step Implementation

### Step 1: Module manifest (`module.json`)
- ID: `coriolis-aio-gen`
- Compatibility: Foundry v13
- System dependency: `yzecoriolis`
- ESModule entry point: `scripts/main.js`

### Step 2: Character creation data (`scripts/data/`)

**concepts.js** — All 11 concepts with sub-concepts:
- Artist (Courtesan, Musician, Poet)
- Data Spider (Analyst, Correspondent, Data Djinn)
- Fugitive (Criminal, Mystic, Revolutionary)
- Negotiator (Agitator, Diplomat, Peddler)
- Operative (Assassin, Guard, Spy)
- Pilot (Driver, Fighter Pilot, Freighter Pilot)
- Preacher (Ascetic, Missionary, Prophet)
- Scientist (Archaeologist, Medicurg, Technician)
- Ship Worker (Deckhand, Dock Worker, Engineer)
- Soldier (Legionnaire, Mercenary, Officer)
- Trailblazer (Colonist, Prospector, Scout)

Each concept defines:
- Key attribute emphasis (which attributes get higher values)
- Concept skill points (which skills, how many points)
- Starting gear table
- Available concept talents

**talents.js** — Complete talent definitions:
- General talents (~20)
- Group concept talents (per group concept)
- Icon talents (one per icon)
- Concept-specific talents
- Each entry: `{ name, category, description, effects/itemModifiers }`

**gear.js** — Starting equipment per sub-concept:
- Weapons (type, damage, range, etc.)
- Armor (rating, weight)
- General gear (tools, comms, etc.)
- Starting birr amounts

**names.js** — Random name tables by origin/heritage

**backgrounds.js** — Origins, upbringings, icons (16), personal problems, appearance traits

### Step 3: Compendium resolver (`scripts/compendium-resolver.js`)
Priority system for talents and items:
1. Search `coriolis-corerules` compendium packs (if premium module installed)
2. Search any world-level compendiums
3. Fall back to built-in data definitions from `scripts/data/`

This ensures maximum compatibility — works standalone but uses rich compendium data when available.

### Step 4: Core generator (`scripts/generator.js`)
The generation algorithm follows the rulebook character creation steps:

1. **Pick concept + sub-concept** (random or user-selected)
2. **Pick background** — origin, upbringing (Plebeian/Stationary/Privileged)
3. **Distribute attributes** — 14 points total, min 2 max 5, weighted by concept
4. **Distribute skills** — concept skills (points vary by concept), plus bonus from upbringing
5. **Select talent** — one starting talent (concept-specific or general)
6. **Select icon** — random from 16 icons
7. **Determine gear** — starting gear based on sub-concept
8. **Generate personal details** — name, appearance, personal problem, relationships
9. **Calculate derived stats** — HP (str+agi), MP (wits+emp), starting birr, reputation
10. **Create actor** — single `Actor.implementation.create()` call with all embedded items

### Step 5: Config dialog (`scripts/dialog.js` + `templates/generator-dialog.hbs`)
A dialog with options:
- **Actor type**: Character or NPC
- **Concept**: Random or pick from dropdown
- **Sub-concept**: Random or pick (filtered by concept)
- **Group concept**: Random or pick
- **Upbringing**: Random or pick
- **Origin**: Random or pick
- **Name**: Auto-generated or manual entry
- **"Generate" button** → runs generator, creates actor, closes dialog

### Step 6: UI integration (`scripts/main.js`)
- Register module with Foundry
- Add "Generate Character" button to the Actors Directory sidebar header
- Wire up the dialog and generator
- Register module settings (e.g., default actor type, compendium preference)

## Actor Creation API Call
Single-call creation with inline embedded items:
```javascript
const actor = await Actor.implementation.create({
  name: generatedName,
  type: actorType, // "character" or "npc"
  system: {
    bio: { concept, origin, upbringing, icon, personalProblem, appearance, groupConcept },
    attributes: { strength: {value}, agility: {value}, wits: {value}, empathy: {value} },
    skills: { /* all 16 skills with values */ },
    hitPoints: { value: hpMax },
    mindPoints: { value: mpMax },
    reputation: { value: rep },
    birr: startingBirr
  },
  items: [
    // Talents as embedded items
    { name: "Talent Name", type: "talent", system: { category, description } },
    // Weapons
    { name: "Vulcan Pistol", type: "weapon", system: { damage, range, ... } },
    // Armor
    { name: "Exo Shell", type: "armor", system: { armorRating, ... } },
    // Gear
    { name: "Communicator", type: "gear", system: { weight, ... } }
  ]
});
```

## Key Design Decisions
- **Compendium-first**: Always try to pull talent/item data from installed compendiums for richer data (icons, descriptions), gracefully fall back to built-in definitions
- **Single create call**: Use inline `items` array for atomic actor creation
- **Rule-compliant**: Follow the actual character creation rules (point totals, restrictions, valid combinations)
- **Randomization with guardrails**: Random generation follows valid distributions, not purely random numbers
