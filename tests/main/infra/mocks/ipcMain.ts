/*
 * Copyright: (c) 2024, Alex Kaul
 * GNU General Public License v3.0 or later (see COPYING or https://www.gnu.org/licenses/gpl-3.0.txt)
 */

import { IpcMainEvent as ElectronIpcMainEvent } from 'electron';
import { IpcMain, IpcMainEvent } from '@/controllers/interfaces/ipcMain';
import { makeFixture } from '@utils/makeFixture';

const electronIpcMainEvent = {
  sender: {
    send: () => undefined
  },
  senderFrame: {
    parent: null,
    url: 'some://url/'
  }
} as unknown as ElectronIpcMainEvent; // subset of properties needed for tests

const ipcMainEvent: IpcMainEvent = {
  getSenderBrowserWindow: () => null,
  sender: {
    send: () => undefined
  },
  senderFrame: { ...electronIpcMainEvent.senderFrame } as IpcMainEvent['senderFrame'],
  isSenderFrameMain: true
}

export const mockIpcMain = (): IpcMain => ({
  handle: jest.fn(),
  on: jest.fn(),
  once: jest.fn(),
  removeHandler: jest.fn(),
  removeListener: jest.fn()
});

export const fixtureIpcMainEvent = makeFixture(ipcMainEvent);
export const fixtureElectronIpcMainEvent = makeFixture(electronIpcMainEvent);
