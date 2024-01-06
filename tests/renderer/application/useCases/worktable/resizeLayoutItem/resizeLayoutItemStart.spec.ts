/*
 * Copyright: (c) 2024, Alex Kaul
 * GNU General Public License v3.0 or later (see COPYING or https://www.gnu.org/licenses/gpl-3.0.txt)
 */

import { WorktableStateResizingItemEdgeX } from '@/base/state/ui';
import { createResizeLayoutItemStartUseCase } from '@/application/useCases/worktable/resizeLayoutItem/resizeLayoutItemStart';
import { AppState } from '@/base/state/app';
import { fixtureAppState } from '@tests/base/state/fixtures/appState';
import { fixtureWorkflowAInColl, fixtureWidgetTypeAInColl, fixtureWidgetAInColl } from '@tests/base/state/fixtures/entitiesState';
import { fixtureWorktableNotResizing } from '@tests/base/state/fixtures/worktable';
import { fixtureWidgetLayoutItemA } from '@tests/base/fixtures/widgetLayout';
import { fixtureAppStore } from '@tests/data/fixtures/appStore';

async function setup(initState: AppState) {
  const [appStore] = await fixtureAppStore(initState);
  const resizeLayoutItemStartUseCase = createResizeLayoutItemStartUseCase({
    appStore
  });
  return {
    appStore,
    resizeLayoutItemStartUseCase
  }
}

describe('resizeLayoutItemStartUseCase()', () => {
  it('should do nothing if the workflow with the specified id does not exist', async () => {
    const initState = fixtureAppState({
      entities: {
        workflows: {
          ...fixtureWorkflowAInColl()
        }
      },
      ui: {
        worktable: fixtureWorktableNotResizing()
      }
    })
    const {
      appStore,
      resizeLayoutItemStartUseCase
    } = await setup(initState)
    const expectState = appStore.get();

    resizeLayoutItemStartUseCase('NO-SUCH-WORKFLOW', 'NO-SUCH-ID', {
      x: WorktableStateResizingItemEdgeX.Left
    });

    expect(appStore.get()).toBe(expectState);
  })

  it('should do nothing if the layout does not have item with the provided id', async () => {
    const workflowId = 'WORKFLOW-ID';
    const initState = fixtureAppState({
      entities: {
        workflows: {
          ...fixtureWorkflowAInColl({ id: workflowId, layout: [fixtureWidgetLayoutItemA()] })
        }
      },
      ui: {
        worktable: fixtureWorktableNotResizing()
      }
    })
    const {
      appStore,
      resizeLayoutItemStartUseCase
    } = await setup(initState)
    const expectState = appStore.get();

    resizeLayoutItemStartUseCase(workflowId, 'NO-SUCH-ID', {
      x: WorktableStateResizingItemEdgeX.Left
    });

    expect(appStore.get()).toBe(expectState);
  })

  it('should correctly update resizingItem state and keep the rest state as-is', async () => {
    const widgetTypeId = 'WIDGET-TYPE-ID';
    const widgetId = 'WIDGET-iD';
    const workflowId = 'WORKFLOW-ID';
    const itemId = 'ITEM-ID';
    const minSize = { w: 2, h: 3 }
    const initState = fixtureAppState({
      entities: {
        widgets: {
          ...fixtureWidgetAInColl({ id: widgetId, type: widgetTypeId })
        },
        widgetTypes: {
          ...fixtureWidgetTypeAInColl({ id: widgetTypeId, minSize })
        },
        workflows: {
          ...fixtureWorkflowAInColl({ id: workflowId, layout: [fixtureWidgetLayoutItemA({ id: itemId, widgetId })] })
        }
      },
      ui: {
        worktable: fixtureWorktableNotResizing()
      }
    })
    const expectState: AppState = {
      ...initState,
      ui: {
        ...initState.ui,
        worktable: {
          ...initState.ui.worktable,
          resizingItem: {
            delta: {},
            edges: {
              x: WorktableStateResizingItemEdgeX.Left
            },
            workflowId,
            itemId,
            minSize
          }
        }
      }
    }
    const {
      appStore,
      resizeLayoutItemStartUseCase
    } = await setup(initState)

    resizeLayoutItemStartUseCase(workflowId, itemId, {
      x: WorktableStateResizingItemEdgeX.Left
    });

    expect(appStore.get()).toEqual(expectState)
  })
})
