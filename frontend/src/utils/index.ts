export const clamp = (value: number, min: number, max: number): number =>
  Math.min(Math.max(value, min), max);

/** Given an object of updates like {a:2, b: 'hello'}, generates a string message:
 * "Field `a` set to `'2'`, Field `b` set to `'hello'`"
 */
export const updateMessage = (updates: Record<string, any>) =>
  Object.entries(updates)
    .map(
      ([field, newValue]) =>
        `Field \`${field}\` set to \`'${
          typeof newValue === "object" ? "object" : newValue
        }'\``,
    )
    .join(", ");
