/*
 * Copyright: (c) 2024, Alex Kaul
 * GNU General Public License v3.0 or later (see COPYING or https://www.gnu.org/licenses/gpl-3.0.txt)
 */

import { Controller } from '@/controllers/controller';
import { ipcShellOpenExternalUrlArgs, ipcShellOpenExternalUrlChannel, ipcShellOpenExternalUrlRes } from '@common/ipc/channels';
import { OpenExternalUrlUseCase } from '@/application/useCases/shell/openExternalUrl';

type Deps = {
  openExternalUrlUseCase: OpenExternalUrlUseCase;
}

export function createShellControllers({
  openExternalUrlUseCase,
}: Deps): [
    Controller<ipcShellOpenExternalUrlArgs, ipcShellOpenExternalUrlRes>,
  ] {
  return [{
    channel: ipcShellOpenExternalUrlChannel,
    handle: async (_event, url) => openExternalUrlUseCase(url)
  }]
}
