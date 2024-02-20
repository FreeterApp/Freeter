/*
 * Copyright: (c) 2024, Alex Kaul
 * GNU General Public License v3.0 or later (see COPYING or https://www.gnu.org/licenses/gpl-3.0.txt)
 */

import { GlobalShortcutProvider } from '@/application/interfaces/globalShortcutProvider';
import { createInitMainShortcutUseCase } from '@/application/useCases/globalShortcut/initMainShortcut';
import { AppState } from '@/base/state/app';
import { fixtureAppConfig } from '@tests/base/fixtures/appConfig';
import { fixtureAppState } from '@tests/base/state/fixtures/appState';
import { fixtureAppStore } from '@tests/data/fixtures/appStore';

async function setup(initState: AppState) {
  const [appStore] = await fixtureAppStore(initState);
  const globalShortcutProviderMock: GlobalShortcutProvider = {
    setMainShortcut: jest.fn()
  }
  const toggleEditModeUseCase = jest.fn();
  const toggleMenuBarUseCase = jest.fn();
  const initMainShortcutUseCase = createInitMainShortcutUseCase({
    appStore, globalShortcut: globalShortcutProviderMock
  });
  return {
    appStore,
    globalShortcutProviderMock,
    initMainShortcutUseCase,
    toggleEditModeUseCase,
    toggleMenuBarUseCase
  }
}

describe('initMainShortcutUseCase()', () => {
  it('should call mainShortcut\'s setMainShortcut() right after call', async () => {
    const {
      initMainShortcutUseCase,
      globalShortcutProviderMock,
    } = await setup(fixtureAppState({}))

    initMainShortcutUseCase();

    expect(globalShortcutProviderMock.setMainShortcut).toBeCalledTimes(1);
  });

  it('should subscribe to state changes and call mainShortcut\'s setMainShortcut() with right params, when the mainHotkey state value changes', async () => {
    const accelerator = 'Accelerator';
    const state = fixtureAppState({ ui: { appConfig: fixtureAppConfig({ mainHotkey: '' }) } })
    const {
      initMainShortcutUseCase,
      globalShortcutProviderMock,
      appStore
    } = await setup(state)

    initMainShortcutUseCase();

    appStore.set({
      ...state,
      ui: {
        ...state.ui,
        appConfig: {
          ...state.ui.appConfig,
          mainHotkey: accelerator
        }
      }
    })

    expect(globalShortcutProviderMock.setMainShortcut).toBeCalledTimes(2);
    expect(globalShortcutProviderMock.setMainShortcut).toHaveBeenNthCalledWith(2, accelerator);
  });

  it('should not call mainShortcut\'s setMainShortcut(), when non mainHotkey state changes', async () => {
    const state = fixtureAppState({ ui: { editMode: false } })
    const {
      initMainShortcutUseCase,
      globalShortcutProviderMock,
      appStore
    } = await setup(state)

    initMainShortcutUseCase();

    appStore.set({
      ...state,
      ui: {
        ...state.ui,
        editMode: true
      }
    })

    expect(globalShortcutProviderMock.setMainShortcut).toBeCalledTimes(1);
  });

  it('should not call mainShortcut\'s setMainShortcut(), when the new state has isLoading=true', async () => {
    const state = fixtureAppState({ ui: { appConfig: fixtureAppConfig({ mainHotkey: '' }) } });
    const {
      initMainShortcutUseCase,
      globalShortcutProviderMock,
      appStore
    } = await setup(state)

    initMainShortcutUseCase();

    appStore.set({ ...state, isLoading: true, ui: { ...state.ui, appConfig: { ...state.ui.appConfig, mainHotkey: 'accelerator' } } })

    expect(globalShortcutProviderMock.setMainShortcut).toBeCalledTimes(1);
  });

  it('should call mainShortcut\'s setMainShortcut(), when the new state has isLoading=undefined', async () => {
    const { isLoading: _, ...state } = fixtureAppState({ ui: { appConfig: fixtureAppConfig({ mainHotkey: '' }) } });
    const {
      initMainShortcutUseCase,
      globalShortcutProviderMock,
      appStore
    } = await setup(state)

    initMainShortcutUseCase();

    appStore.set({ ...state, ui: { ...state.ui, appConfig: { ...state.ui.appConfig, mainHotkey: 'accelerator' } } })

    expect(globalShortcutProviderMock.setMainShortcut).toBeCalledTimes(2);
  });

})
