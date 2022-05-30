declare module "@3d-dice/dice-box" {
  interface Roll {
    modifier?: number;
    qty: number;
    sides: number;
    theme?: string;
  }

  interface DieResult {
    /** The roll group this die belongs to */
    groupId: number;
    /** The unique identifier for this die within the group */
    rollId: number;
    /** The type of die */
    sides: number;
    /** The theme that was assigned to this die */
    theme: string;
    /** The roll result for this die */
    value: number;
  }

  export default class DiceBox {
    constructor(id: string, options?: any);

    init();

    roll(diceNotation: string | Roll): Promise<DieResult>;
    roll(diceNotation: (string | Roll)[]): Promise<DieResult[]>;
  }
}
