/*
 * Copyright: (c) 2024, Alex Kaul
 * GNU General Public License v3.0 or later (see COPYING or https://www.gnu.org/licenses/gpl-3.0.txt)
 */

import { createDragWidgetFromPaletteUseCase } from '@/application/useCases/dragDrop/dragWidgetFromPalette';
import { AppState } from '@/base/state/app';
import { fixtureAppState } from '@tests/base/state/fixtures/appState';
import { fixtureDragDropFromPalette, fixtureDragDropOverWorktableLayout } from '@tests/base/state/fixtures/dragDropState';
import { fixtureWidgetTypeAInColl } from '@tests/base/state/fixtures/entitiesState';
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
  it('should update DragDrop "dragging widget" state and reset "over" state, if widget type with specified id exists', async () => {
    const initState = fixtureAppState({
      entities: {
        widgetTypes: {
          ...fixtureWidgetTypeAInColl({ id: testId })
        }
      },
      ui: {
        dragDrop: {
          ...fixtureDragDropFromPalette(),
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

    dragWidgetFromPaletteUseCase(testId);

    const newState = appStore.get();
    expect(newState).toEqual(expectState);
  })

  it('should do nothing, if widget type with specified id does not exist', async () => {
    const initState = fixtureAppState({
      entities: {
        widgetTypes: {
          ...fixtureWidgetTypeAInColl()
        }
      },
      ui: {
        dragDrop: {
          ...fixtureDragDropFromPalette(),
          ...fixtureDragDropOverWorktableLayout()
        }
      }
    });
    const {
      appStore,
      dragWidgetFromPaletteUseCase
    } = await setup(initState)
    const expectState = appStore.get();

    dragWidgetFromPaletteUseCase('NO-SUCH-ID');

    expect(appStore.get()).toBe(expectState);
  })
})
