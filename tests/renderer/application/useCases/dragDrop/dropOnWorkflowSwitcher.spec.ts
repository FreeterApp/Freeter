/*
 * Copyright: (c) 2024, Alex Kaul
 * GNU General Public License v3.0 or later (see COPYING or https://www.gnu.org/licenses/gpl-3.0.txt)
 */

import { createDropOnWorkflowSwitcherUseCase } from '@/application/useCases/dragDrop/dropOnWorkflowSwitcher';
import { AppState } from '@/base/state/app';
import { fixtureAppState } from '@tests/base/state/fixtures/appState';
import { fixtureDragDropFromWorkflowSwitcher, fixtureDragDropNotDragging } from '@tests/base/state/fixtures/dragDropState';
import { fixtureProjectAInColl, fixtureProjectBInColl } from '@tests/base/state/fixtures/entitiesState';
import { fixtureAppStore } from '@tests/data/fixtures/appStore';

const projectId = 'PROJECT-ID';
const workflowIds = ['WORKFLOW-A', 'WORKFLOW-B', 'WORKFLOW-C']

async function setup(initState: AppState) {
  const [appStore] = await fixtureAppStore(initState);
  const dropOnWorkflowSwitcherUseCase = createDropOnWorkflowSwitcherUseCase({
    appStore,
  });
  return {
    appStore,
    dropOnWorkflowSwitcherUseCase
  }
}

describe('dropOnWorkflowSwitcherUseCase()', () => {
  describe('when not dragging', () => {
    it('should not modify state', async () => {
      const initState = fixtureAppState({
        entities: {
          projects: {
            ...fixtureProjectAInColl({ id: projectId })
          }
        },
        ui: {
          dragDrop: { ...fixtureDragDropNotDragging() },
        }
      });
      const {
        appStore,
        dropOnWorkflowSwitcherUseCase
      } = await setup(initState)
      const expectState = appStore.get();

      dropOnWorkflowSwitcherUseCase(projectId, null);

      expect(appStore.get()).toBe(expectState);
    })
  })

  describe('when dragging an item from Workflow Switcher and target project with specified id does not exist', () => {
    it('should reset dragDrop state and leave Projects untouched', async () => {
      const initState = fixtureAppState({
        entities: {
          projects: {
            ...fixtureProjectAInColl({ id: projectId, workflowIds })
          }
        },
        ui: {
          dragDrop: {
            ...fixtureDragDropFromWorkflowSwitcher({
              projectId,
              workflowId: workflowIds[0]
            })
          },
        }
      });
      const {
        appStore,
        dropOnWorkflowSwitcherUseCase
      } = await setup(initState)

      dropOnWorkflowSwitcherUseCase('NO-SUCH-PROJECT', workflowIds[0]);

      const expectState: AppState = {
        ...initState,
        ui: {
          ...initState.ui,
          dragDrop: {},
        }
      }
      expect(appStore.get()).toEqual(expectState);
    })
  })

  describe('when dragging an item from Workflow Switcher and over-item with specified id does not exist', () => {
    it('should reset dragDrop state and leave Projects untouched', async () => {
      const initState = fixtureAppState({
        entities: {
          projects: {
            ...fixtureProjectAInColl({ id: projectId, workflowIds })
          }
        },
        ui: {
          dragDrop: {
            ...fixtureDragDropFromWorkflowSwitcher({
              projectId,
              workflowId: workflowIds[0]
            })
          },
        }
      });
      const {
        appStore,
        dropOnWorkflowSwitcherUseCase
      } = await setup(initState)

      dropOnWorkflowSwitcherUseCase(projectId, 'NO-SUCH-ID-ON-TARGET');

      const expectState: AppState = {
        ...initState,
        ui: {
          ...initState.ui,
          dragDrop: {}
        }
      }
      expect(appStore.get()).toEqual(expectState);
    })
  })

  describe('when dragging an item from Workflow Switcher, to the same project', () => {
    it('should reset dragDrop state and move item on Project\'s workflow list', async () => {
      const initState = fixtureAppState({
        entities: {
          projects: {
            ...fixtureProjectAInColl({ id: projectId, workflowIds })
          }
        },
        ui: {
          dragDrop: {
            ...fixtureDragDropFromWorkflowSwitcher({
              projectId,
              workflowId: workflowIds[0]
            })
          },
        }
      });
      const {
        appStore,
        dropOnWorkflowSwitcherUseCase
      } = await setup(initState)

      dropOnWorkflowSwitcherUseCase(projectId, workflowIds[1]);

      const expectState: AppState = {
        ...initState,
        entities: {
          ...initState.entities,
          projects: {
            ...initState.entities.projects,
            [projectId]: {
              ...initState.entities.projects[projectId]!,
              workflowIds: [workflowIds[1], workflowIds[0], workflowIds[2]]
            }
          }
        },
        ui: {
          ...initState.ui,
          dragDrop: {},
        }
      }
      expect(appStore.get()).toEqual(expectState);
    })
  })

  describe('when dragging an item from Workflow Switcher, from one project to another', () => {
    it('should reset dragDrop state and move item on Projects\' workflow lists', async () => {
      const projectIdA = 'PROJECT-ID-A';
      const projectIdB = 'PROJECT-ID-B';
      const workflowIdsA = ['WORKFLOW-A', 'WORKFLOW-B', 'WORKFLOW-C']
      const workflowIdsB = ['WORKFLOW-D', 'WORKFLOW-E']

      const initState = fixtureAppState({
        entities: {
          projects: {
            ...fixtureProjectAInColl({ id: projectIdA, workflowIds: workflowIdsA }),
            ...fixtureProjectBInColl({ id: projectIdB, workflowIds: workflowIdsB }),
          }
        },
        ui: {
          dragDrop: {
            ...fixtureDragDropFromWorkflowSwitcher({
              projectId: projectIdA,
              workflowId: workflowIdsA[0]
            })
          },
        }
      });
      const {
        appStore,
        dropOnWorkflowSwitcherUseCase
      } = await setup(initState)

      dropOnWorkflowSwitcherUseCase(projectIdB, workflowIdsB[1]);

      const expectState: AppState = {
        ...initState,
        entities: {
          ...initState.entities,
          projects: {
            ...initState.entities.projects,
            [projectIdA]: {
              ...initState.entities.projects[projectIdA]!,
              workflowIds: [workflowIdsA[1], workflowIdsA[2]]
            },
            [projectIdB]: {
              ...initState.entities.projects[projectIdB]!,
              workflowIds: [workflowIdsB[0], workflowIdsA[0], workflowIdsB[1]]
            },
          }
        },
        ui: {
          ...initState.ui,
          dragDrop: {}
        }
      }
      expect(appStore.get()).toEqual(expectState);
    })
  })

  describe('when dragging an item from Workflow Switcher and over-item === null (end of the list)', () => {
    it('should reset dragDrop state and move item to the end of Project\'s Widget Ids list', async () => {
      const initState = fixtureAppState({
        entities: {
          projects: {
            ...fixtureProjectAInColl({ id: projectId, workflowIds })
          }
        },
        ui: {
          dragDrop: {
            ...fixtureDragDropFromWorkflowSwitcher({
              projectId,
              workflowId: workflowIds[0]
            })
          },
        }
      });
      const {
        appStore,
        dropOnWorkflowSwitcherUseCase
      } = await setup(initState)

      dropOnWorkflowSwitcherUseCase(projectId, null);

      const expectState: AppState = {
        ...initState,
        entities: {
          ...initState.entities,
          projects: {
            ...initState.entities.projects,
            [projectId]: {
              ...initState.entities.projects[projectId]!,
              workflowIds: [workflowIds[1], workflowIds[2], workflowIds[0]]
            }
          }
        },
        ui: {
          ...initState.ui,
          dragDrop: {},
        }
      }
      expect(appStore.get()).toEqual(expectState);
    })
  })
})
