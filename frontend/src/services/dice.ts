import DiceBox from "@3d-dice/dice-box";

export const diceBox = new DiceBox("#dice-box", {
  assetPath: "/assets/dice-box/",
  restitution: 0.1,
  theme: "diceOfRolling",
  scale: 5,
});

//@ts-ignore
window.diceBox = diceBox;

diceBox.init();
