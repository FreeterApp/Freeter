/*
 * Copyright: (c) 2024, Alex Kaul
 * GNU General Public License v3.0 or later (see COPYING or https://www.gnu.org/licenses/gpl-3.0.txt)
 */

import { Controller } from '@/controllers/controller';
import { TerminalPtyManager } from '@/infra/terminalPty/terminalPtyManager';
import {
  ipcTerminalPtyCreateChannel,
  IpcTerminalPtyCreateArgs,
  IpcTerminalPtyCreateRes,
  ipcTerminalPtyWriteChannel,
  IpcTerminalPtyWriteArgs,
  IpcTerminalPtyWriteRes,
  ipcTerminalPtyResizeChannel,
  IpcTerminalPtyResizeArgs,
  IpcTerminalPtyResizeRes,
  ipcTerminalPtyCloseChannel,
  IpcTerminalPtyCloseArgs,
  IpcTerminalPtyCloseRes,
} from '@common/ipc/channels';

type Deps = {
  terminalPtyManager: TerminalPtyManager;
};

export function createTerminalPtyControllers({ terminalPtyManager }: Deps): [
  Controller<IpcTerminalPtyCreateArgs, IpcTerminalPtyCreateRes>,
  Controller<IpcTerminalPtyWriteArgs, IpcTerminalPtyWriteRes>,
  Controller<IpcTerminalPtyResizeArgs, IpcTerminalPtyResizeRes>,
  Controller<IpcTerminalPtyCloseArgs, IpcTerminalPtyCloseRes>,
] {
  return [
    {
      channel: ipcTerminalPtyCreateChannel,
      handle: async (event, cols, rows, cwd) =>
        terminalPtyManager.createSession(event, cols, rows, cwd),
    },
    {
      channel: ipcTerminalPtyWriteChannel,
      handle: async (_event, sessionId, data) => {
        terminalPtyManager.write(sessionId, data);
      },
    },
    {
      channel: ipcTerminalPtyResizeChannel,
      handle: async (_event, sessionId, cols, rows) => {
        terminalPtyManager.resize(sessionId, cols, rows);
      },
    },
    {
      channel: ipcTerminalPtyCloseChannel,
      handle: async (_event, sessionId) => {
        terminalPtyManager.close(sessionId);
      },
    },
  ];
}
