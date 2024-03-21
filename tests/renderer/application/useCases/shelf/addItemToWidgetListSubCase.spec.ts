/*
 * Copyright: (c) 2024, Alex Kaul
 * GNU General Public License v3.0 or later (see COPYING or https://www.gnu.org/licenses/gpl-3.0.txt)
 */

import { createAddItemToWidgetListSubCase } from '@/application/useCases/shelf/addItemToWidgetListSubCase';
import { fixtureWidgetListItemA, fixtureWidgetListItemB, fixtureWidgetListItemC } from '@tests/base/fixtures/widgetList';

function setup() {
  const idGeneratorMock = jest.fn().mockImplementation(() => 'SOME-ID');
  const addItemToWidgetListSubCase = createAddItemToWidgetListSubCase({
    idGenerator: idGeneratorMock
  });

  return {
    addItemToWidgetListSubCase,
    idGeneratorMock
  }
}

beforeEach(() => {
  jest.clearAllMocks()
})

describe('addItemToWidgetListSubCase()', () => {
  it('should add a new item to the widget list', async () => {
    const initList = [fixtureWidgetListItemA(), fixtureWidgetListItemB()]
    const newItem = fixtureWidgetListItemC();
    const expectList = [fixtureWidgetListItemA(), newItem, fixtureWidgetListItemB()]
    const {
      addItemToWidgetListSubCase,
      idGeneratorMock
    } = setup()
    idGeneratorMock.mockImplementationOnce(() => newItem.id)

    const gotList = await addItemToWidgetListSubCase(newItem.widgetId, initList, initList[1].id);

    expect(gotList).toEqual(expectList);
  })
})
