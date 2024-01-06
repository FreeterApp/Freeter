/*
 * Copyright: (c) 2024, Alex Kaul
 * GNU General Public License v3.0 or later (see COPYING or https://www.gnu.org/licenses/gpl-3.0.txt)
 */

import { BrowserWindow } from '@/application/interfaces/browserWindow';
import { GlobalShortcutProvider } from '@/application/interfaces/globalShortcutProvider';
import { createSetMainShortcutUseCase } from '@/application/useCases/globalShortcut/setMainShortcut';

const providerRetVal = true;

function setup() {
  const globalShortcutProviderMock: GlobalShortcutProvider = {
    setMainShortcut: jest.fn(async () => providerRetVal),
    destroy: jest.fn()
  }
  const useCase = createSetMainShortcutUseCase({
    globalShortcutProvider: globalShortcutProviderMock
  });
  return {
    globalShortcutProviderMock,
    useCase
  }
}

describe('setMainShortcutUseCase()', () => {
  it('should call setMainShortcut() of globalShortcutProvider with right params and return a right val', async () => {
    const accelerator = 'Accelerator';
    const actionsWin = { 'test': 'obj' } as unknown as BrowserWindow;
    const { useCase, globalShortcutProviderMock } = setup()

    const res = await useCase(accelerator, actionsWin);

    expect(globalShortcutProviderMock.setMainShortcut).toBeCalledTimes(1);
    expect(globalShortcutProviderMock.setMainShortcut).toBeCalledWith(accelerator, actionsWin);
    expect(res).toBe(providerRetVal);
  });
})
