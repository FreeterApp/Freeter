/*
 * Copyright: (c) 2024, Alex Kaul
 * GNU General Public License v3.0 or later (see COPYING or https://www.gnu.org/licenses/gpl-3.0.txt)
 */

import { createDragWidgetFromWorktableLayoutUseCase } from '@/application/useCases/dragDrop/dragWidgetFromWorktableLayout';
import { AppState } from '@/base/state/app';
import { fixtureWidgetLayoutItemA } from '@tests/base/fixtures/widgetLayout';
import { fixtureAppState } from '@tests/base/state/fixtures/appState';
import { fixtureDragDropFromWorktableLayout, fixtureDragDropOverWorktableLayout } from '@tests/base/state/fixtures/dragDropState';
import { fixtureWorkflowAInColl } from '@tests/base/state/fixtures/entitiesState';
import { fixtureAppStore } from '@tests/data/fixtures/appStore';

const workflowId = 'WORKFLOW-ID';
const testId = 'TEST-ID';
const widgetId = 'TEST-WGT-ID';
const testRect = { x: 0, y: 0, w: 1, h: 2 }

async function setup(initState: AppState) {
  const [appStore] = await fixtureAppStore(initState);
  const dragWidgetFromWorktableLayoutUseCase = createDragWidgetFromWorktableLayoutUseCase({
    appStore,
  });
  return {
    appStore,
    dragWidgetFromWorktableLayoutUseCase
  }
}

describe('dragWidgetFromWorktableLayoutUseCase()', () => {
  it('should update DragDrop "dragging widget" state and reset "over" state, if item with specified id exists', async () => {
    const initState = fixtureAppState({
      entities: {
        workflows: {
          ...fixtureWorkflowAInColl({
            id: workflowId,
            layout: [fixtureWidgetLayoutItemA({ id: testId, widgetId, rect: testRect })]
          })
        }
      },
      ui: {
        dragDrop: {
          ...fixtureDragDropFromWorktableLayout(),
          ...fixtureDragDropOverWorktableLayout()
        },
      }
    });
    const expectState: AppState = {
      ...initState,
      ui: {
        ...initState.ui,
        dragDrop: {
          from: {
            worktableLayout: {
              workflowId: workflowId,
              widgetId: widgetId,
              layoutItemId: testId,
              layoutItemWH: {
                w: testRect.w,
                h: testRect.h
              }
            }
          }
        },
      }
    };
    const {
      appStore,
      dragWidgetFromWorktableLayoutUseCase
    } = await setup(initState)

    dragWidgetFromWorktableLayoutUseCase(workflowId, widgetId, testId);

    const newState = appStore.get();
    expect(newState).toEqual(expectState);
  })

  it('should do nothing, if workflow with specified id does not exist', async () => {
    const initState = fixtureAppState({
      entities: {
        workflows: {
          ...fixtureWorkflowAInColl({
            id: workflowId,
            layout: [fixtureWidgetLayoutItemA({ id: testId, widgetId, rect: testRect })]
          })
        }
      },
      ui: {
        dragDrop: {
          ...fixtureDragDropFromWorktableLayout(),
          ...fixtureDragDropOverWorktableLayout()
        },
      }
    });
    const {
      appStore,
      dragWidgetFromWorktableLayoutUseCase
    } = await setup(initState)
    const expectState = appStore.get();

    dragWidgetFromWorktableLayoutUseCase('NO-SUCH-WORFKLOW', widgetId, testId);

    expect(appStore.get()).toBe(expectState);
  })

  it('should do nothing, if layout item with specified id does not exist', async () => {
    const initState = fixtureAppState({
      entities: {
        workflows: {
          ...fixtureWorkflowAInColl({
            id: workflowId,
            layout: [fixtureWidgetLayoutItemA({ id: testId, widgetId, rect: testRect })]
          })
        }
      },
      ui: {
        dragDrop: {
          ...fixtureDragDropFromWorktableLayout(),
          ...fixtureDragDropOverWorktableLayout()
        },
      }
    });
    const {
      appStore,
      dragWidgetFromWorktableLayoutUseCase
    } = await setup(initState)
    const expectState = appStore.get();

    dragWidgetFromWorktableLayoutUseCase(workflowId, widgetId, 'NO-SUCH-ITEM');

    expect(appStore.get()).toBe(expectState);
  })
})
