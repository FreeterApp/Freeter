/*
 * Copyright: (c) 2024, Alex Kaul
 * GNU General Public License v3.0 or later (see COPYING or https://www.gnu.org/licenses/gpl-3.0.txt)
 */

import { createOpenProjectManagerUseCase } from '@/application/useCases/projectManager/openProjectManager';
import { AppState } from '@/base/state/app';
import { fixtureProjectA, fixtureProjectB, fixtureProjectC } from '@tests/base/fixtures/project';
import { fixtureAppState } from '@tests/base/state/fixtures/appState';
import { fixtureModalScreens, fixtureModalScreensData } from '@tests/base/state/fixtures/modalScreens';
import { fixtureProjectManager } from '@tests/base/state/fixtures/projectManager';
import { fixtureProjectSwitcher } from '@tests/base/state/fixtures/projectSwitcher';
import { fixtureAppStore } from '@tests/data/fixtures/appStore';

const projectId1 = 'PROJECT-ID-1';
const projectId2 = 'PROJECT-ID-2';

async function setup(initState: AppState) {
  const [appStore] = await fixtureAppStore(initState);
  const openProjectManagerUseCase = createOpenProjectManagerUseCase({
    appStore
  });
  return {
    appStore,
    openProjectManagerUseCase
  }
}

describe('openProjectManagerUseCase()', () => {
  it('should init the deletion array state and set the projects to the Project Manager state using the project list of the Project Switcher state, and add to the order list state, when it is not open', async () => {
    const projectA = fixtureProjectA({ id: projectId1 });
    const projectB = fixtureProjectB({ id: projectId2 })
    const projectC = fixtureProjectC();
    const initState = fixtureAppState({
      entities: {
        projects: {
          [projectA.id]: projectA,
          [projectB.id]: projectB,
          [projectC.id]: projectC
        }
      },
      ui: {
        modalScreens: fixtureModalScreens({
          data: fixtureModalScreensData({
            projectManager: fixtureProjectManager({
              currentProjectId: '',
              deleteProjectIds: null,
              projects: null
            }),
          }),
          order: ['about']
        }),
        projectSwitcher: fixtureProjectSwitcher({
          currentProjectId: projectId2,
          projectIds: [projectId2, projectId1]
        }),
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
              currentProjectId: projectId2,
              deleteProjectIds: {},
              projects: {
                [projectA.id]: projectA,
                [projectB.id]: projectB,
                [projectC.id]: projectC
              },
              projectIds: [projectId2, projectId1]
            }
          },
          order: ['about', 'projectManager']
        },
      }
    }
    const {
      appStore,
      openProjectManagerUseCase
    } = await setup(initState)

    openProjectManagerUseCase();

    const newState = appStore.get();
    expect(newState).toEqual(expectState);
  })

  it('should init the deletion array state and set the projects to the Project Manager state using the project list of the Project Switcher state, and move the screen to the end of the order list state, when it is open', async () => {
    const projectA = fixtureProjectA({ id: projectId1 });
    const projectB = fixtureProjectB({ id: projectId2 })
    const projectC = fixtureProjectC();
    const initState = fixtureAppState({
      entities: {
        projects: {
          [projectA.id]: projectA,
          [projectB.id]: projectB,
          [projectC.id]: projectC
        }
      },
      ui: {
        modalScreens: fixtureModalScreens({
          data: fixtureModalScreensData({
            projectManager: fixtureProjectManager({
              currentProjectId: '',
              deleteProjectIds: null,
              projects: null
            }),
          }),
          order: ['projectManager', 'about']
        }),
        projectSwitcher: fixtureProjectSwitcher({
          currentProjectId: projectId2,
          projectIds: [projectId2, projectId1]
        }),
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
              currentProjectId: projectId2,
              deleteProjectIds: {},
              projects: {
                [projectA.id]: projectA,
                [projectB.id]: projectB,
                [projectC.id]: projectC
              },
              projectIds: [projectId2, projectId1]
            }
          },
          order: ['about', 'projectManager']
        },
      }
    }
    const {
      appStore,
      openProjectManagerUseCase
    } = await setup(initState)

    openProjectManagerUseCase();

    const newState = appStore.get();
    expect(newState).toEqual(expectState);
  })

})
