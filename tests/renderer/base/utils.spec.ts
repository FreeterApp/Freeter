/*
 * Copyright: (c) 2024, Alex Kaul
 * GNU General Public License v3.0 or later (see COPYING or https://www.gnu.org/licenses/gpl-3.0.txt)
 */

import { generateUniqueName } from '@/base/utils'

describe('generateUniqueName()', () => {
  const baseName = 'NAME';

  it('should generate a name by adding a number 1 to the base name, when the usedNames is empty', () => {
    expect(generateUniqueName(baseName, [])).toBe(`${baseName} 1`);
  })

  it('should increment the number until it finds a unique name not included in the usedNames list', () => {
    expect(generateUniqueName(baseName, [`${baseName} 1`, `${baseName} 2`, `${baseName} 4`])).toBe(`${baseName} 3`);
  })

  it('should stop finding a unique name after 1000 attempts', () => {
    const usedNames = Array.from({ length: 1000 }, (_, idx) => `${baseName} ${idx + 1}`);
    expect(generateUniqueName(baseName, usedNames)).toBe(`${baseName} 1000`);
  })
})
