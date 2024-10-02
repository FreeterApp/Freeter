/*
 * Copyright: (c) 2024, Alex Kaul
 * GNU General Public License v3.0 or later (see COPYING or https://www.gnu.org/licenses/gpl-3.0.txt)
 */

import { createAddProjectInProjectManagerUseCase } from '@/application/useCases/projectManager/addProjectInProjectManager';
import { AppState } from '@/base/state/app';
import { fixtureAppState } from '@tests/base/state/fixtures/appState';
import { fixtureProjectManager } from '@tests/base/state/fixtures/projectManager';
import { fixtureAppStore } from '@tests/data/fixtures/appStore';
import { fixtureProjectA, fixtureProjectB, fixtureProjectSettingsA, fixtureProjectSettingsB } from '@tests/base/fixtures/project';
import { fixtureProjectAInColl } from '@tests/base/state/fixtures/entitiesState';
import { fixtureModalScreens, fixtureModalScreensData } from '@tests/base/state/fixtures/modalScreens';

const newItemId = 'NEW-ITEM-ID';

async function setup(initState: AppState) {
  const [appStore] = await fixtureAppStore(initState);
  const addProjectInProjectManagerUseCase = createAddProjectInProjectManagerUseCase({
    appStore,
    idGenerator: () => newItemId
  });
  return {
    appStore,
    addProjectInProjectManagerUseCase
  }
}

describe('addProjectInProjectManagerUseCase()', () => {
  it('should do nothing, if projects is null', async () => {
    const initState = fixtureAppState({
      ui: {
        modalScreens: fixtureModalScreens({
          data: fixtureModalScreensData({
            projectManager: fixtureProjectManager({
              projects: null,
              projectIds: ['SOME-ID']
            })
          })
        })
      }
    })
    const {
      appStore,
      addProjectInProjectManagerUseCase
    } = await setup(initState)

    const expectState = appStore.get();
    addProjectInProjectManagerUseCase();

    expect(appStore.get()).toBe(expectState);
  })

  it('should do nothing, if projectIds is null', async () => {
    const initState = fixtureAppState({
      ui: {
        modalScreens: fixtureModalScreens({
          data: fixtureModalScreensData({
            projectManager: fixtureProjectManager({
              projects: fixtureProjectAInColl(),
              projectIds: null
            })
          })
        })
      }
    })
    const {
      appStore,
      addProjectInProjectManagerUseCase
    } = await setup(initState)

    const expectState = appStore.get();
    addProjectInProjectManagerUseCase();

    expect(appStore.get()).toBe(expectState);
  })

  it('should add a new project with a right name as a last item and make it a current project in the project manager state, and return the id of the new item', async () => {
    const projectA = fixtureProjectA({ settings: fixtureProjectSettingsA({ name: 'Project 1' }) });
    const projectB = fixtureProjectB({ settings: fixtureProjectSettingsB({ name: 'Project 2' }) });
    const initState = fixtureAppState({
      ui: {
        modalScreens: fixtureModalScreens({
          data: fixtureModalScreensData({
            projectManager: fixtureProjectManager({
              projects: {
                [projectA.id]: projectA,
                [projectB.id]: projectB
              },
              currentProjectId: projectA.id,
              projectIds: [projectB.id, projectA.id]
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
                [newItemId]: expect.objectContaining({ id: newItemId, settings: { memSaver: {}, name: 'Project 3' } })
              },
              currentProjectId: newItemId,
              projectIds: [projectB.id, projectA.id, newItemId]
            }
          }
        }
      }
    }
    const {
      appStore,
      addProjectInProjectManagerUseCase
    } = await setup(initState)

    const res = addProjectInProjectManagerUseCase();

    const newState = appStore.get();
    expect(newState).toEqual(expectState);
    expect(res).toBe(newItemId);
  })
})
