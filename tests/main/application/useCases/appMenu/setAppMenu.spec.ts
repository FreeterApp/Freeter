/*
 * Copyright: (c) 2024, Alex Kaul
 * GNU General Public License v3.0 or later (see COPYING or https://www.gnu.org/licenses/gpl-3.0.txt)
 */

import { AppMenuProvider } from '@/application/interfaces/appMenuProvider';
import { WebContents } from '@/application/interfaces/webContents';
import { createSetAppMenuUseCase } from '@/application/useCases/appMenu/setAppMenu';
import { MenuItems } from '@common/base/menu';
import { fixtureMenuItemA } from '@testscommon/base/fixtures/menu';

function setup() {
  const appMenuProviderMock: AppMenuProvider = {
    setMenu: jest.fn(async () => undefined),
    setAutoHide: jest.fn(async () => undefined)
  }
  const useCase = createSetAppMenuUseCase({
    appMenuProvider: appMenuProviderMock
  });
  return {
    appMenuProviderMock,
    useCase
  }
}

describe('setAppMenuUseCase()', () => {
  it('should call setMenu() of appMenuProvider with right params and return a right val', async () => {
    const actionsTarget = { 'test': 'obj' } as unknown as WebContents;
    const testItems: MenuItems = [fixtureMenuItemA()];
    const { useCase, appMenuProviderMock } = setup()

    await useCase(testItems, actionsTarget);

    expect(appMenuProviderMock.setMenu).toBeCalledTimes(1);
    expect(appMenuProviderMock.setMenu).toBeCalledWith(testItems, actionsTarget);
  });
})
