/*
 * Copyright: (c) 2024, Alex Kaul
 * GNU General Public License v3.0 or later (see COPYING or https://www.gnu.org/licenses/gpl-3.0.txt)
 */

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
  ipcTerminalPtyDataChannel,
  IpcTerminalPtyDataArgs,
} from '@common/ipc/channels';
import { electronIpcRenderer } from '@/infra/mainApi/mainApi';

type PtyDataHandler = (data: string) => void;

const handlersBySession = new Map<string, Set<PtyDataHandler>>();
let isListenerBound = false;

function ensureDataListener() {
  if (isListenerBound) {
    return;
  }
  isListenerBound = true;
  electronIpcRenderer.on<IpcTerminalPtyDataArgs>(ipcTerminalPtyDataChannel, (sessionId, data) => {
    const handlers = handlersBySession.get(sessionId);
    if (!handlers) {
      return;
    }
    handlers.forEach(handler => handler(data));
  });
}

export function onTerminalPtyData(sessionId: string, handler: PtyDataHandler): () => void {
  ensureDataListener();
  let handlers = handlersBySession.get(sessionId);
  if (!handlers) {
    handlers = new Set<PtyDataHandler>();
    handlersBySession.set(sessionId, handlers);
  }
  handlers.add(handler);

  return () => {
    const current = handlersBySession.get(sessionId);
    if (!current) {
      return;
    }
    current.delete(handler);
    if (current.size === 0) {
      handlersBySession.delete(sessionId);
    }
  };
}

export async function createTerminalPtySession(cols: number, rows: number, cwd?: string): Promise<string> {
  ensureDataListener();
  return electronIpcRenderer.invoke<IpcTerminalPtyCreateArgs, IpcTerminalPtyCreateRes>(
    ipcTerminalPtyCreateChannel,
    cols,
    rows,
    cwd
  );
}

export async function writeTerminalPty(sessionId: string, data: string): Promise<void> {
  return electronIpcRenderer.invoke<IpcTerminalPtyWriteArgs, IpcTerminalPtyWriteRes>(
    ipcTerminalPtyWriteChannel,
    sessionId,
    data
  );
}

export async function resizeTerminalPty(sessionId: string, cols: number, rows: number): Promise<void> {
  return electronIpcRenderer.invoke<IpcTerminalPtyResizeArgs, IpcTerminalPtyResizeRes>(
    ipcTerminalPtyResizeChannel,
    sessionId,
    cols,
    rows
  );
}

export async function closeTerminalPty(sessionId: string): Promise<void> {
  return electronIpcRenderer.invoke<IpcTerminalPtyCloseArgs, IpcTerminalPtyCloseRes>(
    ipcTerminalPtyCloseChannel,
    sessionId
  );
}
