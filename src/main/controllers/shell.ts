/*
 * Copyright: (c) 2024, Alex Kaul
 * GNU General Public License v3.0 or later (see COPYING or https://www.gnu.org/licenses/gpl-3.0.txt)
 */

import { Controller } from '@/controllers/controller';
import { IpcShellOpenAppArgs, ipcShellOpenAppChannel, IpcShellOpenAppRes, IpcShellOpenExternalUrlArgs, ipcShellOpenExternalUrlChannel, IpcShellOpenExternalUrlRes, IpcShellOpenPathArgs, ipcShellOpenPathChannel, IpcShellOpenPathRes } from '@common/ipc/channels';
import { OpenExternalUrlUseCase } from '@/application/useCases/shell/openExternalUrl';
import { OpenPathUseCase } from '@/application/useCases/shell/openPath';
import { OpenAppUseCase } from '@/application/useCases/shell/openApp';

type Deps = {
  openAppUseCase: OpenAppUseCase;
  openExternalUrlUseCase: OpenExternalUrlUseCase;
  openPathUseCase: OpenPathUseCase;
}

export function createShellControllers({
  openAppUseCase,
  openExternalUrlUseCase,
  openPathUseCase,
}: Deps): [
    Controller<IpcShellOpenAppArgs, IpcShellOpenAppRes>,
    Controller<IpcShellOpenExternalUrlArgs, IpcShellOpenExternalUrlRes>,
    Controller<IpcShellOpenPathArgs, IpcShellOpenPathRes>,
  ] {
  return [{
    channel: ipcShellOpenAppChannel,
    handle: async (_event, appPath, args) => openAppUseCase(appPath, args)
  }, {
    channel: ipcShellOpenExternalUrlChannel,
    handle: async (_event, url) => openExternalUrlUseCase(url)
  }, {
    channel: ipcShellOpenPathChannel,
    handle: async (_event, path) => openPathUseCase(path)
  }]
}
