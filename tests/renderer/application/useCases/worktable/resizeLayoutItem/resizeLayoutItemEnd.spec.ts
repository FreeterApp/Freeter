/*
 * Copyright: (c) 2024, Alex Kaul
 * GNU General Public License v3.0 or later (see COPYING or https://www.gnu.org/licenses/gpl-3.0.txt)
 */

import { WorktableStateResizingItemEdgeX } from '@/base/state/ui';
import { createResizeLayoutItemEndUseCase } from '@/application/useCases/worktable/resizeLayoutItem/resizeLayoutItemEnd';
import { AppState } from '@/base/state/app';
import { fixtureAppState } from '@tests/base/state/fixtures/appState';
import { fixtureWorktableNotResizing, fixtureWorktableResizingItem } from '@tests/base/state/fixtures/worktable';
import { fixtureWorkflowAInColl } from '@tests/base/state/fixtures/entitiesState';
import { fixtureWidgetLayoutItemA, fixtureWidgetLayoutItemB, fixtureWidgetLayoutItemC, fixtureWidgetLayoutItemD } from '@tests/base/fixtures/widgetLayout';
import { fixtureAppStore } from '@tests/data/fixtures/appStore';

async function setup(initState: AppState) {
  const [appStore] = await fixtureAppStore(initState);
  const resizeLayoutItemEndUseCase = createResizeLayoutItemEndUseCase({
    appStore
  });
  return {
    appStore,
    resizeLayoutItemEndUseCase
  }
}

describe('resizeLayoutItemEndUseCase()', () => {
  it('should do nothing if no item is resizing', async () => {
    const initState = fixtureAppState({
      ui: {
        worktable: fixtureWorktableNotResizing()
      }
    })
    const {
      appStore,
      resizeLayoutItemEndUseCase
    } = await setup(initState)

    const expectState = appStore.get();
    resizeLayoutItemEndUseCase({ x: 1, y: 1 });

    expect(appStore.get()).toBe(expectState);
  })

  it('should update widgetLayout, remove resizingItem and keep the rest state as-is if item is resizing', async () => {
    const workflowId = 'WORKFLOW-ID';
    const testId = 'TEST-ID';
    const initState = fixtureAppState({
      entities: {
        workflows: {
          ...fixtureWorkflowAInColl({
            id: workflowId,
            layout: [
              fixtureWidgetLayoutItemA({ rect: { x: 0, y: 1, w: 1, h: 1 } }),
              fixtureWidgetLayoutItemB({ id: testId, rect: { x: 1, y: 1, w: 1, h: 1 } }),
              fixtureWidgetLayoutItemC({ rect: { x: 0, y: 5, w: 1, h: 1 } }),
              fixtureWidgetLayoutItemD({ rect: { x: 0, y: 6, w: 1, h: 1 } }),
            ]
          })
        }
      },
      ui: {
        worktable: {
          ...fixtureWorktableResizingItem({
            workflowId,
            edges: {
              x: WorktableStateResizingItemEdgeX.Left
            },
            itemId: testId
          })
        }
      }
    })
    const expectState: AppState = {
      ...initState,
      entities: {
        ...initState.entities,
        workflows: {
          ...initState.entities.workflows,
          [workflowId]: {
            ...initState.entities.workflows[workflowId]!,
            layout: [
              { ...initState.entities.workflows[workflowId]!.layout[0], rect: { x: 0, y: 2, w: 1, h: 1 } },
              { ...initState.entities.workflows[workflowId]!.layout[1], rect: { x: 0, y: 1, w: 2, h: 1 } },
              { ...initState.entities.workflows[workflowId]!.layout[2], rect: { x: 0, y: 5, w: 1, h: 1 } },
              { ...initState.entities.workflows[workflowId]!.layout[3], rect: { x: 0, y: 6, w: 1, h: 1 } },
            ]
          }
        }
      },
      ui: {
        ...initState.ui,
        worktable: {}
      }
    }
    const {
      appStore,
      resizeLayoutItemEndUseCase
    } = await setup(initState)

    resizeLayoutItemEndUseCase({ x: 1 });

    expect(appStore.get()).toEqual(expectState)
  })
})
