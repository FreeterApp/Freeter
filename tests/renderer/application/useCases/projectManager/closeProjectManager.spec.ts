/*
 * Copyright: (c) 2024, Alex Kaul
 * GNU General Public License v3.0 or later (see COPYING or https://www.gnu.org/licenses/gpl-3.0.txt)
 */

import { createCloseProjectManagerUseCase } from '@/application/useCases/projectManager/closeProjectManager';
import { AppState } from '@/base/state/app';
import { fixtureProjectA } from '@tests/base/fixtures/project';
import { fixtureAppState } from '@tests/base/state/fixtures/appState';
import { fixtureModalScreens, fixtureModalScreensData } from '@tests/base/state/fixtures/modalScreens';
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
  it('should remove the screen from the state', async () => {
    const initState = fixtureAppState({
      ui: {
        modalScreens: fixtureModalScreens({
          data: fixtureModalScreensData({
            projectManager: fixtureProjectManager({
              currentProjectId: 'SOME-ID',
              deleteProjectIds: { 'SOME-ID': false },
              projects: { 'SOME-ID': fixtureProjectA() },
              projectIds: ['SOME-ID']
            })
          }),
          order: ['about', 'projectManager']
        })
      }
    })
    const expectState: AppState = {
      ...initState,
      ui: {
        ...initState.ui,
        modalScreens: {
          ...initState.ui.modalScreens,
          data: {
            ...initState.ui.modalScreens.data,
            projectManager: {
              currentProjectId: '',
              deleteProjectIds: null,
              projects: null,
              projectIds: null
            }
          },
          order: ['about']
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
