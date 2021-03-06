import { ABILITIES, Campaign, Character, SKILLS } from "ddtools-types";
import { FirestoreDoc } from "services/converter";

export const noteTags = ["lore", "npc", "quest", "question"];

export const testCampaign: Campaign & FirestoreDoc = {
  id: "fakeid",
  ref: null!,
  name: "Test Campaign",
  mode: "out-of-combat",
  createdAt: new Date(),
  color: "green",
  dmUserIds: ["123123124123123"],
  description: "lorem ipsum dolor sit amet",
};

export const testCharacter: Character & FirestoreDoc = {
  id: "fakeid",
  ref: null!,
  xp: 0,
  race: { name: "Human", entries: [] },
  classes: [
    {
      name: "Fighter",
      level: 3,
      hitDice: {
        current: 3,
        sides: 6,
      },
      features: undefined!,
    },
  ],
  alignment: "lawful good",
  proficiencyBonus: 2,
  hasInspiration: false,

  deathSaves: {
    successes: 0,
    failures: 0,
  },
  physical: {
    age: 20,
    eyes: "blue",
    hair: "black",
    skin: "white",
    height: 120,
    weight: 140,
    description: "Wow so handsome",
  },
  personality: {
    traits: [],
    ideals: [],
    bonds: [],
    flaws: [],
    backstory: "",
  },
  feats: [],
  weaponProficiencies: [],
  armorProficiencies: [],
  toolProficiencies: [],
  weapons: [],
  equipment: [],
  treasure: {
    platinum: 0,
    gold: 0,
    silver: 0,
    copper: 0,
  },
  name: "Nil Agosto",
  size: "S",
  speed: {
    walking: 0,
    climbing: 0,
    swimming: 0,
    flying: 0,
    burrowing: 0,
  },
  abilityScores: {
    cha: 12,
    con: 16,
    dex: 14,
    int: 11,
    str: 20,
    wis: 12,
  },
  hitPoints: {
    current: 26,
    temporary: 0,
    max: 30,
  },
  armorClass: 0,
  passivePerception: 0,
  skills: {
    acrobatics: { isProficient: false, isExpertise: false },
    "animal handling": { isProficient: false, isExpertise: false },
    arcana: { isProficient: false, isExpertise: false },
    athletics: { isProficient: false, isExpertise: false },
    deception: { isProficient: false, isExpertise: false },
    history: { isProficient: false, isExpertise: false },
    insight: { isProficient: false, isExpertise: false },
    intimidation: { isProficient: false, isExpertise: false },
    investigation: { isProficient: false, isExpertise: false },
    medicine: { isProficient: false, isExpertise: false },
    nature: { isProficient: false, isExpertise: false },
    perception: { isProficient: false, isExpertise: false },
    performance: { isProficient: false, isExpertise: false },
    persuasion: { isProficient: false, isExpertise: false },
    religion: { isProficient: false, isExpertise: false },
    "sleight of Hand": { isProficient: false, isExpertise: false },
    stealth: { isProficient: false, isExpertise: false },
    survival: { isProficient: false, isExpertise: false },
  },
  savingThrows: {
    cha: { isProficient: false },
    con: { isProficient: false },
    dex: { isProficient: false },
    int: { isProficient: false },
    str: { isProficient: false },
    wis: { isProficient: false },
  },
  languages: [],
  senses: {
    blindsight: 0,
    darkvision: 0,
    tremorsense: 0,
    truesight: 0,
  },
  conditions: [],
  conditionImmunities: [],
  damageImmunities: [],
  damageResistances: [],
  damageVulnerabilities: [],
  tags: [],
  ownerUserId: "123123124123123",
  sharedWith: [],
  createdAt: new Date(),
  isActive: true,
  isJackOfAllTrades: false,
};

const defaultSkills = SKILLS.reduce(
  (obj, skill) => ({
    ...obj,
    [skill]: { isProficient: false, isExpertise: false, miscModifier: 0 },
  }),
  {},
) as Character["skills"];

const defaultSavingThrows = ABILITIES.reduce(
  (obj, ability) => ({
    ...obj,
    [ability]: { isProficient: false, miscModifier: 0 },
  }),
  {},
) as Character["savingThrows"];

export const emptyCharacter: Character = {
  xp: 0,
  race: undefined!,
  classes: [],
  alignment: "true neutral",
  proficiencyBonus: 2,
  hasInspiration: false,
  deathSaves: {
    successes: 0,
    failures: 0,
  },
  physical: {
    age: 0,
    eyes: "",
    hair: "",
    skin: "",
    height: 0,
    weight: 0,
    description: "",
  },
  personality: {
    traits: [],
    ideals: [],
    bonds: [],
    flaws: [],
    backstory: "",
  },
  feats: [],
  weaponProficiencies: [],
  armorProficiencies: [],
  toolProficiencies: [],
  weapons: [],
  equipment: [],
  treasure: {
    platinum: 0,
    gold: 0,
    silver: 0,
    copper: 0,
  },
  name: "",
  size: "T",
  speed: {
    walking: 30,
    climbing: 0,
    swimming: 0,
    flying: 0,
    burrowing: 0,
  },
  abilityScores: {
    cha: 10,
    str: 10,
    dex: 10,
    con: 10,
    int: 10,
    wis: 10,
  },
  hitPoints: {
    current: 0,
    temporary: 0,
    max: 0,
  },
  armorClass: 0,
  passivePerception: 0,
  skills: defaultSkills,
  savingThrows: defaultSavingThrows,
  languages: [],
  senses: {
    blindsight: 0,
    darkvision: 0,
    tremorsense: 0,
    truesight: 0,
  },
  conditions: [],
  conditionImmunities: [],
  damageImmunities: [],
  damageResistances: [],
  damageVulnerabilities: [],
  tags: [],
  ownerUserId: "",
  sharedWith: [],
  createdAt: new Date(),
  isActive: true,
  isJackOfAllTrades: false,
};
