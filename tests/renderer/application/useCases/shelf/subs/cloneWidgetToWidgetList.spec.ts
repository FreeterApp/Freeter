/*
 * Copyright: (c) 2024, Alex Kaul
 * GNU General Public License v3.0 or later (see COPYING or https://www.gnu.org/licenses/gpl-3.0.txt)
 */

import { createCloneWidgetSubCase } from '@/application/useCases/widget/subs/cloneWidget';
import { IdGenerator } from '@/application/interfaces/idGenerator';
import { fixtureWidgetA } from '@tests/base/fixtures/widget';
import { Widget } from '@/base/widget';
import { createCloneWidgetToWidgetListSubCase } from '@/application/useCases/shelf/subs/cloneWidgetToWidgetList';
import { createAddItemToWidgetListSubCase } from '@/application/useCases/shelf/subs/addItemToWidgetList';
import { fixtureWidgetListItemA, fixtureWidgetListItemB, fixtureWidgetListItemC } from '@tests/base/fixtures/widgetList';
import { WidgetList } from '@/base/widgetList';

function setup() {
  const widgetIdGeneratorMock: jest.MockedFn<IdGenerator> = jest.fn().mockImplementation(() => 'SOME-W-ID');
  const widgetListItemIdGeneratorMock: jest.MockedFn<IdGenerator> = jest.fn().mockImplementation(() => 'SOME-WL-ID');
  const cloneWidgetSubCase = createCloneWidgetSubCase({
    idGenerator: widgetIdGeneratorMock,
    widgetDataStorageManager: {
      copyObjectData: jest.fn(),
      getObject: jest.fn()
    }
  })
  const addItemToWidgetListSubCase = createAddItemToWidgetListSubCase({
    idGenerator: widgetListItemIdGeneratorMock
  })
  const cloneWidgetToWidgetListSubCase = createCloneWidgetToWidgetListSubCase({
    cloneWidgetSubCase,
    addItemToWidgetListSubCase
  })

  return {
    cloneWidgetToWidgetListSubCase,
    widgetIdGeneratorMock,
    widgetListItemIdGeneratorMock,
  }
}

beforeEach(() => {
  jest.clearAllMocks()
})

describe('cloneWidgetToWidgetListSubCase()', () => {
  it('should return a widget clone with an unused name and an updated widgetList containing the widget at the right position', async () => {
    const widget = fixtureWidgetA();
    const usedNames = [widget.coreSettings.name + ' Copy 1', widget.coreSettings.name + ' Copy 2']
    const widgetClone: Widget = { ...widget, id: widget.id + 'CLONE', coreSettings: { ...widget.coreSettings, name: widget.coreSettings.name + ' Copy 3' } };
    const wgtList = [fixtureWidgetListItemA(), fixtureWidgetListItemB()]
    const newWgtList: WidgetList = [wgtList[0], fixtureWidgetListItemC({ widgetId: widgetClone.id }), wgtList[1]]
    const {
      cloneWidgetToWidgetListSubCase,
      widgetIdGeneratorMock,
      widgetListItemIdGeneratorMock
    } = setup()
    widgetIdGeneratorMock.mockReturnValueOnce(widgetClone.id);
    widgetListItemIdGeneratorMock.mockReturnValueOnce(newWgtList[1].id);

    const [gotWidget, gotList] = await cloneWidgetToWidgetListSubCase(widget, wgtList, usedNames, wgtList[1].id);

    expect(gotList).toEqual(newWgtList);
    expect(gotWidget).toEqual(widgetClone);
  })
})
