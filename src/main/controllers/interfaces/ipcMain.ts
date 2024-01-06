/*
 * Copyright: (c) 2024, Alex Kaul
 * GNU General Public License v3.0 or later (see COPYING or https://www.gnu.org/licenses/gpl-3.0.txt)
 */

import { BrowserWindow } from '@/application/interfaces/browserWindow';
import { WebContents } from '@/application/interfaces/webContents';

export interface IpcMainEvent {
  sender: WebContents;
  senderFrame: {
    url: string;
  }
  isSenderFrameMain: boolean;
  getSenderBrowserWindow(): BrowserWindow | null;
}
export type IpcMainListener = (event: IpcMainEvent, ...args: unknown[]) => void;
export type IpcMainEventValidator = (channel: string, event: IpcMainEvent) => boolean;

export interface IpcMain {
  on(channel: string, listener: IpcMainListener): IpcMain;
  once(channel: string, listener: IpcMainListener): IpcMain;
  handle(channel: string, listener: (event: IpcMainEvent, ...args: unknown[]) => Promise<unknown>): void;
  removeHandler(channel: string): void;
  removeListener(channel: string, listener: IpcMainListener): IpcMain;
}
