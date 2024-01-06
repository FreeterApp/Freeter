/*
 * Copyright: (c) 2024, Alex Kaul
 * GNU General Public License v3.0 or later (see COPYING or https://www.gnu.org/licenses/gpl-3.0.txt)
 */

export function generateUniqueName(baseName: string, usedNames: string[]): string {
  let res = '';
  for (let i = 1; i <= 1000; i++) {
    res = `${baseName} ${i}`;
    if (usedNames.indexOf(res) < 0) {
      return res;
    }
  }
  return res;
}
