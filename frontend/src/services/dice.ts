import DiceBox from "@3d-dice/dice-box";

export const diceBox = new DiceBox("#dice-box", {
  assetPath: "/assets/dice-box/",
});

//@ts-ignore
window.diceBox = diceBox;

diceBox.init();
