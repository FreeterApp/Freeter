/*
 * Copyright: (c) 2024, Alex Kaul
 * GNU General Public License v3.0 or later (see COPYING or https://www.gnu.org/licenses/gpl-3.0.txt)
 */

import { RendererGlobals } from '@/infra/interfaces/globals';
import { MainApi } from '@/infra/interfaces/mainApi';
import { contextBridge, ipcRenderer as electronIpcRenderer } from 'electron';

type IpcRendererListener = (...args: unknown[]) => void;
type ElectronIpcRendererListener = (event: Electron.IpcRendererEvent, ...args: unknown[]) => void;
const wrapperByListener = new WeakMap<IpcRendererListener, ElectronIpcRendererListener>();

const mainApi: MainApi = {
  electronIpcRenderer: {
    invoke: electronIpcRenderer.invoke,

    // Dropping Event in listener for security reason, to make ipcRenderer unaccessible
    on: ((channel: string, listener: IpcRendererListener) => {
      const wrappedListener: ElectronIpcRendererListener = (_, ...args) => listener(...args);
      wrapperByListener.set(listener, wrappedListener);
      return electronIpcRenderer.on(channel, (_, ...args) => listener(...args))
    }) as MainApi['electronIpcRenderer']['on'],

    // Dropping Event in listener for security reason, to make ipcRenderer unaccessible
    once: ((channel: string, listener: IpcRendererListener) =>
      electronIpcRenderer.once(channel, (_, ...args) => listener(...args))) as MainApi['electronIpcRenderer']['once'],

    removeListener: ((channel: string, listener: IpcRendererListener) => {
      const wrappedListener = wrapperByListener.get(listener);
      if (wrappedListener) {
        electronIpcRenderer.removeListener(channel, wrappedListener);
        wrapperByListener.delete(listener);
      }
      return mainApi.electronIpcRenderer;
    }) as MainApi['electronIpcRenderer']['removeListener'],

    send: electronIpcRenderer.send,
  }
}

let apiRequested = false;

const globals: RendererGlobals = {
  /**
   * For security reasons the MainApi object should not be stored in the global window object,
   * which can be accessed by any code running in the renderer process.
   * This function returns the MainApi object only once, to turn it into an isolated dependency
   * and make it unaccessible as a global var.
   */
  getMainApiOnce: () => {
    if (!apiRequested) {
      apiRequested = true;
      return mainApi;
    }
    return undefined;
  }
}

contextBridge.exposeInMainWorld('freeter', globals);
