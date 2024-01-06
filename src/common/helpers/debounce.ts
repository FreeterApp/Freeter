/*
 * Copyright: (c) 2024, Alex Kaul
 * GNU General Public License v3.0 or later (see COPYING or https://www.gnu.org/licenses/gpl-3.0.txt)
 */

export type DebouncedFunc<TArgs extends unknown[] = unknown[]> = (
  (...args: TArgs) => void
) & {
  cancel: () => void;
}

export function debounce<TArgs extends unknown[] = unknown[]>(
  func: (...args: TArgs) => void,
  msec: number
) {
  let timer: ReturnType<typeof setTimeout>;
  const debouncedFunc: DebouncedFunc<TArgs> = (...args) => {
    clearTimeout(timer);
    timer = setTimeout(() => {
      func(...args);
    }, msec);
  };

  debouncedFunc.cancel = () => clearTimeout(timer);

  return debouncedFunc;
}
