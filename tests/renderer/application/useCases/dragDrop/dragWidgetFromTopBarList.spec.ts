/*
 * Copyright: (c) 2024, Alex Kaul
 * GNU General Public License v3.0 or later (see COPYING or https://www.gnu.org/licenses/gpl-3.0.txt)
 */

import { createDragWidgetFromTopBarListUseCase } from '@/application/useCases/dragDrop/dragWidgetFromTopBarList';
import { AppState } from '@/base/state/app';
import { fixtureWidgetListItemA } from '@tests/base/fixtures/widgetList';
import { fixtureAppState } from '@tests/base/state/fixtures/appState';
import { fixtureDragDropFromTopBarList, fixtureDragDropOverWorktableLayout } from '@tests/base/state/fixtures/dragDropState';
import { fixtureAppStore } from '@tests/data/fixtures/appStore';

const testId = 'TEST-ID';
const testWgtId = 'TEST-WGT-ID';

async function setup(initState: AppState) {
  const [appStore] = await fixtureAppStore(initState);
  const dragWidgetFromTopBarListUseCase = createDragWidgetFromTopBarListUseCase({
    appStore,
  });
  return {
    appStore,
    dragWidgetFromTopBarListUseCase
  }
}

describe('dragWidgetFromTopBarListUseCase()', () => {
  it('should update DragDrop "dragging widget" state and reset "over" state, if item with specified id exists', async () => {
    const initState = fixtureAppState({
      ui: {
        dragDrop: {
          ...fixtureDragDropFromTopBarList(),
          ...fixtureDragDropOverWorktableLayout()
        },
        shelf: {
          widgetList: [fixtureWidgetListItemA({ id: testId, widgetId: testWgtId })]
        }
      }
    });
    const expectState: AppState = {
      ...initState,
      ui: {
        ...initState.ui,
        dragDrop: {
          from: { topBarList: { listItemId: testId, widgetId: testWgtId } },
        },
      }
    };
    const {
      appStore,
      dragWidgetFromTopBarListUseCase
    } = await setup(initState)

    dragWidgetFromTopBarListUseCase(testWgtId, testId);

    const newState = appStore.get();
    expect(newState).toEqual(expectState);
  })

  it('should do nothing, if item with specified id does not exist', async () => {
    const initState = fixtureAppState({
      ui: {
        dragDrop: {
          ...fixtureDragDropFromTopBarList(),
          ...fixtureDragDropOverWorktableLayout()
        },
        shelf: {
          widgetList: [fixtureWidgetListItemA({})]
        }
      }
    });
    const {
      appStore,
      dragWidgetFromTopBarListUseCase
    } = await setup(initState)

    const expectState = appStore.get();
    dragWidgetFromTopBarListUseCase('NO-SUCH-ITEM', 'NO-SUCH-ITEM');

    expect(appStore.get()).toBe(expectState);
  })
})
