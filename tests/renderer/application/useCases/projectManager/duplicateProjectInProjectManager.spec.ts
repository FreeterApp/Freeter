/*
 * Copyright: (c) 2024, Alex Kaul
 * GNU General Public License v3.0 or later (see COPYING or https://www.gnu.org/licenses/gpl-3.0.txt)
 */

import { createDuplicateProjectInProjectManagerUseCase } from '@/application/useCases/projectManager/duplicateProjectInProjectManager';
import { AppState } from '@/base/state/app';
import { fixtureProjectA } from '@tests/base/fixtures/project';
import { fixtureAppState } from '@tests/base/state/fixtures/appState';
import { fixtureModalScreens, fixtureModalScreensData } from '@tests/base/state/fixtures/modalScreens';
import { fixtureProjectManager } from '@tests/base/state/fixtures/projectManager';
import { fixtureAppStore } from '@tests/data/fixtures/appStore';

const projectId = 'PROJECT-ID';
const newItemId = 'NEW-ITEM-ID';

async function setup(initState: AppState) {
  const [appStore] = await fixtureAppStore(initState);
  const mockIdGenerator = jest.fn(() => newItemId);
  const duplicateProjectInProjectManagerUseCase = createDuplicateProjectInProjectManagerUseCase({
    appStore,
    idGenerator: mockIdGenerator
  });
  return {
    appStore,
    duplicateProjectInProjectManagerUseCase,
    mockIdGenerator
  }
}

describe('duplicateProjectInProjectManagerUseCase()', () => {
  it('should do nothing, if duplicateProjectIds is null', async () => {
    const initState = fixtureAppState({
      ui: {
        modalScreens: fixtureModalScreens({
          data: fixtureModalScreensData({
            projectManager: fixtureProjectManager({
              duplicateProjectIds: null,
            })
          })
        })
      }
    })
    const {
      appStore,
      duplicateProjectInProjectManagerUseCase
    } = await setup(initState)
    const expectState = appStore.get();

    duplicateProjectInProjectManagerUseCase(projectId);

    const newState = appStore.get();
    expect(newState).toEqual(expectState);
  })

  it('should do nothing, if projects is null', async () => {
    const initState = fixtureAppState({
      ui: {
        modalScreens: fixtureModalScreens({
          data: fixtureModalScreensData({
            projectManager: fixtureProjectManager({
              projects: null,
            })
          })
        })
      }
    })
    const {
      appStore,
      duplicateProjectInProjectManagerUseCase
    } = await setup(initState)
    const expectState = appStore.get();

    duplicateProjectInProjectManagerUseCase(projectId);

    const newState = appStore.get();
    expect(newState).toEqual(expectState);
  })

  it('should do nothing, if projectIds is null', async () => {
    const initState = fixtureAppState({
      ui: {
        modalScreens: fixtureModalScreens({
          data: fixtureModalScreensData({
            projectManager: fixtureProjectManager({
              projectIds: null,
            })
          })
        })
      }
    })
    const {
      appStore,
      duplicateProjectInProjectManagerUseCase
    } = await setup(initState)
    const expectState = appStore.get();

    duplicateProjectInProjectManagerUseCase(projectId);

    const newState = appStore.get();
    expect(newState).toEqual(expectState);
  })

  it('should do nothing, if specified project does not exist', async () => {
    const initState = fixtureAppState({
      ui: {
        modalScreens: fixtureModalScreens({
          data: fixtureModalScreensData({
            projectManager: fixtureProjectManager({
              projectIds: [projectId],
              projects: {
                [projectId]: fixtureProjectA({ id: projectId })
              },
              duplicateProjectIds: {}
            })
          })
        })
      }
    })
    const {
      appStore,
      duplicateProjectInProjectManagerUseCase
    } = await setup(initState)
    const expectState = appStore.get();

    duplicateProjectInProjectManagerUseCase('NO-SUCH-ID');

    const newState = appStore.get();
    expect(newState).toEqual(expectState);
  })

  it('should correctly update the state', async () => {
    const newPrjId = 'NEW-PRJ-ID';
    const initState = fixtureAppState({
      ui: {
        modalScreens: fixtureModalScreens({
          data: fixtureModalScreensData({
            projectManager: fixtureProjectManager({
              projectIds: [projectId],
              projects: {
                [projectId]: fixtureProjectA({ id: projectId })
              },
              duplicateProjectIds: {}
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
              projectIds: [projectId, newPrjId],
              projects: {
                ...initState.ui.modalScreens.data.projectManager.projects,
                [newPrjId]: expect.objectContaining({
                  id: newPrjId,
                  settings: {
                    name: initState.ui.modalScreens.data.projectManager.projects![projectId]!.settings.name + ' Copy 1'
                  }
                })
              },
              duplicateProjectIds: {
                ...initState.ui.modalScreens.data.projectManager.deleteProjectIds,
                [newPrjId]: projectId
              },
              currentProjectId: newPrjId
            }
          }
        }
      }
    }
    const {
      appStore,
      duplicateProjectInProjectManagerUseCase,
      mockIdGenerator
    } = await setup(initState)
    mockIdGenerator.mockImplementationOnce(() => newPrjId);

    duplicateProjectInProjectManagerUseCase(projectId);

    const newState = appStore.get();
    expect(newState).toEqual(expectState);
  })

})
