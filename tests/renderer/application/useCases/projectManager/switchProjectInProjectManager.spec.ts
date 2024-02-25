/*
 * Copyright: (c) 2024, Alex Kaul
 * GNU General Public License v3.0 or later (see COPYING or https://www.gnu.org/licenses/gpl-3.0.txt)
 */

import { createSwitchProjectInProjectManagerUseCase } from '@/application/useCases/projectManager/switchProjectInProjectManager';
import { AppState } from '@/base/state/app';
import { fixtureAppState } from '@tests/base/state/fixtures/appState';
import { fixtureModalScreens, fixtureModalScreensData } from '@tests/base/state/fixtures/modalScreens';
import { fixtureProjectManager } from '@tests/base/state/fixtures/projectManager';
import { fixtureAppStore } from '@tests/data/fixtures/appStore';

async function setup(initState: AppState) {
  const [appStore] = await fixtureAppStore(initState);
  const switchProjectInProjectManagerUseCase = createSwitchProjectInProjectManagerUseCase({
    appStore
  });
  return {
    appStore,
    switchProjectInProjectManagerUseCase
  }
}

describe('switchProjectInProjectManagerUseCase()', () => {
  it('should update current project id state', async () => {
    const testId = 'TEST-ID';
    const initState = fixtureAppState({
      ui: {
        modalScreens: fixtureModalScreens({
          data: fixtureModalScreensData({
            projectManager: fixtureProjectManager({
              currentProjectId: 'SOME-ID'
            })
          })
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
              ...initState.ui.modalScreens.data.projectManager,
              currentProjectId: testId
            }
          }
        }
      }
    }
    const {
      appStore,
      switchProjectInProjectManagerUseCase
    } = await setup(initState)

    switchProjectInProjectManagerUseCase(testId);

    const newState = appStore.get();
    expect(newState).toEqual(expectState);
  })
})
