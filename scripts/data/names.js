/**
 * Name tables for character generation.
 * Coriolis uses Arabic/Persian-inspired naming conventions.
 */

const FIRST_NAMES = [
  "Amir", "Bashir", "Dalil", "Farid", "Ghani", "Hakim", "Idris", "Jabir",
  "Karim", "Latif", "Majid", "Nabil", "Omar", "Qadir", "Rashid", "Salim",
  "Tariq", "Umar", "Wahid", "Yasir", "Zahir", "Abbas", "Daoud", "Faisal",
  "Hamza", "Ismail", "Khalid", "Mustafa", "Nadir", "Rafiq", "Samir", "Walid",
  "Amira", "Basira", "Dalila", "Farida", "Ghania", "Hakima", "Idra", "Jabira",
  "Karima", "Latifa", "Majida", "Nabila", "Omara", "Qadira", "Rashida", "Salima",
  "Tariqa", "Uzma", "Wahida", "Yasira", "Zahira", "Abla", "Dunya", "Fadila",
  "Halima", "Inaya", "Khalida", "Muna", "Nadira", "Rafia", "Samira", "Warda",
  "Zahra", "Nura", "Safiya", "Layla", "Rania", "Hana", "Sana", "Zara",
  "Amin", "Bilal", "Dara", "Eshan", "Faris", "Ghazal", "Hadi", "Jalil",
  "Kamil", "Luqman", "Mahdi", "Nasir", "Osman", "Parsa", "Rami", "Shadi",
  "Talib", "Varis", "Yusuf", "Zain", "Arwa", "Bushra", "Dima", "Elham",
  "Fatma", "Gul", "Huda", "Janan", "Kenza", "Lina", "Maha", "Nadia",
  "Reem", "Saba", "Thana", "Yara"
];

const FAMILY_NAMES = [
  "al-Quadim", "al-Rashid", "al-Faran", "al-Sadiq", "al-Jabir", "al-Sharif",
  "al-Hakim", "al-Ghani", "al-Latif", "al-Majid", "al-Nabil", "al-Karim",
  "al-Bashir", "al-Farid", "al-Wahid", "al-Qadir", "al-Tariq", "al-Salim",
  "al-Yasir", "al-Zahir", "al-Hamza", "al-Ismail", "al-Khalid", "al-Walid",
  "Dargosian", "Ghatanfari", "Koroshan", "Nassari", "Omarkhan", "Parvaresh",
  "Shirazi", "Tabrizi", "Tehrani", "Zanjani", "Mashadi", "Bakhtiari",
  "Darabani", "Esfahani", "Ferdowsi", "Ghazali", "Hamedani", "Jafari",
  "Karimi", "Lashkari", "Mohseni", "Noori", "Pahlavi", "Rostami",
  "Samani", "Turani", "Vatani", "Yazdani", "Zamani", "Askari",
  "Bahrani", "Davari", "Golshani", "Hashemi", "Kazemi", "Maleki"
];

const NICKNAMES = [
  "the Sharp", "the Quiet", "the Bold", "the Wanderer", "the Ghost",
  "the Faithful", "the Fox", "the Iron", "the Red", "the Pale",
  "the Quick", "the Scarred", "the Scholar", "the Dreamer", "the Shark",
  "the Pilot", "the Blade", "the Snake", "the Lion", "the Crow",
  "the Exile", "the Shadow", "the Merchant", "the Breaker", "the Star"
];

/**
 * Generate a random character name.
 * @param {object} [options]
 * @param {boolean} [options.includeNickname=false] - Whether to include a nickname
 * @returns {string}
 */
export function generateName(options = {}) {
  const first = FIRST_NAMES[Math.floor(Math.random() * FIRST_NAMES.length)];
  const family = FAMILY_NAMES[Math.floor(Math.random() * FAMILY_NAMES.length)];

  if (options.includeNickname && Math.random() < 0.3) {
    const nick = NICKNAMES[Math.floor(Math.random() * NICKNAMES.length)];
    return `${first} "${nick}" ${family}`;
  }

  return `${first} ${family}`;
}

export { FIRST_NAMES, FAMILY_NAMES, NICKNAMES };
