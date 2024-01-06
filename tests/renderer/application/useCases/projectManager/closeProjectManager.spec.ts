/*
 * Copyright: (c) 2024, Alex Kaul
 * GNU General Public License v3.0 or later (see COPYING or https://www.gnu.org/licenses/gpl-3.0.txt)
 */

import { createCloseProjectManagerUseCase } from '@/application/useCases/projectManager/closeProjectManager';
import { AppState } from '@/base/state/app';
import { fixtureProjectA } from '@tests/base/fixtures/project';
import { fixtureAppState } from '@tests/base/state/fixtures/appState';
import { fixtureProjectManager } from '@tests/base/state/fixtures/projectManager';
import { fixtureAppStore } from '@tests/data/fixtures/appStore';

async function setup(initState: AppState) {
  const [appStore] = await fixtureAppStore(initState);
  const closeProjectManagerUseCase = createCloseProjectManagerUseCase({
    appStore
  });
  return {
    appStore,
    closeProjectManagerUseCase
  }
}

describe('closeProjectManagerUseCase()', () => {
  it('should clear the state', async () => {
    const initState = fixtureAppState({
      ui: {
        projectManager: fixtureProjectManager({
          currentProjectId: 'SOME-ID',
          deleteProjectIds: { 'SOME-ID': false },
          projects: { 'SOME-ID': fixtureProjectA() },
          projectIds: ['SOME-ID']
        })
      }
    })
    const expectState: AppState = {
      ...initState,
      ui: {
        ...initState.ui,
        projectManager: {
          currentProjectId: '',
          deleteProjectIds: null,
          projects: null,
          projectIds: null
        }
      }
    }
    const {
      appStore,
      closeProjectManagerUseCase
    } = await setup(initState)

    closeProjectManagerUseCase();

    const newState = appStore.get();
    expect(newState).toEqual(expectState);
  })
})
