/*
 * Copyright: (c) 2024, Alex Kaul
 * GNU General Public License v3.0 or later (see COPYING or https://www.gnu.org/licenses/gpl-3.0.txt)
 */

import { createCloneWidgetSubCase } from '@/application/useCases/widget/subs/cloneWidget';
import { IdGenerator } from '@/application/interfaces/idGenerator';
import { fixtureWidgetA } from '@tests/base/fixtures/widget';
import { Widget } from '@/base/widget';
import { createCloneWidgetToWidgetLayoutSubCase } from '@/application/useCases/workflow/subs/cloneWidgetToWidgetLayout';
import { createAddItemToWidgetLayoutSubCase } from '@/application/useCases/workflow/subs/addItemToWidgetLayout';
import { fixtureWidgetLayoutItemA, fixtureWidgetLayoutItemB, fixtureWidgetLayoutItemC } from '@tests/base/fixtures/widgetLayout';
import { WidgetLayout } from '@/base/widgetLayout';

function setup() {
  const widgetIdGeneratorMock: jest.MockedFn<IdGenerator> = jest.fn().mockImplementation(() => 'SOME-W-ID');
  const widgetLayoutItemIdGeneratorMock: jest.MockedFn<IdGenerator> = jest.fn().mockImplementation(() => 'SOME-WL-ID');
  const cloneWidgetSubCase = createCloneWidgetSubCase({
    idGenerator: widgetIdGeneratorMock,
    widgetDataStorageManager: {
      copyObjectData: jest.fn(),
      getObject: jest.fn()
    }
  })
  const addItemToWidgetLayoutSubCase = createAddItemToWidgetLayoutSubCase({
    idGenerator: widgetLayoutItemIdGeneratorMock
  })
  const cloneWidgetToWidgetLayoutSubCase = createCloneWidgetToWidgetLayoutSubCase({
    cloneWidgetSubCase,
    addItemToWidgetLayoutSubCase
  })

  return {
    cloneWidgetToWidgetLayoutSubCase,
    widgetIdGeneratorMock,
    widgetLayoutItemIdGeneratorMock,
  }
}

beforeEach(() => {
  jest.clearAllMocks()
})

describe('cloneWidgetToWidgetLayoutSubCase()', () => {
  it('should return a widget clone with an unused name and an updated widgetLayout containing the widget at the right position', async () => {
    const widget = fixtureWidgetA();
    const usedNames = [widget.coreSettings.name + ' Copy 1', widget.coreSettings.name + ' Copy 2']
    const widgetClone: Widget = { ...widget, id: widget.id + 'CLONE', coreSettings: { ...widget.coreSettings, name: widget.coreSettings.name + ' Copy 3' } };
    const wgtLayout = [fixtureWidgetLayoutItemA({ rect: { x: 3, y: 3, w: 1, h: 1 } }), fixtureWidgetLayoutItemB({ rect: { x: 4, y: 4, w: 1, h: 1 } })]
    const newWgtLayout: WidgetLayout = [wgtLayout[0], wgtLayout[1], fixtureWidgetLayoutItemC({ widgetId: widgetClone.id, rect: { x: 1, y: 1, w: 2, h: 2 } })]
    const {
      cloneWidgetToWidgetLayoutSubCase,
      widgetIdGeneratorMock,
      widgetLayoutItemIdGeneratorMock
    } = setup()
    widgetIdGeneratorMock.mockReturnValueOnce(widgetClone.id);
    widgetLayoutItemIdGeneratorMock.mockReturnValueOnce(newWgtLayout[2].id);

    const [gotWidget, gotLayout] = await cloneWidgetToWidgetLayoutSubCase(widget, wgtLayout, usedNames, { w: 2, h: 2 }, { x: 1, y: 1 });

    expect(gotLayout).toEqual(newWgtLayout);
    expect(gotWidget).toEqual(widgetClone);
  })
})
