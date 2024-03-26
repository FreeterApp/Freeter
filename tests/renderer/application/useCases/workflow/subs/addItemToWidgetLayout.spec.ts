/*
 * Copyright: (c) 2024, Alex Kaul
 * GNU General Public License v3.0 or later (see COPYING or https://www.gnu.org/licenses/gpl-3.0.txt)
 */

import { createAddItemToWidgetLayoutSubCase } from '@/application/useCases/workflow/subs/addItemToWidgetLayout';
import { fixtureWidgetLayoutItemA, fixtureWidgetLayoutItemB, fixtureWidgetLayoutItemC } from '@tests/base/fixtures/widgetLayout';

function setup() {
  const idGeneratorMock = jest.fn().mockImplementation(() => 'SOME-ID');
  const addItemToWidgetLayoutSubCase = createAddItemToWidgetLayoutSubCase({
    idGenerator: idGeneratorMock
  });

  return {
    addItemToWidgetLayoutSubCase,
    idGeneratorMock
  }
}

beforeEach(() => {
  jest.clearAllMocks()
})

describe('addItemToWidgetLayoutSubCase()', () => {
  it('should add a new item to the widget layout at specified XY', async () => {
    const initLayout = [
      fixtureWidgetLayoutItemA({ rect: { x: 1, y: 2, w: 2, h: 2 } }),
      fixtureWidgetLayoutItemB({ rect: { x: 3, y: 2, w: 2, h: 2 } })
    ]
    const newItem = fixtureWidgetLayoutItemC({ rect: { x: 2, y: 1, w: 2, h: 2 } });
    const expectLayout = [
      fixtureWidgetLayoutItemA({ rect: { x: 1, y: 3, w: 2, h: 2 } }),
      fixtureWidgetLayoutItemB({ rect: { x: 3, y: 3, w: 2, h: 2 } }),
      newItem,
    ]
    const {
      addItemToWidgetLayoutSubCase,
      idGeneratorMock
    } = setup()
    idGeneratorMock.mockImplementationOnce(() => newItem.id)

    const gotLayout = addItemToWidgetLayoutSubCase(
      newItem.widgetId,
      initLayout,
      { w: newItem.rect.w, h: newItem.rect.h },
      { x: newItem.rect.x, y: newItem.rect.y }
    );

    expect(gotLayout).toEqual(expectLayout);
  })

  it('should add a new item to the widget layout at free area, when XY is not specified', async () => {
    const initLayout = [
      fixtureWidgetLayoutItemA({ rect: { x: 1, y: 1, w: 2, h: 2 } }),
      fixtureWidgetLayoutItemB({ rect: { x: 3, y: 1, w: 2, h: 2 } })
    ]
    const newItem = fixtureWidgetLayoutItemC({ rect: { x: 5, y: 0, w: 2, h: 2 } });
    const expectLayout = [
      ...initLayout,
      newItem,
    ]
    const {
      addItemToWidgetLayoutSubCase,
      idGeneratorMock
    } = setup()
    idGeneratorMock.mockImplementationOnce(() => newItem.id)

    const gotLayout = addItemToWidgetLayoutSubCase(
      newItem.widgetId,
      initLayout,
      { w: newItem.rect.w, h: newItem.rect.h }
    );

    expect(gotLayout).toEqual(expectLayout);
  })
})
