/*
 * Copyright: (c) 2024, Alex Kaul
 * GNU General Public License v3.0 or later (see COPYING or https://www.gnu.org/licenses/gpl-3.0.txt)
 */

import { Controller } from '@/controllers/controller';
import { IpcShellOpenExternalUrlArgs, ipcShellOpenExternalUrlChannel, IpcShellOpenExternalUrlRes, IpcShellOpenPathArgs, ipcShellOpenPathChannel, IpcShellOpenPathRes } from '@common/ipc/channels';
import { OpenExternalUrlUseCase } from '@/application/useCases/shell/openExternalUrl';
import { OpenPathUseCase } from '@/application/useCases/shell/openPath';

type Deps = {
  openExternalUrlUseCase: OpenExternalUrlUseCase;
  openPathUseCase: OpenPathUseCase;
}

export function createShellControllers({
  openExternalUrlUseCase,
  openPathUseCase,
}: Deps): [
    Controller<IpcShellOpenExternalUrlArgs, IpcShellOpenExternalUrlRes>,
    Controller<IpcShellOpenPathArgs, IpcShellOpenPathRes>,
  ] {
  return [{
    channel: ipcShellOpenExternalUrlChannel,
    handle: async (_event, url) => openExternalUrlUseCase(url)
  }, {
    channel: ipcShellOpenPathChannel,
    handle: async (_event, path) => openPathUseCase(path)
  }]
}
