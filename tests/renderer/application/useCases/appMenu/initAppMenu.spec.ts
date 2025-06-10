/*
 * Copyright: (c) 2024, Alex Kaul
 * GNU General Public License v3.0 or later (see COPYING or https://www.gnu.org/licenses/gpl-3.0.txt)
 */

import { AppMenuProvider } from '@/application/interfaces/appMenuProvider';
import { ProcessProvider } from '@/application/interfaces/processProvider';
import { createInitAppMenuUseCase } from '@/application/useCases/appMenu/initAppMenu';
import { AppState } from '@/base/state/app';
import { ProcessInfo } from '@common/base/process';
import { fixtureAppState } from '@tests/base/state/fixtures/appState';
import { fixtureAppStore } from '@tests/data/fixtures/appStore';
import { mockShellProvider } from '@tests/infra/mocks/shellProvider';
import { fixtureProcessInfoLinux } from '@testscommon/base/fixtures/process'

async function setup(initState: AppState, opts?: {
  processInfo?: ProcessInfo
}) {
  const [appStore] = await fixtureAppStore(initState);
  const appMenuProviderMock: AppMenuProvider = {
    setMenu: jest.fn(),
    setAutoHide: jest.fn()
  }
  const processProviderMock: ProcessProvider = {
    getProcessInfo: () => opts?.processInfo || fixtureProcessInfoLinux()
  }
  const shellProviderMock = mockShellProvider({
    openExternal: jest.fn()
  })
  const toggleEditModeUseCase = jest.fn();
  const toggleMenuBarUseCase = jest.fn();
  const toggleTopBarUseCase = jest.fn();
  const setProjectSwitcherPositionUseCase = jest.fn();
  const openApplicationSettingsUseCase = jest.fn();
  const openAboutUseCase = jest.fn();
  const openAppManagerUseCase = jest.fn();
  const openProjectManagerUseCase = jest.fn();
  const initAppMenuUseCase = createInitAppMenuUseCase({
    appStore,
    appMenu: appMenuProviderMock,
    processProvider: processProviderMock,
    shellProvider: shellProviderMock,
    toggleEditModeUseCase,
    toggleMenuBarUseCase,
    toggleTopBarUseCase,
    setProjectSwitcherPositionUseCase,
    openApplicationSettingsUseCase,
    openAboutUseCase,
    openAppManagerUseCase,
    openProjectManagerUseCase,
  });
  return {
    appStore,
    appMenuProviderMock,
    shellProviderMock,
    initAppMenuUseCase,
    toggleEditModeUseCase,
    toggleMenuBarUseCase,
    toggleTopBarUseCase,
    setProjectSwitcherPositionUseCase,
    openAboutUseCase,
  }
}

describe('initAppMenuUseCase()', () => {
  it('should call appMenu\'s setAutoHide() right after call', async () => {
    const {
      initAppMenuUseCase,
      appMenuProviderMock,
    } = await setup(fixtureAppState({}))

    initAppMenuUseCase();

    expect(appMenuProviderMock.setAutoHide).toHaveBeenCalledTimes(1);
  });

  it('should subscribe to state changes and call appMenu\'s setAutoHide() with right params, when the menuBar state value changes', async () => {
    const state = fixtureAppState({ ui: { menuBar: false } })
    const {
      initAppMenuUseCase,
      appMenuProviderMock,
      appStore
    } = await setup(state)

    initAppMenuUseCase();

    appStore.set({
      ...state,
      ui: {
        ...state.ui,
        menuBar: true
      }
    })

    expect(appMenuProviderMock.setAutoHide).toHaveBeenCalledTimes(2);
    expect(appMenuProviderMock.setAutoHide).toHaveBeenNthCalledWith(2, false);

    appStore.set({
      ...state,
      ui: {
        ...state.ui,
        menuBar: false
      }
    })

    expect(appMenuProviderMock.setAutoHide).toHaveBeenNthCalledWith(3, true);
  });

  it('should not call appMenu\'s setAutoHide(), when non menuBar state changes', async () => {
    const state = fixtureAppState({ ui: { editMode: false } })
    const {
      initAppMenuUseCase,
      appMenuProviderMock,
      appStore
    } = await setup(state)

    initAppMenuUseCase();

    appStore.set({
      ...state,
      ui: {
        ...state.ui,
        editMode: true
      }
    })

    expect(appMenuProviderMock.setAutoHide).toHaveBeenCalledTimes(1);
  });

  it('should not call appMenu\'s setAutoHide(), when the new state has isLoading=true', async () => {
    const state = fixtureAppState({ ui: { menuBar: true } });
    const {
      initAppMenuUseCase,
      appMenuProviderMock,
      appStore
    } = await setup(state)

    initAppMenuUseCase();

    appStore.set({ ...state, isLoading: true, ui: { ...state.ui, menuBar: false } })

    expect(appMenuProviderMock.setAutoHide).toHaveBeenCalledTimes(1);
  });

  it('should call appMenu\'s setAutoHide(), when the new state has isLoading=undefined', async () => {
    const { isLoading: _, ...state } = fixtureAppState({ ui: { menuBar: true } });
    const {
      initAppMenuUseCase,
      appMenuProviderMock,
      appStore
    } = await setup(state)

    initAppMenuUseCase();

    appStore.set({ ...state, ui: { ...state.ui, menuBar: false } })

    expect(appMenuProviderMock.setAutoHide).toHaveBeenCalledTimes(2);
  });

  it('should call appMenu\'s setMenu() right after call', async () => {
    const {
      initAppMenuUseCase,
      appMenuProviderMock,
    } = await setup(fixtureAppState({}))

    initAppMenuUseCase();

    expect(appMenuProviderMock.setMenu).toHaveBeenCalledTimes(1);
  });

  it('should subscribe to state changes and call appMenu\'s setMenu(), when the new state has changes the app menu depends on', async () => {
    const state = fixtureAppState({ ui: { editMode: false } })
    const {
      initAppMenuUseCase,
      appMenuProviderMock,
      appStore
    } = await setup(state)

    initAppMenuUseCase();

    appStore.set({
      ...state,
      ui: {
        ...state.ui,
        editMode: true
      }
    })

    expect(appMenuProviderMock.setMenu).toHaveBeenCalledTimes(2);
  });

  it('should not call appMenu\'s setMenu(), when the new state does not have changes the app menu depends on', async () => {
    const state = fixtureAppState({ ui: { editMode: false } })
    const {
      initAppMenuUseCase,
      appMenuProviderMock,
      appStore
    } = await setup(state)

    initAppMenuUseCase();

    appStore.set({
      ...state,
    })

    expect(appMenuProviderMock.setMenu).toHaveBeenCalledTimes(1);
  });

  it('should not call appMenu\'s setMenu(), when the new state has isLoading=true', async () => {
    const state = fixtureAppState({ ui: { editMode: true } });
    const {
      initAppMenuUseCase,
      appMenuProviderMock,
      appStore
    } = await setup(state)

    initAppMenuUseCase();

    appStore.set({ ...state, isLoading: true, ui: { ...state.ui, editMode: false } })

    expect(appMenuProviderMock.setMenu).toHaveBeenCalledTimes(1);
  });

  it('should call appMenu\'s setMenu(), when the new state has isLoading=undefined', async () => {
    const { isLoading: _, ...state } = fixtureAppState({ ui: { editMode: true } });
    const {
      initAppMenuUseCase,
      appMenuProviderMock,
      appStore
    } = await setup(state)

    initAppMenuUseCase();

    appStore.set({ ...state, ui: { ...state.ui, editMode: false } })

    expect(appMenuProviderMock.setMenu).toHaveBeenCalledTimes(2);
  });
})
