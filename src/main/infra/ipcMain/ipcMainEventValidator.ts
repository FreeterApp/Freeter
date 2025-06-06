/*
 * Copyright: (c) 2024, Alex Kaul
 * GNU General Public License v3.0 or later (see COPYING or https://www.gnu.org/licenses/gpl-3.0.txt)
 */

import { IpcMainEventValidator } from '@/controllers/interfaces/ipcMain';

export function createIpcMainEventValidator(channelPrefix: string, authority: string): IpcMainEventValidator {
  return (channel, event) => {
    if (!channel || !channel.startsWith(channelPrefix)) {
      console.error(`IpcMain event: Unknown channel '${channel}'.`)
      return false;
    }

    if (!event.senderFrame) {
      console.error('IpcMain event: No sender frame.')
      return false;
    }

    const { url } = event.senderFrame;
    const { isSenderFrameMain: isMainFrame } = event;

    let host = '';
    try {
      host = new URL(url).host;
    } catch (error) {
      console.error(`IpcMain event: Invalid URL '${url}' on channel '${channel}.`)
      return false;
    }

    if (host !== authority) {
      console.error(`IpcMain event: Bad origin of '${host}' on channel '${channel}.`)
      return false;
    }

    if (!isMainFrame) {
      console.error(`IpcMain event: Sender of origin '${host}' on channel '${channel} is not a main frame.`)
      return false;
    }

    return true;
  }
}
