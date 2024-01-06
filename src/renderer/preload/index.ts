/*
 * Copyright: (c) 2024, Alex Kaul
 * GNU General Public License v3.0 or later (see COPYING or https://www.gnu.org/licenses/gpl-3.0.txt)
 */

import { RendererGlobals } from '@/infra/interfaces/globals';
import { contextBridge, ipcRenderer as electronIpcRenderer } from 'electron';

type IpcRendererListener = (...args: unknown[]) => void;
type ElectronIpcRendererListener = (event: Electron.IpcRendererEvent, ...args: unknown[]) => void;
const wrapperByListener = new WeakMap<IpcRendererListener, ElectronIpcRendererListener>();

const globals: RendererGlobals = {
  electronIpcRenderer: {
    invoke: electronIpcRenderer.invoke,

    // Dropping Event in listener for security reason, to make ipcRenderer unaccessible
    on: ((channel: string, listener: IpcRendererListener) => {
      const wrappedListener: ElectronIpcRendererListener = (_, ...args) => listener(...args);
      wrapperByListener.set(listener, wrappedListener);
      return electronIpcRenderer.on(channel, (_, ...args) => listener(...args))
    }) as RendererGlobals['electronIpcRenderer']['on'],

    // Dropping Event in listener for security reason, to make ipcRenderer unaccessible
    once: ((channel: string, listener: IpcRendererListener) =>
      electronIpcRenderer.once(channel, (_, ...args) => listener(...args))) as RendererGlobals['electronIpcRenderer']['once'],

    removeListener: ((channel: string, listener: IpcRendererListener) => {
      const wrappedListener = wrapperByListener.get(listener);
      if (wrappedListener) {
        electronIpcRenderer.removeListener(channel, wrappedListener);
        wrapperByListener.delete(listener);
      }
      return globals.electronIpcRenderer;
    }) as RendererGlobals['electronIpcRenderer']['removeListener'],

    send: electronIpcRenderer.send,
  }
}

contextBridge.exposeInMainWorld('freeter', globals);
