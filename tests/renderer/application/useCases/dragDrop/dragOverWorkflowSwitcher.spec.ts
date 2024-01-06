/*
 * Copyright: (c) 2024, Alex Kaul
 * GNU General Public License v3.0 or later (see COPYING or https://www.gnu.org/licenses/gpl-3.0.txt)
 */

import { createDragOverWorkflowSwitcherUseCase } from '@/application/useCases/dragDrop/dragOverWorkflowSwitcher';
import { AppState } from '@/base/state/app';
import { fixtureAppState } from '@tests/base/state/fixtures/appState';
import { fixtureDragDropFromPalette, fixtureDragDropFromTopBarList, fixtureDragDropFromWorkflowSwitcher, fixtureDragDropFromWorktableLayout, fixtureDragDropNotDragging, fixtureDragDropOverWorkflowSwitcher } from '@tests/base/state/fixtures/dragDropState';
import { fixtureAppStore } from '@tests/data/fixtures/appStore';

const testId = 'TEST-ID';

async function setup(initState: AppState) {
  const [appStore] = await fixtureAppStore(initState);
  const dragOverWorkflowSwitcherUseCase = createDragOverWorkflowSwitcherUseCase({ appStore });
  return {
    appStore,
    dragOverWorkflowSwitcherUseCase
  }
}

describe('dragOverWorkflowSwitcherUseCase()', () => {
  it('should update DragDrop "over Workflow Switcher" state and return true, if dragging widget from Workflow Switcher', async () => {
    const initState = fixtureAppState({
      ui: {
        dragDrop: {
          from: fixtureDragDropFromWorkflowSwitcher().from,
          over: fixtureDragDropOverWorkflowSwitcher({ workflowId: 'some id' }).over
        }
      }
    });
    const expectState: AppState = {
      ...initState,
      ui: {
        ...initState.ui,
        dragDrop: {
          ...initState.ui.dragDrop,
          over: { workflowSwitcher: { workflowId: testId } }
        }
      }
    };
    const {
      appStore,
      dragOverWorkflowSwitcherUseCase
    } = await setup(initState)

    const retVal = dragOverWorkflowSwitcherUseCase(testId);

    const newState = appStore.get();
    expect(retVal).toBe(true);
    expect(newState).toEqual(expectState);
  })

  it('should not update DragDrop "over Workflow Switcher" state and return true, when targetWorkflowId is the same', async () => {
    const initState = fixtureAppState({
      ui: {
        dragDrop: {
          from: fixtureDragDropFromWorkflowSwitcher().from,
          over: fixtureDragDropOverWorkflowSwitcher({ workflowId: testId }).over
        }
      }
    });
    const {
      appStore,
      dragOverWorkflowSwitcherUseCase
    } = await setup(initState)
    const expectState = appStore.get();

    const retVal = dragOverWorkflowSwitcherUseCase(testId);

    expect(retVal).toBe(true);
    expect(appStore.get()).toBe(expectState);
  })

  it('should not update DragDrop "over Workflow Switcher" state and return false, if not dragging', async () => {
    const initState = fixtureAppState({
      ui: {
        dragDrop: { ...fixtureDragDropNotDragging() }
      }
    });
    const {
      appStore,
      dragOverWorkflowSwitcherUseCase
    } = await setup(initState)

    const retVal = dragOverWorkflowSwitcherUseCase(testId);

    const newState = appStore.get();
    expect(retVal).toBe(false);
    expect(newState).toEqual(initState);
  })

  it('should not update DragDrop "over Workflow Switcher" state and return false, if dragging from Palette', async () => {
    const initState = fixtureAppState({
      ui: {
        dragDrop: {
          ...fixtureDragDropFromPalette()
        }
      }
    });
    const {
      appStore,
      dragOverWorkflowSwitcherUseCase
    } = await setup(initState)
    const expectState = appStore.get();

    const retVal = dragOverWorkflowSwitcherUseCase(testId);

    expect(retVal).toBe(false);
    expect(appStore.get()).toBe(expectState);
  })

  it('should not update DragDrop "over Workflow Switcher" state and return false, if dragging from TopBar List', async () => {
    const initState = fixtureAppState({
      ui: {
        dragDrop: {
          ...fixtureDragDropFromTopBarList()
        }
      }
    });
    const {
      appStore,
      dragOverWorkflowSwitcherUseCase
    } = await setup(initState)
    const expectState = appStore.get();

    const retVal = dragOverWorkflowSwitcherUseCase(testId);

    expect(retVal).toBe(false);
    expect(appStore.get()).toBe(expectState);
  })

  it('should not update DragDrop "over Workflow Switcher" state and return false, if dragging from Widget Layout', async () => {
    const initState = fixtureAppState({
      ui: {
        dragDrop: {
          ...fixtureDragDropFromWorktableLayout()
        }
      }
    });
    const {
      appStore,
      dragOverWorkflowSwitcherUseCase
    } = await setup(initState)
    const expectState = appStore.get();

    const retVal = dragOverWorkflowSwitcherUseCase(testId);

    expect(retVal).toBe(false);
    expect(appStore.get()).toBe(expectState);
  })
})
