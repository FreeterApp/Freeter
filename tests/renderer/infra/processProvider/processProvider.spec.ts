/*
 * Copyright: (c) 2024, Alex Kaul
 * GNU General Public License v3.0 or later (see COPYING or https://www.gnu.org/licenses/gpl-3.0.txt)
 */

import { ipcGetProcessInfoChannel } from '@common/ipc/channels';
import { createProcessProvider } from '@/infra/processProvider/processProvider';
import { electronIpcRenderer } from '@/infra/globals';

jest.mock('@/infra/globals');

describe('ProcessProvider', () => {
  beforeEach(() => jest.resetAllMocks())

  it('should get process info from the main process on init', async () => {
    const res = 'result';
    (<jest.MockedFunction<typeof electronIpcRenderer.invoke>>electronIpcRenderer.invoke).mockResolvedValue(res);

    createProcessProvider();

    expect(electronIpcRenderer.invoke).toBeCalledTimes(1);
    expect(electronIpcRenderer.invoke).toBeCalledWith(ipcGetProcessInfoChannel);
  })

  it('should deep freeze the process info', async () => {
    const res = {
      browser: { ver: '1.1' }
    };
    (<jest.MockedFunction<typeof electronIpcRenderer.invoke>>electronIpcRenderer.invoke).mockResolvedValue(res);

    const processProvider = await createProcessProvider();

    const gotVal = processProvider.getProcessInfo();

    expect(() => {
      gotVal.browser.ver = 'other string';
    }).toThrow();
  })

  describe('getProcessInfo', () => {
    it('should return the process info returned on init', async () => {
      const res = 'result';
      (<jest.MockedFunction<typeof electronIpcRenderer.invoke>>electronIpcRenderer.invoke).mockResolvedValue(res);
      const processProvider = await createProcessProvider();

      const gotVal = processProvider.getProcessInfo();

      expect(electronIpcRenderer.invoke).toBeCalledTimes(1);
      expect(gotVal).toBe(res);
    })
  })
});
