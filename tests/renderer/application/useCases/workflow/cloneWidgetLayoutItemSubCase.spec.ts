/*
 * Copyright: (c) 2024, Alex Kaul
 * GNU General Public License v3.0 or later (see COPYING or https://www.gnu.org/licenses/gpl-3.0.txt)
 */

import { createCloneWidgetSubCase } from '@/application/useCases/widget/cloneWidgetSubCase';
import { createCloneWidgetLayoutItemSubCase } from '@/application/useCases/workflow/cloneWidgetLayoutItemSubCase';
import { fixtureWidgetLayoutItemA } from '@tests/base/fixtures/widgetLayout';
import { IdGenerator } from '@/application/interfaces/idGenerator';
import { WorkflowEntityDeps } from '@/base/state/entities';
import { WidgetLayoutItem } from '@/base/widgetLayout';
import { fixtureWidgetA } from '@tests/base/fixtures/widget';
import { Widget } from '@/base/widget';

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
  const cloneWidgetLayoutItemSubCase = createCloneWidgetLayoutItemSubCase({
    cloneWidgetSubCase,
    idGenerator: widgetLayoutItemIdGeneratorMock
  })

  return {
    cloneWidgetLayoutItemSubCase,
    widgetIdGeneratorMock,
    widgetLayoutItemIdGeneratorMock,
  }
}

beforeEach(() => {
  jest.clearAllMocks()
})

describe('cloneWidgetLayoutItemSubCase()', () => {
  it('should return null items, if entityDeps does not have the widget', async () => {
    const wgtLayoutItem = fixtureWidgetLayoutItemA({ widgetId: 'NO-SUCH-ID' });
    const deps: WorkflowEntityDeps = {
      widgets: {}
    }
    const {
      cloneWidgetLayoutItemSubCase,
    } = setup()

    const [gotLayoutItem, gotWidget] = await cloneWidgetLayoutItemSubCase(wgtLayoutItem, deps);

    expect(gotLayoutItem).toBeNull();
    expect(gotWidget).toBeNull();
  })

  it('should return a widget and widgetLayoutItem clones with right ids', async () => {
    const widget = fixtureWidgetA();
    const widgetClone: Widget = { ...widget, id: widget.id + 'CLONE' };
    const wgtLayoutItem = fixtureWidgetLayoutItemA({ widgetId: widget.id });
    const wgtLayoutItemClone: WidgetLayoutItem = { ...wgtLayoutItem, id: wgtLayoutItem.id + 'CLONE', widgetId: widgetClone.id };
    const deps: WorkflowEntityDeps = {
      widgets: {
        [widget.id]: widget
      }
    }
    const {
      cloneWidgetLayoutItemSubCase,
      widgetIdGeneratorMock,
      widgetLayoutItemIdGeneratorMock
    } = setup()
    widgetIdGeneratorMock.mockReturnValueOnce(widgetClone.id);
    widgetLayoutItemIdGeneratorMock.mockReturnValueOnce(wgtLayoutItemClone.id);

    const [gotLayoutItem, gotWidget] = await cloneWidgetLayoutItemSubCase(wgtLayoutItem, deps);

    expect(gotLayoutItem).toEqual(wgtLayoutItemClone);
    expect(gotWidget).toEqual(widgetClone);
  })
})
