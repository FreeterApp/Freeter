/*
 * Copyright: (c) 2024, Alex Kaul
 * GNU General Public License v3.0 or later (see COPYING or https://www.gnu.org/licenses/gpl-3.0.txt)
 */

import { Controller } from '@/controllers/controller';
import { IpcGetProcessInfoArgs, ipcGetProcessInfoChannel, IpcGetProcessInfoRes } from '@common/ipc/channels';
import { GetProcessInfoUseCase } from '@/application/useCases/process/getProcessInfo';

type Deps = {
  getProcessInfoUseCase: GetProcessInfoUseCase;
}

export function createProcessControllers({
  getProcessInfoUseCase,
}: Deps): [
    Controller<IpcGetProcessInfoArgs, IpcGetProcessInfoRes>,
  ] {
  return [{
    channel: ipcGetProcessInfoChannel,
    handle: async (_event) => getProcessInfoUseCase()
  }]
}
