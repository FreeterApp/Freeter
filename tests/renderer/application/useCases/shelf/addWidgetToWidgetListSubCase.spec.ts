/*
 * Copyright: (c) 2024, Alex Kaul
 * GNU General Public License v3.0 or later (see COPYING or https://www.gnu.org/licenses/gpl-3.0.txt)
 */

import { createAddWidgetToWidgetListSubCase } from '@/application/useCases/shelf/addWidgetToWidgetListSubCase';
import { fixtureWidgetListItemA, fixtureWidgetListItemB, fixtureWidgetListItemC } from '@tests/base/fixtures/widgetList';

function setup() {
  const idGeneratorMock = jest.fn().mockImplementation(() => 'SOME-ID');
  const addWidgetToWidgetListSubCase = createAddWidgetToWidgetListSubCase({
    idGenerator: idGeneratorMock
  });

  return {
    addWidgetToWidgetListSubCase,
    idGeneratorMock
  }
}

beforeEach(() => {
  jest.clearAllMocks()
})

describe('addWidgetToWidgetListSubCase()', () => {
  it('should add a new item to the widget list', async () => {
    const initList = [fixtureWidgetListItemA(), fixtureWidgetListItemB()]
    const newItem = fixtureWidgetListItemC();
    const expectList = [fixtureWidgetListItemA(), newItem, fixtureWidgetListItemB()]
    const {
      addWidgetToWidgetListSubCase,
      idGeneratorMock
    } = setup()
    idGeneratorMock.mockImplementationOnce(() => newItem.id)

    const gotList = await addWidgetToWidgetListSubCase(newItem.widgetId, initList, initList[1].id);

    expect(gotList).toEqual(expectList);
  })
})
