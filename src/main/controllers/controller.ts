/*
 * Copyright: (c) 2024, Alex Kaul
 * GNU General Public License v3.0 or later (see COPYING or https://www.gnu.org/licenses/gpl-3.0.txt)
 */

import { IpcMain, IpcMainEvent } from '@/controllers/interfaces/ipcMain';

export interface Controller<TArgs extends unknown[] = unknown[], TRes = unknown> {
  channel: string;
  handle(event: IpcMainEvent, ...args: TArgs): Promise<TRes>;
}

export function registerControllers(ipcMain: IpcMain, controllers: Controller[]) {
  for (const { channel, handle } of controllers) {
    ipcMain.handle(channel, handle);
  }
}
