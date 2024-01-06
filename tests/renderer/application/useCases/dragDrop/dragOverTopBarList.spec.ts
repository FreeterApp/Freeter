/*
 * Copyright: (c) 2024, Alex Kaul
 * GNU General Public License v3.0 or later (see COPYING or https://www.gnu.org/licenses/gpl-3.0.txt)
 */

import { createDragOverTopBarListUseCase } from '@/application/useCases/dragDrop/dragOverTopBarList';
import { AppState } from '@/base/state/app';
import { fixtureAppState } from '@tests/base/state/fixtures/appState';
import { fixtureDragDropFromPalette, fixtureDragDropFromTopBarList, fixtureDragDropFromWorkflowSwitcher, fixtureDragDropFromWorktableLayout, fixtureDragDropNotDragging, fixtureDragDropOverTopBarList } from '@tests/base/state/fixtures/dragDropState';
import { fixtureAppStore } from '@tests/data/fixtures/appStore';

const testId = 'TEST-ID';

async function setup(initState: AppState) {
  const [appStore] = await fixtureAppStore(initState);
  const dragOverTopBarListUseCase = createDragOverTopBarListUseCase({ appStore });
  return {
    appStore,
    dragOverTopBarListUseCase
  }
}

describe('dragOverTopBarListUseCase()', () => {
  it('should update DragDrop "over TopBar List" state and return true, if dragging widget from TopBar List', async () => {
    const initState = fixtureAppState({
      ui: {
        dragDrop: {
          from: fixtureDragDropFromTopBarList().from,
          over: fixtureDragDropOverTopBarList({ listItemId: null }).over
        }
      }
    });
    const expectState: AppState = {
      ...initState,
      ui: {
        ...initState.ui,
        dragDrop: {
          ...initState.ui.dragDrop,
          over: { topBarList: { listItemId: testId } }
        }
      }
    };
    const {
      appStore,
      dragOverTopBarListUseCase
    } = await setup(initState)

    const retVal = dragOverTopBarListUseCase(testId);

    const newState = appStore.get();
    expect(retVal).toBe(true);
    expect(newState).toEqual(expectState);
  })

  it('should update DragDrop "over TopBar List" state and return true, if dragging widget from Worktable Layout', async () => {
    const initState = fixtureAppState({
      ui: {
        dragDrop: {
          from: fixtureDragDropFromWorktableLayout().from,
        }
      }
    });
    const expectState: AppState = {
      ...initState,
      ui: {
        ...initState.ui,
        dragDrop: {
          ...initState.ui.dragDrop,
          over: { topBarList: { listItemId: testId } }
        }
      }
    };
    const {
      appStore,
      dragOverTopBarListUseCase
    } = await setup(initState)

    const retVal = dragOverTopBarListUseCase(testId);

    const newState = appStore.get();
    expect(retVal).toBe(true);
    expect(newState).toEqual(expectState);
  })

  it('should update DragDrop "over TopBar List" state and return true, if dragging widget from Palette', async () => {
    const initState = fixtureAppState({
      ui: {
        dragDrop: {
          from: fixtureDragDropFromPalette().from,
        }
      }
    });
    const expectState: AppState = {
      ...initState,
      ui: {
        ...initState.ui,
        dragDrop: {
          ...initState.ui.dragDrop,
          over: { topBarList: { listItemId: testId } }
        }
      }
    };
    const {
      appStore,
      dragOverTopBarListUseCase
    } = await setup(initState)

    const retVal = dragOverTopBarListUseCase(testId);

    const newState = appStore.get();
    expect(retVal).toBe(true);
    expect(newState).toEqual(expectState);
  })

  it('should not update DragDrop "over TopBar List" state and return true, when the state has the same value', async () => {
    const initState = fixtureAppState({
      ui: {
        dragDrop: {
          from: fixtureDragDropFromPalette().from,
          over: fixtureDragDropOverTopBarList({ listItemId: testId }).over
        }
      }
    });
    const {
      appStore,
      dragOverTopBarListUseCase
    } = await setup(initState)
    const expectState = appStore.get();

    const retVal = dragOverTopBarListUseCase(testId);

    expect(retVal).toBe(true);
    expect(appStore.get()).toBe(expectState);
  })

  it('should not update DragDrop "over TopBar List" state and return false, if not dragging widget', async () => {
    const initState = fixtureAppState({
      ui: {
        dragDrop: { ...fixtureDragDropNotDragging() }
      }
    });
    const {
      appStore,
      dragOverTopBarListUseCase
    } = await setup(initState)
    const expectState = appStore.get();

    const retVal = dragOverTopBarListUseCase(testId);

    expect(retVal).toBe(false);
    expect(appStore.get()).toBe(expectState);
  })

  it('should not update DragDrop "over TopBar List" state and return false, if dragging item from Workflow Switcher', async () => {
    const initState = fixtureAppState({
      ui: {
        dragDrop: {
          from: fixtureDragDropFromWorkflowSwitcher().from
        }
      }
    });
    const {
      appStore,
      dragOverTopBarListUseCase
    } = await setup(initState)
    const expectState = appStore.get();

    const retVal = dragOverTopBarListUseCase(testId);

    expect(retVal).toBe(false);
    expect(appStore.get()).toBe(expectState);
  })
})
