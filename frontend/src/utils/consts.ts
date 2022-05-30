import { Campaign, Character } from "ddtools-types";

export const ABILITIES = ["str", "dex", "con", "int", "wis", "cha"] as const;

export const SKILLS = [
  "acrobatics",
  "animal handling",
  "arcana",
  "athletics",
  "deception",
  "history",
  "insight",
  "intimidation",
  "investigation",
  "medicine",
  "nature",
  "perception",
  "performance",
  "persuasion",
  "religion",
  "sleight of Hand",
  "stealth",
  "survival",
] as const;

export const SIZES = [
  "tiny",
  "small",
  "medium",
  "large",
  "huge",
  "gargantuan",
] as const;

export const ALIGNMENTS = [
  "lawful good",
  "neutral good",
  "chaotic good",
  "lawful neutral",
  "true neutral",
  "chaotic neutral",
  "lawful evil",
  "neutral evil",
  "chaotic evil",
] as const;

export const DAMAGE_TYPES = [
  "piercing",
  "slashing",
  "bludgeoning",
  "acid",
  "cold",
  "fire",
  "force",
  "lightning",
  "necrotic",
  "posion",
  "psychic",
  "radiant",
  "thunder",
] as const;

export const CONDITIONS = [
  "blinded",
  "charmed",
  "deafened",
  "exhaustion",
  "frightened",
  "grappled",
  "incapacitated",
  "invisible",
  "necrotic",
  "paralyzed",
  "petrified",
  "poisoned",
  "prone",
  "restrained",
  "stunned",
  "unconscious",
] as const;

export const SENSES = [
  "blindsight",
  "darkvision",
  "tremorsense",
  "truesight",
] as const;

export const ITEM_TYPES = [
  "$",
  "A",
  "AF",
  "AIR",
  "AT",
  "EM",
  "EXP",
  "FD",
  "G",
  "GS",
  "GV",
  "HA",
  "INS",
  "LA",
  "M",
  "MA",
  "MNT",
  "MR",
  "OTH",
  "P",
  "R",
  "RD",
  "RG",
  "S",
  "SC",
  "SCF",
  "SHP",
  "T",
  "TAH",
  "TG",
  "VEH",
  "WD",
] as const;

export const SPELL_COMPONENTS = ["v", "s", "m"] as const;

export const RARITIES = [
  "rare",
  "uncommon",
  "very rare",
  "legendary",
  "artifact",
  "common",
  "none",
  "unknown",
  "unknown (magic)",
  "varies",
] as const;

export const testCampaign: Campaign = {
  name: "Test Campaign",
  mode: "out-of-combat",
  createdAt: new Date().getTime(),
  color: "green",
  dmUserIds: ["123123124123123"],
  description: "lorem ipsum dolor sit amet",
};

export const testCharacter: Character = {
  xp: 0,
  race: { name: "Human" },
  classes: [
    {
      name: "Fighter",
      level: 3,
    },
  ],
  alignment: "lawful good",
  proficiencyBonus: 2,
  hasInspiration: false,
  hitDice: {
    current: 4,
    max: 4,
  },
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
  size: "small",
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
    acrobatics: 10,
    "animal handling": 10,
    arcana: 10,
    athletics: 10,
    deception: 10,
    history: 10,
    insight: 10,
    intimidation: 10,
    investigation: 10,
    medicine: 10,
    nature: 10,
    perception: 10,
    performance: 10,
    persuasion: 10,
    religion: 10,
    "sleight of Hand": 10,
    stealth: 10,
    survival: 10,
  },
  skillProficiencies: [],
  skillExpertises: [],
  savingThrows: {
    cha: 2,
    con: 2,
    dex: 2,
    int: 2,
    str: 2,
    wis: 2,
  },
  savingThrowProficiencies: [],
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
  createdAt: new Date().getTime(),
};
