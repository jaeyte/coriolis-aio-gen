/**
 * Maps character concepts to preferred crew positions for the party generator.
 *
 * When generating a party, each character's concept is checked against this
 * mapping to assign an appropriate crew position on the ship.
 */

export const CONCEPT_CREW_AFFINITY = {
  artist:      ["captain"],
  dataSpider:  ["sensorOperator", "engineer"],
  fugitive:    ["pilot", "gunner"],
  negotiator:  ["captain"],
  operative:   ["gunner", "captain"],
  pilot:       ["pilot"],
  preacher:    ["captain", "medic"],
  scientist:   ["sensorOperator", "medic"],
  shipWorker:  ["engineer"],
  soldier:     ["gunner", "captain"],
  trailblazer: ["pilot", "sensorOperator"]
};

/**
 * All assignable crew positions in order of priority.
 */
export const CREW_POSITIONS_ORDER = [
  "captain", "pilot", "engineer", "gunner", "sensorOperator", "medic"
];
