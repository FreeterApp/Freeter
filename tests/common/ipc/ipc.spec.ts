/*
 * Copyright: (c) 2024, Alex Kaul
 * GNU General Public License v3.0 or later (see COPYING or https://www.gnu.org/licenses/gpl-3.0.txt)
 */

import { channelPrefix, makeIpcChannelName } from '@common/ipc/ipc';

describe('Ipc', () => {
  describe('makeIpcChannelName()', () => {
    it('should return a valid IPC channel name', () => {
      const testName = 'TEST-NAME';

      const channelName = makeIpcChannelName(testName);

      expect(channelName).toBe(channelPrefix + testName);
    })
  })
})
