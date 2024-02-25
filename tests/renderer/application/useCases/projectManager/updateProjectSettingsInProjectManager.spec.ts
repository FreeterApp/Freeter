/*
 * Copyright: (c) 2024, Alex Kaul
 * GNU General Public License v3.0 or later (see COPYING or https://www.gnu.org/licenses/gpl-3.0.txt)
 */

import { createUpdateProjectSettingsInProjectManagerUseCase } from '@/application/useCases/projectManager/updateProjectSettingsInProjectManager';
import { AppState } from '@/base/state/app';
import { fixtureProjectA, fixtureProjectB, fixtureProjectSettingsA } from '@tests/base/fixtures/project';
import { fixtureAppState } from '@tests/base/state/fixtures/appState';
import { fixtureModalScreens, fixtureModalScreensData } from '@tests/base/state/fixtures/modalScreens';
import { fixtureProjectManager } from '@tests/base/state/fixtures/projectManager';
import { fixtureAppStore } from '@tests/data/fixtures/appStore';

async function setup(initState: AppState) {
  const [appStore] = await fixtureAppStore(initState);
  const updateProjectSettingsInProjectManagerUseCase = createUpdateProjectSettingsInProjectManagerUseCase({
    appStore
  });
  return {
    appStore,
    updateProjectSettingsInProjectManagerUseCase
  }
}

describe('updateProjectSettingsInProjectManagerUseCase()', () => {
  it('should do nothing, if projects is null', async () => {
    const initState = fixtureAppState({
      ui: {
        modalScreens: fixtureModalScreens({
          data: fixtureModalScreensData({
            projectManager: fixtureProjectManager({
              projects: null
            })
          })
        })
      }
    })
    const {
      appStore,
      updateProjectSettingsInProjectManagerUseCase
    } = await setup(initState)

    const expectState = appStore.get();
    updateProjectSettingsInProjectManagerUseCase('SOME-ID', fixtureProjectSettingsA());

    expect(appStore.get()).toBe(expectState);
  })

  it('should update the settings of a right project in Project Manager state', async () => {
    const project = fixtureProjectA({
      settings: {
        name: 'Name A'
      },
    });
    const projectB = fixtureProjectB();
    const projectWithNewSettings: typeof project = {
      ...project,
      settings: {
        name: 'Name B',
      },
    }
    const initState = fixtureAppState({
      entities: {
      },
      ui: {
        modalScreens: fixtureModalScreens({
          data: fixtureModalScreensData({
            projectManager: fixtureProjectManager({
              projects: {
                [project.id]: project,
                [projectB.id]: projectB
              }
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
              projects: {
                ...initState.ui.modalScreens.data.projectManager.projects,
                [project.id]: projectWithNewSettings
              }
            }
          }
        }
      }
    }
    const {
      appStore,
      updateProjectSettingsInProjectManagerUseCase
    } = await setup(initState)

    updateProjectSettingsInProjectManagerUseCase(project.id, projectWithNewSettings.settings);

    const newState = appStore.get();
    expect(newState).toEqual(expectState);
  })
})
