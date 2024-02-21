/*
 * Copyright: (c) 2024, Alex Kaul
 * GNU General Public License v3.0 or later (see COPYING or https://www.gnu.org/licenses/gpl-3.0.txt)
 */

import { createIpcMainEventValidator } from '@/infra/ipcMain/ipcMainEventValidator'
import { fixtureIpcMainEvent } from '@tests/infra/mocks/ipcMain';

describe('ipcMainEventValidator()', () => {
  it('should return false for invalid channels', () => {
    const ipcMainEventValidator = createIpcMainEventValidator('chan:', 'auth');
    const event = fixtureIpcMainEvent({
      senderFrame: {
        url: 'scheme://auth/'
      },
      isSenderFrameMain: true
    });

    const res = ipcMainEventValidator('notchan:action', event);

    expect(res).toBe(false);
  })

  it('should return false for invalid urls', () => {
    const ipcMainEventValidator = createIpcMainEventValidator('chan:', 'auth');
    const event = fixtureIpcMainEvent({
      senderFrame: {
        url: 'invalid-url'
      },
      isSenderFrameMain: true
    });

    const res = ipcMainEventValidator('chan:action', event);

    expect(res).toBe(false);
  })

  it('should return false for invalid authorities', () => {
    const ipcMainEventValidator = createIpcMainEventValidator('chan:', 'auth');
    const event = fixtureIpcMainEvent({
      senderFrame: {
        url: 'scheme://invalid-auth/'
      },
      isSenderFrameMain: true
    });

    const res = ipcMainEventValidator('chan:action', event);

    expect(res).toBe(false);
  })

  it('should return false for events coming from a non-main frame', () => {
    const ipcMainEventValidator = createIpcMainEventValidator('chan:', 'auth');
    const event = fixtureIpcMainEvent({
      senderFrame: {
        url: 'scheme://auth/'
      },
      isSenderFrameMain: false
    });

    const res = ipcMainEventValidator('chan:action', event);

    expect(res).toBe(false);
  })

  it('should return true for valid events', () => {
    const ipcMainEventValidator = createIpcMainEventValidator('chan:', 'auth');
    const event = fixtureIpcMainEvent({
      senderFrame: {
        url: 'scheme://auth/'
      },
      isSenderFrameMain: true
    });

    const res = ipcMainEventValidator('chan:action', event);

    expect(res).toBe(true);
  })
})
