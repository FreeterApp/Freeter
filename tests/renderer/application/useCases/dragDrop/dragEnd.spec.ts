/*
 * Copyright: (c) 2024, Alex Kaul
 * GNU General Public License v3.0 or later (see COPYING or https://www.gnu.org/licenses/gpl-3.0.txt)
 */

import { createDragEndUseCase } from '@/application/useCases/dragDrop/dragEnd';
import { AppState } from '@/base/state/app';
import { fixtureAppState } from '@tests/base/state/fixtures/appState';
import { fixtureDragDropFromTopBarList, fixtureDragDropFromWorktableLayout, fixtureDragDropOverTopBarList, fixtureDragDropOverWorktableLayout } from '@tests/base/state/fixtures/dragDropState';
import { fixtureAppStore } from '@tests/data/fixtures/appStore';

async function setup(initState: AppState) {
  const [appStore] = await fixtureAppStore(initState);
  const dragEndUseCase = createDragEndUseCase({ appStore });
  return {
    appStore,
    dragEndUseCase
  }
}

describe('dragEndUseCase()', () => {
  it('should reset dragDropState when dragging item from TopBar List', async () => {
    const initState = fixtureAppState({
      ui: {
        dragDrop: { ...fixtureDragDropFromTopBarList() }
      }
    });
    const expectState: AppState = {
      ...initState,
      ui: {
        ...initState.ui,
        dragDrop: {}
      }
    };
    const {
      appStore,
      dragEndUseCase
    } = await setup(initState)

    dragEndUseCase();

    const newState = appStore.get();
    expect(newState).toEqual(expectState);
  })

  it('should reset dragDropState when dragging item from Worktable Layout', async () => {
    const initState = fixtureAppState({
      ui: {
        dragDrop: { ...fixtureDragDropFromWorktableLayout() }
      }
    });
    const expectState: AppState = {
      ...initState,
      ui: {
        ...initState.ui,
        dragDrop: {}
      }
    };
    const {
      appStore,
      dragEndUseCase
    } = await setup(initState)

    dragEndUseCase();

    const newState = appStore.get();
    expect(newState).toEqual(expectState);
  })

  it('should reset dragDropState when dragging item over TopBar List', async () => {
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
        dragDrop: {}
      }
    };
    const {
      appStore,
      dragEndUseCase
    } = await setup(initState)

    dragEndUseCase();

    const newState = appStore.get();
    expect(newState).toEqual(expectState);
  })

  it('should reset dragDropState when dragging item over Worktable Layout', async () => {
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
        dragDrop: {}
      }
    };
    const {
      appStore,
      dragEndUseCase
    } = await setup(initState)

    dragEndUseCase();

    const newState = appStore.get();
    expect(newState).toEqual(expectState);
  })
})
