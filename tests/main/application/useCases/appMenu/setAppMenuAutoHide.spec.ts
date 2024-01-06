/*
 * Copyright: (c) 2024, Alex Kaul
 * GNU General Public License v3.0 or later (see COPYING or https://www.gnu.org/licenses/gpl-3.0.txt)
 */

import { AppMenuProvider } from '@/application/interfaces/appMenuProvider';
import { BrowserWindow } from '@/application/interfaces/browserWindow';
import { createSetAppMenuAutoHideUseCase } from '@/application/useCases/appMenu/setAppMenuAutoHide';

function setup() {
  const appMenuProviderMock: AppMenuProvider = {
    setMenu: jest.fn(async () => undefined),
    setAutoHide: jest.fn(async () => undefined)
  }
  const useCase = createSetAppMenuAutoHideUseCase({
    appMenuProvider: appMenuProviderMock
  });
  return {
    appMenuProviderMock,
    useCase
  }
}

describe('setAppMenuAutoHideUseCase()', () => {
  it('should call setAutoHide() of appMenuProvider with right params and return a right val', async () => {
    const actionsWin = { 'test': 'obj' } as unknown as BrowserWindow;
    const { useCase, appMenuProviderMock } = setup()

    await useCase(true, actionsWin);

    expect(appMenuProviderMock.setAutoHide).toBeCalledTimes(1);
    expect(appMenuProviderMock.setAutoHide).toBeCalledWith(true, actionsWin);

    await useCase(false, actionsWin);

    expect(appMenuProviderMock.setAutoHide).toHaveBeenNthCalledWith(2, false, actionsWin);
  });
})
