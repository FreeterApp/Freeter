/*
 * Copyright: (c) 2024, Alex Kaul
 * GNU General Public License v3.0 or later (see COPYING or https://www.gnu.org/licenses/gpl-3.0.txt)
 */

import { WorktableStateResizingItemEdgeX } from '@/base/state/ui';
import { createResizeLayoutItemUseCase } from '@/application/useCases/worktable/resizeLayoutItem/resizeLayoutItem';
import { AppState } from '@/base/state/app';
import { fixtureAppState } from '@tests/base/state/fixtures/appState';
import { fixtureWorktableNotResizing, fixtureWorktableResizingItem } from '@tests/base/state/fixtures/worktable';
import { fixtureAppStore } from '@tests/data/fixtures/appStore';

async function setup(initState: AppState) {
  const [appStore] = await fixtureAppStore(initState);
  const resizeLayoutItemUseCase = createResizeLayoutItemUseCase({
    appStore
  });
  return {
    appStore,
    resizeLayoutItemUseCase
  }
}

describe('resizeLayoutItemUseCase()', () => {
  it('should do nothing if no item is resizing', async () => {
    const initState = fixtureAppState({
      ui: {
        worktable: fixtureWorktableNotResizing()
      }
    })
    const {
      appStore,
      resizeLayoutItemUseCase
    } = await setup(initState)
    const expectState = appStore.get();

    resizeLayoutItemUseCase({ x: 1, y: 1 });

    expect(appStore.get()).toBe(expectState);
  })

  it('should update delta and keep the rest state as-is if item is resizing and the delta is changed', async () => {
    const initState = fixtureAppState({
      ui: {
        worktable: {
          ...fixtureWorktableResizingItem({
            edges: {
              x: WorktableStateResizingItemEdgeX.Left
            },
            delta: {}
          })
        }
      }
    })
    const expectState: AppState = {
      ...initState,
      ui: {
        ...initState.ui,
        worktable: {
          ...initState.ui.worktable,
          resizingItem: {
            ...initState.ui.worktable.resizingItem!,
            delta: {
              x: 1,
              y: 2
            }
          }
        }
      }
    }
    const {
      appStore,
      resizeLayoutItemUseCase
    } = await setup(initState)

    resizeLayoutItemUseCase({ x: 1, y: 2 });

    expect(appStore.get()).toEqual(expectState)
  })

  it('should not update the state if item is resizing and the delta values are the same', async () => {
    const delta = { x: 1, y: 2 };
    const initState = fixtureAppState({
      ui: {
        worktable: {
          ...fixtureWorktableResizingItem({
            edges: {
              x: WorktableStateResizingItemEdgeX.Left
            },
            delta
          })
        }
      }
    })
    const {
      appStore,
      resizeLayoutItemUseCase
    } = await setup(initState)
    const expectState = appStore.get();

    resizeLayoutItemUseCase({ ...delta });

    expect(appStore.get()).toBe(expectState)
  })
})
