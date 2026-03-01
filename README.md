# Coriolis AIO Character Generator

A Foundry VTT v13 module for the **Coriolis: The Third Horizon** system (`yzecoriolis`) that generates complete, ready-to-play characters and NPCs with a single click.

## Features

### One-Click Character Generation

Click the **Generate Character** button in the Actors sidebar to open the configuration dialog. Choose your options or leave everything on "Random" for a fully randomized character. The generator creates a complete Foundry actor with all data filled in and items embedded — ready to play immediately.

### Full Rulebook-Compliant Creation

The generator follows the official Coriolis character creation rules:

- **14 attribute points** distributed across Strength, Agility, Wits, and Empathy (min 2, max 5 each), weighted toward the concept's key attribute
- **Concept skill points** (8 points) focused on the concept's core skills, plus **upbringing bonus points** (2–6 depending on background)
- **Starting talent** selected from the character's concept talent pool
- **Icon talent** automatically assigned based on chosen Icon
- **Group concept talent** randomly selected from the crew's group concept
- **Starting gear** (weapons, armor, and equipment) based on sub-concept, embedded as items on the actor

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

### Backgrounds and Personal Details

- **10 origins** across the Third Horizon (Kua, Dabaran, Algol, Mira, and more)
- **3 upbringings** that affect skill points, starting birr, and reputation:
  - Plebeian — 6 bonus skill points, 500 birr, 2 reputation
  - Stationary — 4 bonus skill points, 1,000 birr, 4 reputation
  - Privileged — 2 bonus skill points, 5,000 birr, 6 reputation
- **16 Icons** (Lady of Tears, The Dancer, The Gambler, etc.) with matching Icon talents
- **5 group concepts** (Free Traders, Mercenaries, Agents, Explorers, Pilgrims)
- Randomly generated **personal problems**, **appearance** (face and clothing), and **Arabic/Persian-inspired names** with optional nicknames

### 70+ Talents

Talents are organized by category and automatically embedded on the generated actor:

- **Group concept talents** — one per group concept (e.g., A Nose for Birr, Assault, Camouflage)
- **Concept talents** — two per concept (e.g., Hacker, Combat Veteran, Field Medicurg)
- **Icon talents** — one per Icon, granted automatically
- **General talents** — Defensive, Executioner, Intimidating, Third Eye, and more
- **Humanite talents** — Pheromones, Night Vision, Regenerative, etc.
- **Cybernetic talents** — Accelerated Reflexes, Body Armor, Neural Link, etc.
- **Mystical power talents** — Clairvoyant, Telekinesis, Telepathy, Premonition, etc.

### Starting Gear per Sub-Concept

Every sub-concept has a tailored starting gear loadout. Examples:

- **Legionnaire** — Vulcan Carbine, Armor Vest, Survival Kit, Communicator
- **Spy** — Vulcan Pistol, Disguise Kit, Spy Glass, Communicator
- **Medicurg** — Medicurgy Kit, Computer Tablet, Medlab Drugs, Communicator
- **Scout** — Vulcan Carbine, Survival Kit, Binoculars, Communicator

All items are created as proper embedded documents on the actor with correct system data (damage, range, armor rating, weight, tech tier, etc.).

### Compendium-First Resolution

When the premium **Coriolis Core Rulebook** module (`coriolis-corerules`) is installed, the generator automatically pulls talent and item data from its compendium packs. This gives you richer descriptions, proper icons, and full item data from the official source. If the premium module is not installed, the generator falls back gracefully to its built-in data definitions.

Resolution priority:
1. `coriolis-corerules` compendium packs (premium module)
2. World-level compendiums
3. Built-in module data

### Configuration Dialog

The dialog lets you control any or all aspects of generation:

| Option | Choices |
|---|---|
| Actor Type | Character or NPC |
| Name | Custom name or auto-generated |
| Concept | Pick one or Random |
| Sub-Concept | Pick one or Random (filtered by concept) |
| Group Concept | Pick one or Random |
| Upbringing | Plebeian, Stationary, Privileged, or Random |
| Origin | Pick one or Random |
| Icon | Pick one or Random |

The sub-concept dropdown dynamically updates based on the selected concept.

## Installation

### Via Manifest URL

1. In Foundry VTT, go to **Add-on Modules** > **Install Module**
2. Paste the manifest URL:
   ```
   https://raw.githubusercontent.com/jaeyte/coriolis-aio-gen/main/module.json
   ```
3. Click **Install**

### Manual Installation

1. Download or clone this repository into your Foundry VTT `Data/modules/` directory:
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
├── module.json                  # Module manifest
├── scripts/
│   ├── main.js                  # Entry point, hooks, sidebar button
│   ├── generator.js             # Core generation algorithm
│   ├── dialog.js                # Configuration dialog
│   ├── compendium-resolver.js   # Compendium-first item resolution
│   └── data/
│       ├── concepts.js          # 11 concepts, 33 sub-concepts
│       ├── talents.js           # 70+ talent definitions
│       ├── gear.js              # Starting gear per sub-concept
│       ├── names.js             # Name generator (110+ first names, 60+ family names)
│       ├── backgrounds.js       # Origins, upbringings, icons, appearance
│       └── group-concepts.js    # 5 group concepts
├── templates/
│   └── generator-dialog.hbs     # Dialog template
├── styles/
│   └── generator.css            # Dialog and button styles
└── lang/
    └── en.json                  # English localization
```

## License

This project is provided as-is for use with Foundry VTT. Coriolis: The Third Horizon is a product of Free League Publishing.
