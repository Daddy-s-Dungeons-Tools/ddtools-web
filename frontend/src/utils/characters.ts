import { Character } from "ddtools-types";

export const characterPhysicalDescription = (character: Character) => {
  return `${character.physical.age} y/o, ${character.physical.eyes} eyes, ${character.physical.hair} hair, ${character.physical.skin} skin`;
};

/**
 * Given a character, determine their current health status and assign it a string descriptor.
 * Looks at the percentage of current hitpoints plus temporary hitpoints versus max hitpoints.
 */
export const characterHealthStatus = (character: Character) => {
  const remainingHealthPercent =
    (character.hitPoints.current + character.hitPoints.temporary) /
    character.hitPoints.max;

  if (remainingHealthPercent >= 1) {
    return "untouched";
  } else if (remainingHealthPercent >= 0.85) {
    return "healthy";
  } else if (remainingHealthPercent >= 0.5) {
    return "hurt";
  } else if (remainingHealthPercent >= 0.25) {
    return "pretty hurt";
  } else if (remainingHealthPercent > 0) {
    return "critically hurt";
  }

  return "unconscious";
};

/** Forms a string of the character's race and class(es), taking into account multiclasses. */
export const characterRaceAndClasses = (character: Character) => {
  let line =
    character.race.name +
    " " +
    character.classes
      .map((clss) => `Level ${clss.level} ${clss.name}`)
      .join(" & ");

  return line;
};
