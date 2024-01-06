/*
 * Copyright: (c) 2024, Alex Kaul
 * GNU General Public License v3.0 or later (see COPYING or https://www.gnu.org/licenses/gpl-3.0.txt)
 */

import { createToggleDeletionInProjectManagerUseCase } from '@/application/useCases/projectManager/toggleDeletionInProjectManager';
import { AppState } from '@/base/state/app';
import { fixtureAppState } from '@tests/base/state/fixtures/appState';
import { fixtureProjectManager } from '@tests/base/state/fixtures/projectManager';
import { fixtureAppStore } from '@tests/data/fixtures/appStore';

const projectId = 'PROJECT-ID';

async function setup(initState: AppState) {
  const [appStore] = await fixtureAppStore(initState);
  const toggleDeletionInProjectManagerUseCase = createToggleDeletionInProjectManagerUseCase({
    appStore
  });
  return {
    appStore,
    toggleDeletionInProjectManagerUseCase
  }
}

describe('toggleDeletionInProjectManagerUseCase()', () => {
  it('should do nothing, if deleteProjectIds is null', async () => {
    const initState = fixtureAppState({
      ui: {
        projectManager: fixtureProjectManager({
          deleteProjectIds: null,
        })
      }
    })
    const {
      appStore,
      toggleDeletionInProjectManagerUseCase
    } = await setup(initState)
    const expectState = appStore.get();

    toggleDeletionInProjectManagerUseCase(projectId);

    const newState = appStore.get();
    expect(newState).toEqual(expectState);
  })

  it('should set true for the specified project id, when the current value is undefined', async () => {
    const initState = fixtureAppState({
      ui: {
        projectManager: fixtureProjectManager({
          deleteProjectIds: { 'some-project': true },
        })
      }
    })
    const expectState: AppState = {
      ...initState,
      ui: {
        ...initState.ui,
        projectManager: {
          ...initState.ui.projectManager,
          deleteProjectIds: {
            ...initState.ui.projectManager.deleteProjectIds,
            [projectId]: true
          },
        }
      }
    }
    const {
      appStore,
      toggleDeletionInProjectManagerUseCase
    } = await setup(initState)

    toggleDeletionInProjectManagerUseCase(projectId);

    const newState = appStore.get();
    expect(newState).toEqual(expectState);
  })

  it('should set true for the specified project id, when the current value is false', async () => {
    const initState = fixtureAppState({
      ui: {
        projectManager: fixtureProjectManager({
          deleteProjectIds: {
            'some-project': true,
            [projectId]: false
          },
        })
      }
    })
    const expectState: AppState = {
      ...initState,
      ui: {
        ...initState.ui,
        projectManager: {
          ...initState.ui.projectManager,
          deleteProjectIds: {
            ...initState.ui.projectManager.deleteProjectIds,
            [projectId]: true
          },
        }
      }
    }
    const {
      appStore,
      toggleDeletionInProjectManagerUseCase
    } = await setup(initState)

    toggleDeletionInProjectManagerUseCase(projectId);

    const newState = appStore.get();
    expect(newState).toEqual(expectState);
  })

  it('should set false for the specified project id, when the current value is true', async () => {
    const initState = fixtureAppState({
      ui: {
        projectManager: fixtureProjectManager({
          deleteProjectIds: {
            'some-project': true,
            [projectId]: true
          },
        })
      }
    })
    const expectState: AppState = {
      ...initState,
      ui: {
        ...initState.ui,
        projectManager: {
          ...initState.ui.projectManager,
          deleteProjectIds: {
            ...initState.ui.projectManager.deleteProjectIds,
            [projectId]: false
          },
        }
      }
    }
    const {
      appStore,
      toggleDeletionInProjectManagerUseCase
    } = await setup(initState)

    toggleDeletionInProjectManagerUseCase(projectId);

    const newState = appStore.get();
    expect(newState).toEqual(expectState);
  })
})
