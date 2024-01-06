/*
 * Copyright: (c) 2024, Alex Kaul
 * GNU General Public License v3.0 or later (see COPYING or https://www.gnu.org/licenses/gpl-3.0.txt)
 */

import { ipcMain as electronIpcMain } from 'electron';
import { createIpcMain } from '@/infra/ipcMain/ipcMain';
import { fixtureElectronIpcMainEvent, fixtureIpcMainEvent } from '@tests/infra/fixtures/ipcMain';

jest.mock('electron', () => ({
  ipcMain: {
    handle: jest.fn(),
    on: jest.fn(),
    once: jest.fn(),
    removeHandler: jest.fn(),
    removeListener: jest.fn()
  }
}));

function setup(validatorReturnVal = true) {
  jest.clearAllMocks();
  const ipcMainEventValidator = jest.fn(() => validatorReturnVal);
  const ipcMain = createIpcMain(ipcMainEventValidator);

  return {
    ipcMainEventValidator,
    ipcMain
  }
}

describe('IpcMain', () => {
  describe('on()', () => {
    it('should call Electron ipcMain\'s on() with right params', () => {
      const { ipcMain } = setup(true);

      ipcMain.on('chan', () => null);

      expect(electronIpcMain.on).toBeCalledTimes(1);
      expect(electronIpcMain.on).toBeCalledWith('chan', expect.anything());
    });

    describe('wrappedListener()', () => {
      it('should call the validator function with right params', () => {
        const { ipcMain, ipcMainEventValidator } = setup();
        ipcMain.on('chan', () => undefined);
        const wrappedListener = (<jest.Mock>electronIpcMain.on).mock.calls[0][1];
        const electronEvent = fixtureElectronIpcMainEvent();
        const event = fixtureIpcMainEvent({
          getSenderBrowserWindow: expect.any(Function),
          sender: electronEvent.sender,
          senderFrame: electronEvent.senderFrame,
          isSenderFrameMain: true
        })

        wrappedListener(electronEvent)

        expect(ipcMainEventValidator).toBeCalledTimes(1);
        expect(ipcMainEventValidator).toBeCalledWith('chan', event);
      });

      it('should call the original listener with right params, when the validator returns true', () => {
        const { ipcMain } = setup(true);
        const listener = jest.fn();
        ipcMain.on('chan', listener);
        const wrappedListener = (<jest.Mock>electronIpcMain.on).mock.calls[0][1];
        const electronEvent = fixtureElectronIpcMainEvent();
        const event = fixtureIpcMainEvent({
          getSenderBrowserWindow: expect.any(Function),
          sender: electronEvent.sender,
          senderFrame: electronEvent.senderFrame,
          isSenderFrameMain: true
        })
        const arg1 = 123;
        const arg2 = 'abc';

        wrappedListener(electronEvent, arg1, arg2)

        expect(listener).toBeCalledTimes(1);
        expect(listener).toBeCalledWith(event, arg1, arg2);
      });

      it('should not call the original listener, when the validator returns false', () => {
        const { ipcMain } = setup(false);
        const listener = jest.fn();
        ipcMain.on('chan', listener);
        const wrappedListener = (<jest.Mock>electronIpcMain.on).mock.calls[0][1];
        const event = fixtureElectronIpcMainEvent();

        wrappedListener(event, 123)

        expect(listener).toBeCalledTimes(0);
      });
    })
  })

  describe('once()', () => {
    it('should call Electron ipcMain\'s once() with right params', () => {
      const { ipcMain } = setup();

      ipcMain.once('chan', () => null);

      expect(electronIpcMain.once).toBeCalledTimes(1);
      expect(electronIpcMain.once).toBeCalledWith('chan', expect.anything());
    });


    describe('wrappedListener()', () => {
      it('should call the validator function with right params', () => {
        const { ipcMain, ipcMainEventValidator } = setup();
        ipcMain.once('chan', () => undefined);
        const wrappedListener = (<jest.Mock>electronIpcMain.once).mock.calls[0][1];
        const electronEvent = fixtureElectronIpcMainEvent();
        const event = fixtureIpcMainEvent({
          getSenderBrowserWindow: expect.any(Function),
          sender: electronEvent.sender,
          senderFrame: electronEvent.senderFrame,
          isSenderFrameMain: true
        })

        wrappedListener(electronEvent)

        expect(ipcMainEventValidator).toBeCalledTimes(1);
        expect(ipcMainEventValidator).toBeCalledWith('chan', event);
      });

      it('should call the original listener with right params, when the validator returns true', () => {
        const { ipcMain } = setup(true);
        const listener = jest.fn();
        ipcMain.once('chan', listener);
        const wrappedListener = (<jest.Mock>electronIpcMain.once).mock.calls[0][1];
        const electronEvent = fixtureElectronIpcMainEvent();
        const event = fixtureIpcMainEvent({
          getSenderBrowserWindow: expect.any(Function),
          sender: electronEvent.sender,
          senderFrame: electronEvent.senderFrame,
          isSenderFrameMain: true
        })
        const arg1 = 123;
        const arg2 = 'abc';

        wrappedListener(electronEvent, arg1, arg2)

        expect(listener).toBeCalledTimes(1);
        expect(listener).toBeCalledWith(event, arg1, arg2);
      });

      it('should not call the original listener, when the validator returns false', () => {
        const { ipcMain } = setup(false);
        const listener = jest.fn();
        ipcMain.once('chan', listener);
        const wrappedListener = (<jest.Mock>electronIpcMain.once).mock.calls[0][1];
        const event = fixtureElectronIpcMainEvent();

        wrappedListener(event, 123)

        expect(listener).toBeCalledTimes(0);
      });
    })
  })

  describe('handle()', () => {
    it('should call Electron ipcMain\'s handle() with right params', () => {
      const { ipcMain } = setup();

      ipcMain.handle('chan', async () => undefined);

      expect(electronIpcMain.handle).toBeCalledTimes(1);
      expect(electronIpcMain.handle).toBeCalledWith('chan', expect.anything());
    });


    describe('wrappedListener()', () => {
      it('should call the validator function with right params', () => {
        const { ipcMain, ipcMainEventValidator } = setup();
        ipcMain.handle('chan', async () => undefined);
        const wrappedListener = (<jest.Mock>electronIpcMain.handle).mock.calls[0][1];
        const electronEvent = fixtureElectronIpcMainEvent();
        const event = fixtureIpcMainEvent({
          getSenderBrowserWindow: expect.any(Function),
          sender: electronEvent.sender,
          senderFrame: electronEvent.senderFrame,
          isSenderFrameMain: true
        })

        wrappedListener(electronEvent)

        expect(ipcMainEventValidator).toBeCalledTimes(1);
        expect(ipcMainEventValidator).toBeCalledWith('chan', event);
      });

      it('should call the original listener with right params, when the validator returns true', () => {
        const { ipcMain } = setup(true);
        const listener = jest.fn();
        ipcMain.handle('chan', listener);
        const wrappedListener = (<jest.Mock>electronIpcMain.handle).mock.calls[0][1];
        const electronEvent = fixtureElectronIpcMainEvent();
        const event = fixtureIpcMainEvent({
          getSenderBrowserWindow: expect.any(Function),
          sender: electronEvent.sender,
          senderFrame: electronEvent.senderFrame,
          isSenderFrameMain: true
        })
        const arg1 = 123;
        const arg2 = 'abc';

        wrappedListener(electronEvent, arg1, arg2)

        expect(listener).toBeCalledTimes(1);
        expect(listener).toBeCalledWith(event, arg1, arg2);
      });

      it('should not call the original listener and throw an error, when the validator returns false', async () => {
        const { ipcMain } = setup(false);
        const listener = jest.fn();
        ipcMain.handle('chan', listener);
        const wrappedListener = (<jest.Mock>electronIpcMain.handle).mock.calls[0][1];
        const event = fixtureElectronIpcMainEvent();

        await expect(wrappedListener(event, 123)).rejects.toMatch(/handle()/);

        expect(listener).toBeCalledTimes(0);
      });
    })
  })

  describe('removeHandler()', () => {
    it('should call Electron ipcMain\'s removeHandler() with right params', () => {
      const { ipcMain } = setup();

      ipcMain.removeHandler('chan');

      expect(electronIpcMain.removeHandler).toBeCalledTimes(1);
      expect(electronIpcMain.removeHandler).toBeCalledWith('chan');
    });
  })

  describe('removeListener()', () => {
    it('should not call Electron ipcMain\'s removeListener(), when removing unexisting listener', () => {
      const { ipcMain } = setup();

      ipcMain.removeListener('chan', () => null);

      expect(electronIpcMain.removeListener).toBeCalledTimes(0);
    });

    it('should not call Electron ipcMain\'s removeListener(), after removing listener', () => {
      const { ipcMain } = setup();
      const fn = () => null;
      ipcMain.on('chan', fn);

      ipcMain.removeListener('chan', fn);
      expect(electronIpcMain.removeListener).toBeCalledTimes(1);

      ipcMain.removeListener('chan', fn);
      expect(electronIpcMain.removeListener).toBeCalledTimes(1);
    });

    it('should call Electron ipcMain\'s removeListener() with right params, when removing existing listener', () => {
      const { ipcMain } = setup();
      const fn1 = () => null;
      const fn2 = () => null;
      ipcMain.on('chan', fn1);
      ipcMain.on('chan', fn2);
      const wrappedListener1 = (<jest.Mock>electronIpcMain.on).mock.calls[0][1];
      const wrappedListener2 = (<jest.Mock>electronIpcMain.on).mock.calls[1][1];

      ipcMain.removeListener('chan', fn1);
      expect(electronIpcMain.removeListener).toBeCalledTimes(1);
      expect(electronIpcMain.removeListener).toHaveBeenNthCalledWith(1, 'chan', wrappedListener1);

      ipcMain.removeListener('chan', fn2);
      expect(electronIpcMain.removeListener).toBeCalledTimes(2);
      expect(electronIpcMain.removeListener).toHaveBeenNthCalledWith(2, 'chan', wrappedListener2);
    });
  })
})
