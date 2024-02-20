/*
 * Copyright: (c) 2024, Alex Kaul
 * GNU General Public License v3.0 or later (see COPYING or https://www.gnu.org/licenses/gpl-3.0.txt)
 */

import { Controller } from '@/controllers/controller';
import { IpcShellOpenExternalUrlArgs, ipcShellOpenExternalUrlChannel, IpcShellOpenExternalUrlRes } from '@common/ipc/channels';
import { OpenExternalUrlUseCase } from '@/application/useCases/shell/openExternalUrl';

type Deps = {
  openExternalUrlUseCase: OpenExternalUrlUseCase;
}

export function createShellControllers({
  openExternalUrlUseCase,
}: Deps): [
    Controller<IpcShellOpenExternalUrlArgs, IpcShellOpenExternalUrlRes>,
  ] {
  return [{
    channel: ipcShellOpenExternalUrlChannel,
    handle: async (_event, url) => openExternalUrlUseCase(url)
  }]
}
