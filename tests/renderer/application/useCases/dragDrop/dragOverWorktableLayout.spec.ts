/*
 * Copyright: (c) 2024, Alex Kaul
 * GNU General Public License v3.0 or later (see COPYING or https://www.gnu.org/licenses/gpl-3.0.txt)
 */

import { createDragOverWorktableLayoutUseCase } from '@/application/useCases/dragDrop/dragOverWorktableLayout';
import { AppState } from '@/base/state/app';
import { fixtureAppState } from '@tests/base/state/fixtures/appState';
import { fixtureDragDropFromPaletteAdd, fixtureDragDropFromTopBarList, fixtureDragDropFromWorkflowSwitcher, fixtureDragDropFromWorktableLayout, fixtureDragDropNotDragging, fixtureDragDropOverWorktableLayout } from '@tests/base/state/fixtures/dragDropState';
import { fixtureAppStore } from '@tests/data/fixtures/appStore';

const testId = 'TEST-ID';
const newLayoutItemId = 'NEW-ID';

async function setup(initState: AppState) {
  const [appStore] = await fixtureAppStore(initState);
  const dragOverWorktableLayoutUseCase = createDragOverWorktableLayoutUseCase({
    appStore,
    idGenerator: () => newLayoutItemId
  });
  return {
    appStore,
    dragOverWorktableLayoutUseCase
  }
}

describe('dragOverWorktableLayoutUseCase()', () => {
  it('should update DragDrop "over Worktable Layout" state and return true, if dragging widget from Worktable Layout', async () => {
    const initState = fixtureAppState({
      ui: {
        dragDrop: {
          ...fixtureDragDropFromWorktableLayout({ layoutItemId: testId })
        }
      }
    });
    const expectState: AppState = {
      ...initState,
      ui: {
        ...initState.ui,
        dragDrop: {
          ...initState.ui.dragDrop,
          over: { worktableLayout: { layoutItemId: testId, layoutItemXY: { x: 2, y: 2 } } }
        }
      }
    };
    const {
      appStore,
      dragOverWorktableLayoutUseCase
    } = await setup(initState)

    const retVal = dragOverWorktableLayoutUseCase({ x: 2, y: 2 });

    const newState = appStore.get();
    expect(retVal).toBe(true);
    expect(newState).toEqual(expectState);
  })

  it('should init DragDrop "over Worktable Layout" state and return true, when dragging widget from TopBar List', async () => {
    const initState = fixtureAppState({
      ui: {
        dragDrop: {
          ...fixtureDragDropFromTopBarList()
        }
      }
    });
    const expectState: AppState = {
      ...initState,
      ui: {
        ...initState.ui,
        dragDrop: {
          ...initState.ui.dragDrop,
          over: { worktableLayout: { layoutItemId: newLayoutItemId, layoutItemXY: { x: 2, y: 2 } } }
        }
      }
    };
    const {
      appStore,
      dragOverWorktableLayoutUseCase
    } = await setup(initState)

    const retVal = dragOverWorktableLayoutUseCase({ x: 2, y: 2 });

    const newState = appStore.get();
    expect(retVal).toBe(true);
    expect(newState).toEqual(expectState);
  })

  it('should update DragDrop "over Worktable Layout" state and return true, if dragging widget from TopBar List to a new position', async () => {
    const initState = fixtureAppState({
      ui: {
        dragDrop: {
          ...fixtureDragDropFromTopBarList(),
          ...fixtureDragDropOverWorktableLayout({ layoutItemId: newLayoutItemId, layoutItemXY: { x: 1, y: 2 } })
        }
      }
    });
    const expectState: AppState = {
      ...initState,
      ui: {
        ...initState.ui,
        dragDrop: {
          ...initState.ui.dragDrop,
          over: { worktableLayout: { ...initState.ui.dragDrop.over!.worktableLayout!, layoutItemXY: { x: 3, y: 4 } } }
        }
      }
    };
    const {
      appStore,
      dragOverWorktableLayoutUseCase
    } = await setup(initState)

    const retVal = dragOverWorktableLayoutUseCase({ x: 3, y: 4 });

    const newState = appStore.get();
    expect(retVal).toBe(true);
    expect(newState).toEqual(expectState);
  })

  it('should not update DragDrop "over Worktable Layout" state and return true, if dragging widget from TopBar List to the same position', async () => {
    const pos = { x: 3, y: 4 };
    const initState = fixtureAppState({
      ui: {
        dragDrop: {
          ...fixtureDragDropFromTopBarList(),
          ...fixtureDragDropOverWorktableLayout({ layoutItemId: newLayoutItemId, layoutItemXY: pos })
        }
      }
    });
    const {
      appStore,
      dragOverWorktableLayoutUseCase
    } = await setup(initState)
    const expectState = appStore.get();

    const retVal = dragOverWorktableLayoutUseCase({ ...pos });

    expect(retVal).toBe(true);
    expect(appStore.get()).toBe(expectState);
  })

  it('should init DragDrop "over Worktable Layout" state and return true, when dragging widget from Palette', async () => {
    const initState = fixtureAppState({
      ui: {
        dragDrop: {
          ...fixtureDragDropFromPaletteAdd()
        }
      }
    });
    const expectState: AppState = {
      ...initState,
      ui: {
        ...initState.ui,
        dragDrop: {
          ...initState.ui.dragDrop,
          over: { worktableLayout: { layoutItemId: newLayoutItemId, layoutItemXY: { x: 2, y: 2 } } }
        }
      }
    };
    const {
      appStore,
      dragOverWorktableLayoutUseCase
    } = await setup(initState)

    const retVal = dragOverWorktableLayoutUseCase({ x: 2, y: 2 });

    const newState = appStore.get();
    expect(retVal).toBe(true);
    expect(newState).toEqual(expectState);
  })

  it('should update DragDrop "over Worktable Layout" state and return true, if dragging widget from Palette to a new position', async () => {
    const initState = fixtureAppState({
      ui: {
        dragDrop: {
          ...fixtureDragDropFromPaletteAdd(),
          ...fixtureDragDropOverWorktableLayout({ layoutItemId: newLayoutItemId, layoutItemXY: { x: 1, y: 2 } })
        }
      }
    });
    const expectState: AppState = {
      ...initState,
      ui: {
        ...initState.ui,
        dragDrop: {
          ...initState.ui.dragDrop,
          over: { worktableLayout: { ...initState.ui.dragDrop.over!.worktableLayout!, layoutItemXY: { x: 3, y: 4 } } }
        }
      }
    };
    const {
      appStore,
      dragOverWorktableLayoutUseCase
    } = await setup(initState)

    const retVal = dragOverWorktableLayoutUseCase({ x: 3, y: 4 });

    const newState = appStore.get();
    expect(retVal).toBe(true);
    expect(newState).toEqual(expectState);
  })

  it('should not update DragDrop "over Worktable Layout" state and return true, if dragging widget from Palette to the same position', async () => {
    const pos = { x: 3, y: 4 };
    const initState = fixtureAppState({
      ui: {
        dragDrop: {
          ...fixtureDragDropFromPaletteAdd(),
          ...fixtureDragDropOverWorktableLayout({ layoutItemId: newLayoutItemId, layoutItemXY: pos })
        }
      }
    });
    const {
      appStore,
      dragOverWorktableLayoutUseCase
    } = await setup(initState)
    const expectState = appStore.get();

    const retVal = dragOverWorktableLayoutUseCase({ ...pos });

    expect(retVal).toBe(true);
    expect(appStore.get()).toBe(expectState);
  })

  it('should not update DragDrop "over Worktable Layout" state and return false, if not dragging widget', async () => {
    const initState = fixtureAppState({
      ui: {
        dragDrop: { ...fixtureDragDropNotDragging() }
      }
    });
    const {
      appStore,
      dragOverWorktableLayoutUseCase
    } = await setup(initState)
    const expectState = appStore.get();

    const retVal = dragOverWorktableLayoutUseCase({ x: 2, y: 2 });

    expect(retVal).toBe(false);
    expect(appStore.get()).toBe(expectState);
  })

  it('should not update DragDrop "over Worktable Layout" state and return false, if dragging item from Workflow Switcher', async () => {
    const initState = fixtureAppState({
      ui: {
        dragDrop: {
          ...fixtureDragDropFromWorkflowSwitcher()
        }
      }
    });
    const {
      appStore,
      dragOverWorktableLayoutUseCase
    } = await setup(initState)
    const expectState = appStore.get();

    const retVal = dragOverWorktableLayoutUseCase({ x: 2, y: 2 });

    expect(retVal).toBe(false);
    expect(appStore.get()).toBe(expectState);
  })
})
