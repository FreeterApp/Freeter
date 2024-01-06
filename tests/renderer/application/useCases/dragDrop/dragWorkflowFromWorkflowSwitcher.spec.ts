/*
 * Copyright: (c) 2024, Alex Kaul
 * GNU General Public License v3.0 or later (see COPYING or https://www.gnu.org/licenses/gpl-3.0.txt)
 */

import { createDragWorkflowFromWorkflowSwitcherUseCase } from '@/application/useCases/dragDrop/dragWorkflowFromWorkflowSwitcher';
import { AppState } from '@/base/state/app';
import { fixtureAppState } from '@tests/base/state/fixtures/appState';
import { fixtureDragDropFromTopBarList, fixtureDragDropNotDragging, fixtureDragDropOverWorktableLayout } from '@tests/base/state/fixtures/dragDropState';
import { fixtureProjectAInColl } from '@tests/base/state/fixtures/entitiesState';
import { fixtureAppStore } from '@tests/data/fixtures/appStore';

const projectId = 'PROJECT-ID';
const workflowId = 'WORKFLOW-ID';

async function setup(initState: AppState) {
  const [appStore] = await fixtureAppStore(initState);
  const dragWorkflowFromWorkflowSwitcherUseCase = createDragWorkflowFromWorkflowSwitcherUseCase({
    appStore,
  });
  return {
    appStore,
    dragWorkflowFromWorkflowSwitcherUseCase
  }
}

describe('dragWorkflowFromWorkflowSwitcherUseCase()', () => {
  it('should update DragDrop "dragging from workflow switcher" state and reset "over" state, if item with specified id exists', async () => {
    const initState = fixtureAppState({
      entities: {
        projects: {
          ...fixtureProjectAInColl({
            id: projectId,
            workflowIds: [workflowId]
          })
        }
      },
      ui: {
        dragDrop: {
          ...fixtureDragDropFromTopBarList(),
          ...fixtureDragDropOverWorktableLayout()
        }
      }
    });
    const expectState: AppState = {
      ...initState,
      ui: {
        ...initState.ui,
        dragDrop: {
          from: {
            workflowSwitcher: {
              projectId,
              workflowId,
            }
          }
        }
      }
    };
    const {
      appStore,
      dragWorkflowFromWorkflowSwitcherUseCase
    } = await setup(initState)

    dragWorkflowFromWorkflowSwitcherUseCase(projectId, workflowId);

    const newState = appStore.get();
    expect(newState).toEqual(expectState);
  })

  it('should do nothing, if item with specified id does not exist', async () => {
    const initState = fixtureAppState({
      entities: {
        projects: {
          ...fixtureProjectAInColl({
            id: projectId,
            workflowIds: [workflowId]
          })
        }
      },
      ui: {
        dragDrop: {
          ...fixtureDragDropNotDragging(),
        }
      }
    });
    const {
      appStore,
      dragWorkflowFromWorkflowSwitcherUseCase
    } = await setup(initState)
    const expectState = appStore.get();

    dragWorkflowFromWorkflowSwitcherUseCase(projectId, 'NO-SUCH-ITEM');

    expect(appStore.get()).toBe(expectState);
  })

  it('should do nothing, if project with specified id does not exist', async () => {
    const initState = fixtureAppState({
      entities: {
        projects: {
          ...fixtureProjectAInColl({
            id: projectId,
            workflowIds: [workflowId]
          })
        }
      },
      ui: {
        dragDrop: {
          ...fixtureDragDropFromTopBarList(),
          ...fixtureDragDropOverWorktableLayout()
        }
      }
    });
    const {
      appStore,
      dragWorkflowFromWorkflowSwitcherUseCase
    } = await setup(initState)
    const expectState = appStore.get();

    dragWorkflowFromWorkflowSwitcherUseCase('NO-SUCH-ITEM', workflowId);

    expect(appStore.get()).toBe(expectState);
  })
})
