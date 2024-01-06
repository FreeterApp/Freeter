/*
 * Copyright: (c) 2024, Alex Kaul
 * GNU General Public License v3.0 or later (see COPYING or https://www.gnu.org/licenses/gpl-3.0.txt)
 */

import { ipcMain as electronIpcMain, IpcMainEvent as ElectronIpcMainEvent, IpcMainInvokeEvent as ElectronIpcMainInvokeEvent, BrowserWindow as ElectronBrowserWindow, WebContents as ElectonWebContents } from 'electron';
import { IpcMain, IpcMainEvent, IpcMainEventValidator, IpcMainListener } from '@/controllers/interfaces/ipcMain';
import { BrowserWindow } from '@/application/interfaces/browserWindow';
import { WebContents } from '@/application/interfaces/webContents';

type ElectronIpcMainListener = (event: ElectronIpcMainEvent, ...args: unknown[]) => void;

function getBrowserWindowFromEventSender(sender: WebContents): BrowserWindow | null {
  return ElectronBrowserWindow.fromWebContents(sender as unknown as ElectonWebContents) as unknown as (BrowserWindow | null)
}

const electronEventToAppEvent: (event: ElectronIpcMainEvent | ElectronIpcMainInvokeEvent) => IpcMainEvent =
  event => ({
    sender: event.sender,
    senderFrame: event.senderFrame,
    isSenderFrameMain: event.senderFrame.parent === null,
    getSenderBrowserWindow: () => getBrowserWindowFromEventSender(event.sender)
  });

/**
 * Should be called **in `app.whenReady().then(...)`**
 */
export function createIpcMain(ipcMainEventValidator: IpcMainEventValidator): IpcMain {
  // Store wrappers for `removeListener`. A `WeakMap` prevents the garbage
  // collection of key-objects.
  const wrapperByListener = new WeakMap<IpcMainListener, ElectronIpcMainListener>();

  return {
    on(channel: string, listener: IpcMainListener): IpcMain {
      const wrappedListener: ElectronIpcMainListener = (_event, ...args) => {
        const event = electronEventToAppEvent(_event);
        if (ipcMainEventValidator(channel, event)) {
          listener(event, ...args);
        }
      };

      wrapperByListener.set(listener, wrappedListener);

      electronIpcMain.on(channel, wrappedListener);
      return this;
    },

    once(channel: string, listener: IpcMainListener): IpcMain {
      electronIpcMain.once(channel, (_event, ...args) => {
        const event = electronEventToAppEvent(_event);
        if (ipcMainEventValidator(channel, event)) {
          listener(event, ...args);
        }
      });
      return this;
    },

    handle(channel: string, listener: (event: IpcMainEvent, ...args: unknown[]) => Promise<unknown>): void {
      electronIpcMain.handle(channel, (_event, ...args) => {
        const event = electronEventToAppEvent(_event);
        if (ipcMainEventValidator(channel, event)) {
          return listener(event, ...args);
        }

        return Promise.reject(`IpcMain.handle(): Invalid channel '${channel}' or sender.`);
      });
    },

    removeHandler(channel: string): void {
      return electronIpcMain.removeHandler(channel);
    },

    removeListener(channel: string, listener: IpcMainListener): IpcMain {
      const wrappedListener = wrapperByListener.get(listener);
      if (wrappedListener) {
        electronIpcMain.removeListener(channel, wrappedListener);
        wrapperByListener.delete(listener);
      }
      return this;
    }
  }

}
