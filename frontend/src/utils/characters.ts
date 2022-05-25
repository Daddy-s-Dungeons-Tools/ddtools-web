import { Character } from "ddtools-types";

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
