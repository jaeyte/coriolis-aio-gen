/**
 * AI-powered NPC generator for Coriolis: The Third Horizon.
 *
 * Takes a free-text prompt and calls an LLM API to produce a complete
 * NPC actor with attributes, skills, talents, gear, and narrative details.
 *
 * Supports multiple providers:
 *  - Google Gemini (free tier)
 *  - OpenRouter (free models available)
 *  - Anthropic (paid)
 *
 * Requires an API key stored in module settings.
 */

import { resolveFromCompendium } from "./compendium-resolver.js";

const MODULE_ID = "coriolis-aio-gen";

// ── System prompt ────────────────────────────────────────────

const SYSTEM_PROMPT = `You are a game master assistant for the tabletop RPG "Coriolis: The Third Horizon" (Year Zero Engine).

Given a user description, generate a COMPLETE NPC as a JSON object. Follow the Coriolis rules strictly:

ATTRIBUTES (4 attributes, each 2-5, total exactly 14):
- strength, agility, wits, empathy

SKILLS (16 skills, each 0-5):
- dexterity, force, infiltration, manipulation, meleecombat, observation, rangedcombat, survival
- command, culture, datadjinn, medicurgy, mysticpowers, pilot, science, technology
NPCs typically have 2-4 skills at 2-3, the rest at 0. Mystic NPCs should have mysticpowers 2-3.

DERIVED STATS:
- hitPoints = strength + agility
- mindPoints = wits + empathy
- reputation: 0-6 (based on status)
- birr: starting money (10-5000 based on wealth)

ITEMS: Provide realistic Coriolis gear. Each item needs name, type, and system fields.
- type must be one of: "weapon", "armor", "gear", "talent"
- For weapons: system needs { damage, critical, range (close/short/long/extreme), bonus }
- For armor: system needs { armorRating, extraFeatures }
- For gear: system needs { weight (light/normal/heavy), quantity, cost }
- For talents: system needs { description, category } where category is one of: general, icon, group, humanite, cybernetic, mysticalpowers

MYSTIC POWERS: If the NPC is mystical/supernatural, include talents with category "mysticalpowers".
Available powers: Clairvoyant, Telekinesis, Telepathy, Premonition, Mind Walker.

AMMUNITION: Always include ammunition as gear items for any ranged weapons. For example:
- "Vulcan Ammunition" (quantity 1-2) for Vulcan Cricket, Vulcan Pistol, or Vulcan Carbine
- "Therm Cells" (quantity 1) for Therm Pistol or Therm Rifle

BIO fields:
- origin: a system/planet (Kua, Algol, Dabaran, Sadaal, Zalos, Mira, Coriolis station, etc.)
- upbringing: Plebeian, Stationary, or Privileged
- concept: their role/profession
- icon: one of the 16 Icons (Lady of Tears, The Dancer, The Gambler, The Merchant, The Deckhand, The Traveler, The Messenger, The Judge, The Faceless One, The Executioner, The Draconite, Ahlam's Beloved, The Dreamer, The Martyr, The Guardian, The Seekers)
- groupConcept: faction or group
- personalProblem: a compelling personal conflict
- appearance.face: physical description
- appearance.clothing: what they wear

Respond with ONLY valid JSON matching this exact structure (no markdown, no explanation):
{
  "name": "NPC Name",
  "bio": {
    "origin": "",
    "upbringing": "",
    "concept": "",
    "icon": "",
    "groupConcept": "",
    "personalProblem": "",
    "appearance": { "face": "", "clothing": "" }
  },
  "attributes": {
    "strength": 0, "agility": 0, "wits": 0, "empathy": 0
  },
  "skills": {
    "dexterity": 0, "force": 0, "infiltration": 0, "manipulation": 0,
    "meleecombat": 0, "observation": 0, "rangedcombat": 0, "survival": 0,
    "command": 0, "culture": 0, "datadjinn": 0, "medicurgy": 0,
    "mysticpowers": 0, "pilot": 0, "science": 0, "technology": 0
  },
  "reputation": 0,
  "birr": 0,
  "items": [
    { "name": "", "type": "weapon|armor|gear|talent", "system": {} }
  ],
  "notes": "A short narrative summary of who this NPC is and their role in the story."
}`;

// ── Default models per provider ─────────────────────────────

const DEFAULT_MODELS = {
  groq: "llama-3.3-70b-versatile",
  gemini: "gemini-2.5-flash",
  openrouter: "google/gemini-2.5-flash:free",
  anthropic: "claude-sonnet-4-6"
};

// ── Provider Definitions ─────────────────────────────────────

const PROVIDERS = {
  groq: {
    label: "Groq (free tier)",
    call: callGroqAPI
  },
  gemini: {
    label: "Google Gemini (free tier)",
    call: callGeminiAPI
  },
  openrouter: {
    label: "OpenRouter (free models)",
    call: callOpenRouterAPI
  },
  anthropic: {
    label: "Anthropic Claude",
    call: callAnthropicAPI
  }
};

// ── API Helpers ──────────────────────────────────────────────

/**
 * Parse LLM text response into JSON, stripping markdown fences.
 * Provides user-friendly error if the AI returns malformed data.
 */
function parseJsonResponse(text) {
  // Strip markdown code fences and any leading/trailing whitespace
  let cleaned = text.trim();
  cleaned = cleaned.replace(/^```(?:json)?\s*/i, "").replace(/\s*```\s*$/i, "").trim();

  // Some models wrap in extra text; try to extract the first { ... } block
  if (!cleaned.startsWith("{")) {
    const start = cleaned.indexOf("{");
    const end = cleaned.lastIndexOf("}");
    if (start !== -1 && end > start) {
      cleaned = cleaned.substring(start, end + 1);
    }
  }

  try {
    return JSON.parse(cleaned);
  } catch (parseErr) {
    console.error(`${MODULE_ID} | Failed to parse AI response as JSON:`, cleaned);
    throw new Error(
      "The AI returned invalid data that couldn't be parsed. " +
      "This sometimes happens — please try again. " +
      `(Parse error: ${parseErr.message})`
    );
  }
}

/**
 * Get the configured AI model, falling back to the default for the provider.
 */
function getModel(provider) {
  try {
    const custom = game.settings.get(MODULE_ID, "aiModel");
    if (custom && custom.trim()) return custom.trim();
  } catch { /* setting not registered yet, use default */ }
  return DEFAULT_MODELS[provider] || DEFAULT_MODELS.gemini;
}

/**
 * Retry wrapper for rate-limited (429) API calls.
 * Retries up to maxRetries times with exponential backoff.
 */
async function withRetry(fn, { maxRetries = 2, baseDelayMs = 3000 } = {}) {
  for (let attempt = 0; attempt <= maxRetries; attempt++) {
    try {
      return await fn();
    } catch (err) {
      const is429 = err.message && err.message.includes("429");
      if (is429 && attempt < maxRetries) {
        const delay = baseDelayMs * Math.pow(2, attempt);
        console.warn(`${MODULE_ID} | Rate limited (429), retrying in ${delay}ms (attempt ${attempt + 1}/${maxRetries})...`);
        await new Promise(r => setTimeout(r, delay));
        continue;
      }
      throw err;
    }
  }
}

// ── API Callers ──────────────────────────────────────────────

/**
 * Groq — free tier: 30 RPM, 14400 RPD.
 * Uses the OpenAI-compatible chat completions endpoint.
 */
async function callGroqAPI(apiKey, userPrompt) {
  const model = getModel("groq");
  return withRetry(async () => {
    let response;
    try {
      response = await fetch("https://api.groq.com/openai/v1/chat/completions", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${apiKey}`
        },
        body: JSON.stringify({
          model,
          messages: [
            { role: "system", content: SYSTEM_PROMPT },
            { role: "user", content: userPrompt }
          ],
          max_tokens: 2048,
          temperature: 0.8,
          response_format: { type: "json_object" }
        })
      });
    } catch (networkErr) {
      throw new Error(`Network error connecting to Groq API: ${networkErr.message}. Check your internet connection.`);
    }

    if (!response.ok) {
      const errBody = await response.text();
      if (response.status === 401) {
        throw new Error(`Groq API error (401 Unauthorized): Invalid API key. Get one at console.groq.com. Details: ${errBody}`);
      } else if (response.status === 429) {
        throw new Error(`Groq API rate limit reached (429). Free tier allows 30 requests/min and 14400 requests/day. Retrying...`);
      } else if (response.status === 404) {
        throw new Error(`Groq API error (404): Model '${model}' not found. Check the model name in module settings. Details: ${errBody}`);
      }
      throw new Error(`Groq API error (${response.status}): ${errBody}`);
    }

    const data = await response.json();
    const text = data.choices?.[0]?.message?.content;
    if (!text) throw new Error("Empty response from Groq API. The model may not have produced valid output — try again.");
    return parseJsonResponse(text);
  });
}

/**
 * Google Gemini — free tier: 10 RPM, 250 RPD, 250k TPM.
 * Uses the generativelanguage.googleapis.com REST API.
 */
async function callGeminiAPI(apiKey, userPrompt) {
  const model = getModel("gemini");
  return withRetry(async () => {
    const url = `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${apiKey}`;

    let response;
    try {
      response = await fetch(url, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          system_instruction: { parts: [{ text: SYSTEM_PROMPT }] },
          contents: [{ parts: [{ text: userPrompt }] }],
          generationConfig: {
            temperature: 0.8,
            maxOutputTokens: 2048,
            responseMimeType: "application/json"
          }
        })
      });
    } catch (networkErr) {
      throw new Error(`Network error connecting to Gemini API: ${networkErr.message}. Check your internet connection.`);
    }

    if (!response.ok) {
      const errBody = await response.text();
      if (response.status === 400) {
        throw new Error(`Gemini API error (400 Bad Request): The API key may be invalid or the request was malformed. Details: ${errBody}`);
      } else if (response.status === 403) {
        throw new Error(`Gemini API error (403 Forbidden): Your API key does not have access. Ensure you have enabled the Generative Language API in Google Cloud Console. Details: ${errBody}`);
      } else if (response.status === 429) {
        throw new Error(`Gemini API rate limit reached (429). Free tier allows 10 requests/min and 250 requests/day. Retrying...`);
      } else if (response.status === 404) {
        throw new Error(`Gemini API error (404 Not Found): The model '${model}' was not found. Check the model name in module settings. Details: ${errBody}`);
      }
      throw new Error(`Gemini API error (${response.status}): ${errBody}`);
    }

    const data = await response.json();

    // Check for blocked content or empty candidates
    if (data.promptFeedback?.blockReason) {
      throw new Error(`Gemini blocked the request: ${data.promptFeedback.blockReason}. Try rephrasing the NPC description.`);
    }

    const text = data.candidates?.[0]?.content?.parts?.[0]?.text;
    if (!text) {
      const finishReason = data.candidates?.[0]?.finishReason;
      throw new Error(`Empty response from Gemini API${finishReason ? ` (finish reason: ${finishReason})` : ''}. Try simplifying the prompt.`);
    }
    return parseJsonResponse(text);
  });
}

/**
 * OpenRouter — aggregates many models. Free models available.
 * Uses the OpenAI-compatible chat completions endpoint.
 */
async function callOpenRouterAPI(apiKey, userPrompt) {
  const model = getModel("openrouter");
  return withRetry(async () => {
    let response;
    try {
      response = await fetch("https://openrouter.ai/api/v1/chat/completions", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${apiKey}`,
          "HTTP-Referer": window.location.href,
          "X-Title": "Coriolis AIO Generator"
        },
        body: JSON.stringify({
          model,
          messages: [
            { role: "system", content: SYSTEM_PROMPT },
            { role: "user", content: userPrompt }
          ],
          max_tokens: 2048,
          temperature: 0.8
        })
      });
    } catch (networkErr) {
      throw new Error(`Network error connecting to OpenRouter: ${networkErr.message}. Check your internet connection.`);
    }

    if (!response.ok) {
      const errBody = await response.text();
      if (response.status === 401) {
        throw new Error(`OpenRouter API error (401 Unauthorized): Invalid API key. Get one at openrouter.ai/keys. Details: ${errBody}`);
      } else if (response.status === 402) {
        throw new Error(`OpenRouter API error (402): Insufficient credits. Add credits at openrouter.ai or switch to a free model. Details: ${errBody}`);
      } else if (response.status === 429) {
        throw new Error(`OpenRouter rate limit reached (429). Please wait and try again.`);
      } else if (response.status === 404) {
        throw new Error(`OpenRouter API error (404): Model '${model}' not found. Check the model name in module settings. Details: ${errBody}`);
      }
      throw new Error(`OpenRouter API error (${response.status}): ${errBody}`);
    }

    const data = await response.json();
    const text = data.choices?.[0]?.message?.content;
    if (!text) throw new Error("Empty response from OpenRouter API. The model may not have produced valid output — try again.");
    return parseJsonResponse(text);
  });
}

/**
 * Anthropic Claude — paid, high quality.
 */
async function callAnthropicAPI(apiKey, userPrompt) {
  const model = getModel("anthropic");
  return withRetry(async () => {
    let response;
    try {
      response = await fetch("https://api.anthropic.com/v1/messages", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "x-api-key": apiKey,
          "anthropic-version": "2023-06-01",
          "anthropic-dangerous-direct-browser-access": "true"
        },
        body: JSON.stringify({
          model,
          max_tokens: 2048,
          system: SYSTEM_PROMPT,
          messages: [
            { role: "user", content: userPrompt }
          ]
        })
      });
    } catch (networkErr) {
      throw new Error(`Network error connecting to Anthropic API: ${networkErr.message}. Check your internet connection.`);
    }

    if (!response.ok) {
      const errBody = await response.text();
      if (response.status === 401) {
        throw new Error(`Anthropic API error (401 Unauthorized): Invalid API key. Get one at console.anthropic.com. Details: ${errBody}`);
      } else if (response.status === 403) {
        throw new Error(`Anthropic API error (403 Forbidden): Your API key does not have access to the requested model. Details: ${errBody}`);
      } else if (response.status === 429) {
        throw new Error(`Anthropic rate limit reached (429). Please wait and try again.`);
      } else if (response.status === 404) {
        throw new Error(`Anthropic API error (404): Model '${model}' not found. Check the model name in module settings. Details: ${errBody}`);
      } else if (response.status === 529) {
        throw new Error(`Anthropic API overloaded (529). The API is temporarily at capacity — please try again in a few minutes.`);
      }
      throw new Error(`Anthropic API error (${response.status}): ${errBody}`);
    }

    const data = await response.json();
    const text = data.content?.[0]?.text;
    if (!text) throw new Error("Empty response from Anthropic API. Try again or simplify the prompt.");
    return parseJsonResponse(text);
  });
}

// ── NPC Builder ──────────────────────────────────────────────

/**
 * Try to upgrade each item via compendium lookup.
 */
async function enrichItems(items) {
  const enriched = [];
  for (const item of items) {
    const compendiumItem = await resolveFromCompendium(item.name, item.type);
    if (compendiumItem) {
      enriched.push(compendiumItem);
    } else {
      enriched.push(item);
    }
  }
  return enriched;
}

/**
 * Validate and clamp NPC data to legal Coriolis ranges.
 */
function sanitizeNPC(npc) {
  const clamp = (v, lo, hi) => Math.max(lo, Math.min(hi, Math.round(v) || lo));

  // Attributes: each 2-5, total 14
  const attrs = npc.attributes || {};
  for (const key of ["strength", "agility", "wits", "empathy"]) {
    attrs[key] = clamp(attrs[key], 2, 5);
  }
  // Adjust total to 14
  let total = attrs.strength + attrs.agility + attrs.wits + attrs.empathy;
  const attrKeys = ["strength", "agility", "wits", "empathy"];
  while (total > 14) {
    for (const k of attrKeys) {
      if (total <= 14) break;
      if (attrs[k] > 2) { attrs[k]--; total--; }
    }
  }
  while (total < 14) {
    for (const k of attrKeys) {
      if (total >= 14) break;
      if (attrs[k] < 5) { attrs[k]++; total++; }
    }
  }
  npc.attributes = attrs;

  // Skills: each 0-5
  const skills = npc.skills || {};
  const allSkills = [
    "dexterity", "force", "infiltration", "manipulation",
    "meleecombat", "observation", "rangedcombat", "survival",
    "command", "culture", "datadjinn", "medicurgy",
    "mysticpowers", "pilot", "science", "technology"
  ];
  for (const s of allSkills) {
    skills[s] = clamp(skills[s], 0, 5);
  }
  npc.skills = skills;

  npc.reputation = clamp(npc.reputation, 0, 10);
  npc.birr = clamp(npc.birr, 0, 99999);

  return npc;
}

// ── Main Export ──────────────────────────────────────────────

/**
 * Generate an NPC from a free-text prompt using the configured LLM provider.
 *
 * @param {object} options
 * @param {string} options.prompt - User's NPC description
 * @returns {Promise<{actor: Actor|null, summary: string}>}
 */
export async function generateAINpc(options = {}) {
  const provider = game.settings.get(MODULE_ID, "aiProvider");
  const apiKey = game.settings.get(MODULE_ID, "aiApiKey");

  if (!apiKey) {
    ui.notifications.error(
      game.i18n.localize("CORIOLIS_AIO.AINPC.NoApiKey")
    );
    return { actor: null, summary: "Error: no API key configured" };
  }

  const providerDef = PROVIDERS[provider];
  if (!providerDef) {
    ui.notifications.error(`Unknown AI provider: ${provider}`);
    return { actor: null, summary: "Error: unknown provider" };
  }

  const prompt = options.prompt?.trim();
  if (!prompt) {
    ui.notifications.warn("Please enter an NPC description.");
    return { actor: null, summary: "Error: empty prompt" };
  }

  ui.notifications.info(
    game.i18n.localize("CORIOLIS_AIO.AINPC.Generating")
  );

  // Show loading overlay
  const overlay = document.createElement("div");
  overlay.classList.add("coriolis-ai-loading-overlay");
  overlay.innerHTML = `
    <div class="coriolis-ai-spinner"></div>
    <div class="coriolis-ai-loading-text">${game.i18n.localize("CORIOLIS_AIO.AINPC.GeneratingTitle")}</div>
    <div class="coriolis-ai-loading-subtext">${game.i18n.localize("CORIOLIS_AIO.AINPC.GeneratingMessage")}</div>
  `;
  document.body.appendChild(overlay);

  try {
    let npcData;
    try {
      npcData = await providerDef.call(apiKey, prompt);
    } catch (err) {
      console.error(`${MODULE_ID} | AI NPC generation failed (${provider}):`, err);
      ui.notifications.error(`AI generation failed: ${err.message}`);
      return { actor: null, summary: `Error: ${err.message}` };
    }

    npcData = sanitizeNPC(npcData);

    // Enrich items via compendium
    const items = await enrichItems(npcData.items || []);

    const bio = npcData.bio || {};
    const attrs = npcData.attributes;
    const hpMax = attrs.strength + attrs.agility;
    const mpMax = attrs.wits + attrs.empathy;

    // Build skill values
    const skillsData = {};
    for (const [key, val] of Object.entries(npcData.skills)) {
      skillsData[key] = { value: val };
    }

    const actorData = {
      name: npcData.name || "Unnamed NPC",
      type: "npc",
      system: {
        bio: {
          origin: bio.origin || "",
          upbringing: bio.upbringing || "",
          humanite: false,
          concept: bio.concept || "",
          icon: bio.icon || "",
          groupConcept: bio.groupConcept || "",
          personalProblem: bio.personalProblem || "",
          appearance: {
            face: bio.appearance?.face || "",
            clothing: bio.appearance?.clothing || ""
          },
          crewPosition: { position: "", shipId: "" }
        },
        attributes: {
          strength: { value: attrs.strength },
          agility: { value: attrs.agility },
          wits: { value: attrs.wits },
          empathy: { value: attrs.empathy }
        },
        skills: skillsData,
        hitPoints: { value: hpMax, max: hpMax },
        mindPoints: { value: mpMax, max: mpMax },
        experience: { value: 0 },
        radiation: { value: 0 },
        reputation: { value: npcData.reputation || 0 },
        birr: npcData.birr || 0,
        movementRate: 10,
        notes: npcData.notes || `AI-generated NPC.\nPrompt: ${prompt}`
      },
      items
    };

    const actor = await Actor.implementation.create(actorData);
    const summary = `AI NPC: "${actor.name}" — ${bio.concept || "custom"}`;
    ui.notifications.info(`AI NPC created: ${actor.name}`);
    return { actor, summary };
  } finally {
    // Always remove the overlay
    overlay.remove();
  }
}
