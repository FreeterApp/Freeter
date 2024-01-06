/*
 * Copyright: (c) 2024, Alex Kaul
 * GNU General Public License v3.0 or later (see COPYING or https://www.gnu.org/licenses/gpl-3.0.txt)
 */

import { TrayMenuProvider } from '@/application/interfaces/trayMenuProvider';
import { createInitTrayMenuUseCase } from '@/application/useCases/trayMenu/initTrayMenu';
import { AppState } from '@/base/state/app';
import { fixtureAppState } from '@tests/base/state/fixtures/appState';
import { fixtureProjectSwitcher } from '@tests/base/state/fixtures/projectSwitcher';
import { fixtureAppStore } from '@tests/data/fixtures/appStore';

async function setup(initState: AppState) {
  const [appStore] = await fixtureAppStore(initState);
  const trayMenuProviderMock: TrayMenuProvider = {
    setMenu: jest.fn(),
  }
  const showBrowserWindowUseCase = jest.fn();
  const switchProjectUseCase = jest.fn();
  const initTrayMenuUseCase = createInitTrayMenuUseCase({
    appStore,
    showBrowserWindowUseCase,
    switchProjectUseCase,
    trayMenu: trayMenuProviderMock
  });
  return {
    initTrayMenuUseCase,
    appStore,
    showBrowserWindowUseCase,
    switchProjectUseCase,
    trayMenuProviderMock
  }
}

describe('initTrayMenuUseCase()', () => {
  it('should call trayMenu\'s setMenu() right after call', async () => {
    const {
      initTrayMenuUseCase,
      trayMenuProviderMock,
    } = await setup(fixtureAppState({}))

    initTrayMenuUseCase();

    expect(trayMenuProviderMock.setMenu).toBeCalledTimes(1);
  });

  it('should subscribe to state changes and call trayMenu\'s setMenu(), when the new state has changes the tray menu depends on', async () => {
    const state = fixtureAppState({ ui: { projectSwitcher: fixtureProjectSwitcher({ currentProjectId: 'prj1' }) } })
    const {
      initTrayMenuUseCase,
      trayMenuProviderMock,
      appStore
    } = await setup(state)

    initTrayMenuUseCase();

    appStore.set({
      ...state,
      ui: {
        ...state.ui,
        projectSwitcher: {
          ...state.ui.projectSwitcher,
          currentProjectId: 'new project'
        }
      }
    })

    expect(trayMenuProviderMock.setMenu).toBeCalledTimes(2);
  });

  it('should not call trayMenu\'s setMenu(), when the new state does not have changes the tray menu depends on', async () => {
    const state = fixtureAppState({ ui: { editMode: false } })
    const {
      initTrayMenuUseCase,
      trayMenuProviderMock,
      appStore
    } = await setup(state)

    initTrayMenuUseCase();

    appStore.set({
      ...state,
      ui: {
        ...state.ui,
        editMode: true
      }
    })

    expect(trayMenuProviderMock.setMenu).toBeCalledTimes(1);
  });

  it('should not call trayMenu\'s setMenu(), when the new state has isLoading=true', async () => {
    const state = fixtureAppState({ ui: { projectSwitcher: fixtureProjectSwitcher({ currentProjectId: 'prj1' }) } })
    const {
      initTrayMenuUseCase,
      trayMenuProviderMock,
      appStore
    } = await setup(state)

    initTrayMenuUseCase();

    appStore.set({
      ...state,
      isLoading: true,
      ui: {
        ...state.ui,
        projectSwitcher: {
          ...state.ui.projectSwitcher,
          currentProjectId: 'new project'
        }
      }
    })

    expect(trayMenuProviderMock.setMenu).toBeCalledTimes(1);
  });

  it('should call trayMenu\'s setMenu(), when the new state has isLoading=undefined', async () => {
    const { isLoading: _, ...state } = fixtureAppState({ ui: { projectSwitcher: fixtureProjectSwitcher({ currentProjectId: 'prj1' }) } })
    const {
      initTrayMenuUseCase,
      trayMenuProviderMock,
      appStore
    } = await setup(state)

    initTrayMenuUseCase();

    appStore.set({
      ...state,
      ui: {
        ...state.ui,
        projectSwitcher: {
          ...state.ui.projectSwitcher,
          currentProjectId: 'new project'
        }
      }
    })

    expect(trayMenuProviderMock.setMenu).toBeCalledTimes(2);
  });
})
