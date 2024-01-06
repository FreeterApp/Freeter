/*
 * Copyright: (c) 2024, Alex Kaul
 * GNU General Public License v3.0 or later (see COPYING or https://www.gnu.org/licenses/gpl-3.0.txt)
 */

import { ipcGetProcessInfoArgs, ipcGetProcessInfoChannel, ipcGetProcessInfoRes } from '@common/ipc/channels';
import { deepFreeze } from '@common/helpers/deepFreeze';
import { electronIpcRenderer } from '@/infra/globals';
import { ProcessProvider } from '@/application/interfaces/processProvider';

export async function createProcessProvider(): Promise<ProcessProvider> {
  const processInfo = deepFreeze(await electronIpcRenderer.invoke<ipcGetProcessInfoArgs, ipcGetProcessInfoRes>(
    ipcGetProcessInfoChannel
  ))
  return {
    getProcessInfo: () => processInfo
  }
}
