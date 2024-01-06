/*
 * Copyright: (c) 2024, Alex Kaul
 * GNU General Public License v3.0 or later (see COPYING or https://www.gnu.org/licenses/gpl-3.0.txt)
 */

export function deepFreeze<T extends Array<unknown> | object>(item: T): T {
  // Skip if already frozen and primitives for which isFrozen is always true
  if (Object.isFrozen(item)) {
    return item;
  }

  if (!Array.isArray(item) && item.constructor === Object && Object.getPrototypeOf(item) !== Object.prototype) {
    throw new Error('Cannot freeze a class-based object');
  }

  Object.freeze(item);

  Object.keys(item).forEach(i => deepFreeze((item as Record<string, unknown>)[i] as Record<string, unknown>));

  return item;
}
