/*
 * Copyright: (c) 2024, Alex Kaul
 * GNU General Public License v3.0 or later (see COPYING or https://www.gnu.org/licenses/gpl-3.0.txt)
 */

import { uuidv4IdGenerator } from '@/infra/idGenerator/uuidv4IdGenerator'

describe('uuidv4IdGenerator()', () => {
  it('should generate correct UUID', () => {
    const uuid = uuidv4IdGenerator();
    expect(uuid).toMatch(/^[0-9a-fA-F]{8}\b-[0-9a-fA-F]{4}\b-[0-9a-fA-F]{4}\b-[0-9a-fA-F]{4}\b-[0-9a-fA-F]{12}$/gi)
  })

  it('should generate new UUIDs on each call', () => {
    const uuid1 = uuidv4IdGenerator();
    const uuid2 = uuidv4IdGenerator();
    expect(uuid1).not.toBe(uuid2);
  })
})
