/*
 * Copyright: (c) 2024, Alex Kaul
 * GNU General Public License v3.0 or later (see COPYING or https://www.gnu.org/licenses/gpl-3.0.txt)
 */

import { createDragWidgetFromPaletteUseCase } from '@/application/useCases/dragDrop/dragWidgetFromPalette';
import { AppState } from '@/base/state/app';
import { fixtureAppState } from '@tests/base/state/fixtures/appState';
import { fixtureDragDropFromPaletteAdd, fixtureDragDropOverWorktableLayout } from '@tests/base/state/fixtures/dragDropState';
import { fixtureAppStore } from '@tests/data/fixtures/appStore';

const testId = 'TEST-ID';

async function setup(initState: AppState) {
  const [appStore] = await fixtureAppStore(initState);
  const dragWidgetFromPaletteUseCase = createDragWidgetFromPaletteUseCase({
    appStore,
  });
  return {
    appStore,
    dragWidgetFromPaletteUseCase
  }
}

describe('dragWidgetFromPaletteUseCase()', () => {
  it('should set DragDrop "widgetTypeId" state and reset "over" state, if widget type is specified', async () => {
    const initState = fixtureAppState({
      ui: {
        dragDrop: {
          ...fixtureDragDropFromPaletteAdd(),
          ...fixtureDragDropOverWorktableLayout()
        }
      }
    });
    const expectState: AppState = {
      ...initState,
      ui: {
        ...initState.ui,
        dragDrop: {
          from: { palette: { widgetTypeId: testId } },
        }
      }
    };
    const {
      appStore,
      dragWidgetFromPaletteUseCase
    } = await setup(initState)

    dragWidgetFromPaletteUseCase({ widgetTypeId: testId });

    const newState = appStore.get();
    expect(newState).toEqual(expectState);
  })

  it('should set DragDrop "widgetCopyId" state and reset "over" state, if widget type is specified', async () => {
    const initState = fixtureAppState({
      ui: {
        dragDrop: {
          ...fixtureDragDropFromPaletteAdd(),
          ...fixtureDragDropOverWorktableLayout()
        }
      }
    });
    const expectState: AppState = {
      ...initState,
      ui: {
        ...initState.ui,
        dragDrop: {
          from: { palette: { widgetCopyId: testId } },
        }
      }
    };
    const {
      appStore,
      dragWidgetFromPaletteUseCase
    } = await setup(initState)

    dragWidgetFromPaletteUseCase({ widgetCopyId: testId });

    const newState = appStore.get();
    expect(newState).toEqual(expectState);
  })

})
