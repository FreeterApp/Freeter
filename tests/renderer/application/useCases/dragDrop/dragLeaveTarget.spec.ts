/*
 * Copyright: (c) 2024, Alex Kaul
 * GNU General Public License v3.0 or later (see COPYING or https://www.gnu.org/licenses/gpl-3.0.txt)
 */

import { createDragLeaveTargetUseCase } from '@/application/useCases/dragDrop/dragLeaveTarget';
import { AppState } from '@/base/state/app';
import { fixtureAppState } from '@tests/base/state/fixtures/appState';
import { fixtureDragDropFromTopBarList, fixtureDragDropOverTopBarList, fixtureDragDropOverWorktableLayout } from '@tests/base/state/fixtures/dragDropState';
import { fixtureAppStore } from '@tests/data/fixtures/appStore';

async function setup(initState: AppState) {
  const [appStore] = await fixtureAppStore(initState);
  const dragLeaveTargetUseCase = createDragLeaveTargetUseCase({ appStore });
  return {
    appStore,
    dragLeaveTargetUseCase
  }
}

describe('dragLeaveTargetUseCase()', () => {
  it('should not change state when not "dragging over"', async () => {
    const initState = fixtureAppState({
      ui: {
        dragDrop: {
          ...fixtureDragDropFromTopBarList()
        }
      }
    });
    const {
      appStore,
      dragLeaveTargetUseCase
    } = await setup(initState)
    const expectState = appStore.get();

    dragLeaveTargetUseCase();

    expect(appStore.get()).toBe(expectState);
  })

  it('should reset DragDrop "over TopBar List" state', async () => {
    const initState = fixtureAppState({
      ui: {
        dragDrop: {
          ...fixtureDragDropFromTopBarList(),
          ...fixtureDragDropOverTopBarList()
        }
      }
    });
    const expectState: AppState = {
      ...initState,
      ui: {
        ...initState.ui,
        dragDrop: {
          from: initState.ui.dragDrop.from
        }
      }
    };
    const {
      appStore,
      dragLeaveTargetUseCase
    } = await setup(initState)

    dragLeaveTargetUseCase();

    const newState = appStore.get();
    expect(newState).toEqual(expectState);
  })

  it('should reset DragDrop "over Worktable Layout" state', async () => {
    const initState = fixtureAppState({
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
          from: initState.ui.dragDrop.from
        }
      }
    };
    const {
      appStore,
      dragLeaveTargetUseCase
    } = await setup(initState)

    dragLeaveTargetUseCase();

    const newState = appStore.get();
    expect(newState).toEqual(expectState);
  })
})
