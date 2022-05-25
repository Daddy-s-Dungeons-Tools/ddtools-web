import React from "react";
import ReactDOM from "react-dom";
import { CampaignBox } from "./CampaignBox";

import { BrowserRouter as Router } from "react-router-dom";

import { Campaign, Character } from "ddtools-types";

const testCampaign: Campaign = {
  name: "Test Campaign",
  mode: "out-of-combat",
  createdAt: new Date().getTime(),
  color: "green",
  dmUserIds: ["123123124123123"],
  dmUserNames: ["Frank"],
  description: "lorem ipsum dolor sit amet",
};

const testCharacter: Character = {
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
  name: "Johhny Appleseed",
  size: "small",
  speed: {
    walking: 0,
    climbing: 0,
    swimming: 0,
    flying: 0,
    burrowing: 0,
  },
  abilityScores: {
    cha: 10,
    con: 10,
    dex: 10,
    int: 10,
    str: 10,
    wis: 10,
  },
  hitPoints: {
    current: 30,
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

it("renders without crashing", () => {
  const div = document.createElement("div");
  ReactDOM.render(
    <Router>
      <CampaignBox
        campaign={testCampaign}
        as={"player"}
        character={testCharacter}
      />
    </Router>,
    div,
  );
});
