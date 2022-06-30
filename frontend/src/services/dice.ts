import DiceBox, { Roll } from "@3d-dice/dice-box";
import { LogAPI } from "./api";
import { auth } from "./firebase";

export const diceBox = new DiceBox("#dice-box", {
  assetPath: "/assets/dice-box/",
  // restitution: 0.1,
  theme: "diceOfRolling",
  scale: 5,
});

//@ts-ignore
window.diceBox = diceBox;

diceBox.init();

export async function roll(campaignId: string, diceNotation: string | Roll) {
  // if (diceBox.)

  const diceDisplay =
    typeof diceNotation === "string"
      ? diceNotation
      : `${diceNotation.qty}d${diceNotation.sides}${
          diceNotation.modifier ? "+" + diceNotation.modifier : ""
        }`;

  const logItem = await LogAPI.add(campaignId, {
    type: "roll",
    message: `Rolling **${diceDisplay}**...`,
    payload: diceNotation,
    sourceUserIds: auth.currentUser ? [auth.currentUser.uid] : [],
  });
  const rollResult = await diceBox.roll(diceNotation);

  LogAPI.update(campaignId, logItem.id, {
    message: `Rolled **${diceDisplay}** for **${rollResult[0].value.toString()}**`,
  });
}
