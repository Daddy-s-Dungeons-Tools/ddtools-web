/** Return a debounced version of a function. */
export function debounce(fn: Function, ms: number) {
  let timer: number | null;
  return (_: any) => {
    clearTimeout(timer!);
    timer = setTimeout((_) => {
      timer = null;
      // @ts-ignore
      fn.apply(this, arguments);
    }, ms);
  };
}
