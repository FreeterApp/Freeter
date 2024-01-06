/*
 * Copyright: (c) 2024, Alex Kaul
 * GNU General Public License v3.0 or later (see COPYING or https://www.gnu.org/licenses/gpl-3.0.txt)
 */

import { createUpdateProjectsOrderInProjectManagerUseCase } from '@/application/useCases/projectManager/updateProjectsOrderInProjectManager';
import { EntityIdList } from '@/base/entityList';
import { AppState } from '@/base/state/app';
import { fixtureAppState } from '@tests/base/state/fixtures/appState';
import { fixtureProjectManager } from '@tests/base/state/fixtures/projectManager';
import { fixtureAppStore } from '@tests/data/fixtures/appStore';

async function setup(initState: AppState) {
  const [appStore] = await fixtureAppStore(initState);
  const updateProjectsOrderInProjectManagerUseCase = createUpdateProjectsOrderInProjectManagerUseCase({
    appStore
  });
  return {
    appStore,
    updateProjectsOrderInProjectManagerUseCase
  }
}

describe('updateProjectsOrderInProjectManagerUseCase()', () => {
  it('should do nothing, if projectIds is null', async () => {
    const initState = fixtureAppState({
      ui: {
        projectManager: fixtureProjectManager({
          projectIds: null
        })
      }
    })
    const {
      appStore,
      updateProjectsOrderInProjectManagerUseCase
    } = await setup(initState)

    const expectState = appStore.get();
    updateProjectsOrderInProjectManagerUseCase(['SOME-ID']);

    expect(appStore.get()).toBe(expectState);
  })

  it('should update the projectIds', async () => {
    const newProjectIds: EntityIdList = ['PRJ-ID-2', 'PRJ-ID-1']
    const initState = fixtureAppState({
      ui: {
        projectManager: fixtureProjectManager({
          projectIds: ['PRJ-ID-1', 'PRJ-ID-2']
        })
      }
    })
    const expectState: AppState = {
      ...initState,
      ui: {
        ...initState.ui,
        projectManager: {
          ...initState.ui.projectManager,
          projectIds: newProjectIds
        }
      }
    }
    const {
      appStore,
      updateProjectsOrderInProjectManagerUseCase
    } = await setup(initState)

    updateProjectsOrderInProjectManagerUseCase(newProjectIds);

    const newState = appStore.get();
    expect(newState).toEqual(expectState);
  })
})
