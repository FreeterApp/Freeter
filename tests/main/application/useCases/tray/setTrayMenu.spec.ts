/*
 * Copyright: (c) 2024, Alex Kaul
 * GNU General Public License v3.0 or later (see COPYING or https://www.gnu.org/licenses/gpl-3.0.txt)
 */

import { BrowserWindow } from '@/application/interfaces/browserWindow';
import { TrayProvider } from '@/application/interfaces/trayProvider';
import { WebContents } from '@/application/interfaces/webContents';
import { createSetTrayMenuUseCase } from '@/application/useCases/tray/setTrayMenu';
import { MenuItems } from '@common/base/menu';
import { fixtureMenuItemA } from '@testscommon/base/fixtures/menu';

function setup() {
  const trayProviderMock: TrayProvider = {
    setMenu: jest.fn(async () => undefined),
    setMainAction: jest.fn()
  }
  const useCase = createSetTrayMenuUseCase({
    trayProvider: trayProviderMock
  });
  return {
    trayProviderMock,
    useCase
  }
}

describe('setTrayMenuUseCase()', () => {
  it('should call setMenu() of trayProvider with right params, when items is empty', async () => {
    const targetWin = { 'target': 'win' } as unknown as BrowserWindow;
    const actionsTarget = { 'actions': 'target' } as unknown as WebContents;
    const testItems: MenuItems = [];
    const expectItems = [
      expect.objectContaining({ label: 'Show Freeter' }),
      expect.objectContaining({ type: 'separator' }),
      expect.objectContaining({ role: 'quit' }),
    ]
    const { useCase, trayProviderMock } = setup()

    await useCase(testItems, targetWin, actionsTarget);

    expect(trayProviderMock.setMenu).toBeCalledTimes(1);
    expect(trayProviderMock.setMenu).toBeCalledWith(expectItems, actionsTarget);
  });

  it('should call setMenu() of trayProvider with right params, when items is not empty', async () => {
    const targetWin = { 'test': 'obj' } as unknown as BrowserWindow;
    const actionsTarget = { 'actions': 'target' } as unknown as WebContents;
    const testItems: MenuItems = [fixtureMenuItemA()];
    const expectItems = [
      expect.objectContaining({ label: 'Show Freeter' }),
      expect.objectContaining({ type: 'separator' }),
      ...testItems,
      expect.objectContaining({ type: 'separator' }),
      expect.objectContaining({ role: 'quit' }),
    ]
    const { useCase, trayProviderMock } = setup()

    await useCase(testItems, targetWin, actionsTarget);

    expect(trayProviderMock.setMenu).toBeCalledTimes(1);
    expect(trayProviderMock.setMenu).toBeCalledWith(expectItems, actionsTarget);
  });
})
