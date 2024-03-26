/*
 * Copyright: (c) 2024, Alex Kaul
 * GNU General Public License v3.0 or later (see COPYING or https://www.gnu.org/licenses/gpl-3.0.txt)
 */

import { dragDropStateActions } from '@/base/state/actions';
import { AppState } from '@/base/state/app';
import { fixtureAppState } from '@tests/base/state/fixtures/appState';
import { fixtureDragDropFromPaletteAdd, fixtureDragDropFromTopBarList, fixtureDragDropOverTopBarList, fixtureDragDropOverWorktableLayout } from '@tests/base/state/fixtures/dragDropState';

describe('dragDropStateActions', () => {
  it('should allow to reset the dragdrop state', () => {
    const dragState1 = fixtureAppState({
      ui: {
        dragDrop: {
          ...fixtureDragDropFromTopBarList(),
          ...fixtureDragDropOverTopBarList()
        }
      }
    })
    const dragState2 = fixtureAppState({
      ui: {
        dragDrop: {
          ...fixtureDragDropFromTopBarList(),
          ...fixtureDragDropOverWorktableLayout()
        }
      }
    })
    const expectState1: AppState = {
      ...dragState1,
      ui: {
        ...dragState1.ui,
        dragDrop: {}
      }
    }
    const expectState2: AppState = {
      ...dragState2,
      ui: {
        ...dragState2.ui,
        dragDrop: {}
      }
    }

    const state1AfterReset = dragDropStateActions.resetAll(dragState1);
    const state2AfterReset = dragDropStateActions.resetAll(dragState2);

    expect(state1AfterReset).toEqual(expectState1);
    expect(state2AfterReset).toEqual(expectState2);
  })

  it('should allow to reset the over props', () => {
    const dragState1 = fixtureAppState({
      ui: {
        dragDrop: {
          ...fixtureDragDropFromTopBarList(),
          ...fixtureDragDropOverTopBarList()
        }
      }
    })
    const expectState1: AppState = {
      ...dragState1,
      ui: {
        ...dragState1.ui,
        dragDrop: {
          from: dragState1.ui.dragDrop.from
        }
      }
    }
    const dragState2 = fixtureAppState({
      ui: {
        dragDrop: {
          ...fixtureDragDropFromPaletteAdd(),
          ...fixtureDragDropOverWorktableLayout()
        }
      }
    })
    const expectState2 = fixtureAppState({
      ...dragState2,
      ui: {
        ...dragState2.ui,
        dragDrop: {
          from: dragState2.ui.dragDrop.from
        }
      }
    })

    const state1AfterReset = dragDropStateActions.resetOver(dragState1);
    const state2AfterReset = dragDropStateActions.resetOver(dragState2);

    expect(state1AfterReset).toEqual(expectState1);
    expect(state2AfterReset).toEqual(expectState2);
  })
})
