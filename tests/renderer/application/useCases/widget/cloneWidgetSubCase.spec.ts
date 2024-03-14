/*
 * Copyright: (c) 2024, Alex Kaul
 * GNU General Public License v3.0 or later (see COPYING or https://www.gnu.org/licenses/gpl-3.0.txt)
 */

import { ObjectManager } from '@common/base/objectManager';
import { DataStorageRenderer } from '@/application/interfaces/dataStorage';
import { fixtureWidgetA } from '@tests/base/fixtures/widget';
import { createCloneWidgetSubCase } from '@/application/useCases/widget/cloneWidgetSubCase';
import { Widget } from '@/base/widget';

function setup() {
  const widgetDataStorageManagerMock: ObjectManager<DataStorageRenderer> = {
    copyObjectData: jest.fn(),
    getObject: jest.fn(),
  };
  const idGeneratorMock = jest.fn().mockImplementation(() => 'SOME-ID');
  const cloneWidgetSubCase = createCloneWidgetSubCase({
    widgetDataStorageManager: widgetDataStorageManagerMock,
    idGenerator: idGeneratorMock
  });

  return {
    cloneWidgetSubCase,
    widgetDataStorageManagerMock,
    idGeneratorMock
  }
}

beforeEach(() => {
  jest.clearAllMocks()
})

describe('cloneWidgetSubCase()', () => {
  it('should create a widget clone with a new id in the entities state', async () => {
    const widget = fixtureWidgetA();
    const widgetClone: Widget = {
      ...widget,
      id: widget.id + 'CLONE'
    }
    const {
      cloneWidgetSubCase,
      idGeneratorMock
    } = setup()
    idGeneratorMock.mockImplementationOnce(() => widgetClone.id)

    const gotWgt = await cloneWidgetSubCase(widget);

    expect(gotWgt).toEqual(widgetClone);
  })

  it('should call widgetDataStorageManager\'s copyObjectData with right args', async () => {
    const widget = fixtureWidgetA();
    const widgetClone: Widget = {
      ...widget,
      id: widget.id + 'CLONE'
    }
    const {
      cloneWidgetSubCase,
      idGeneratorMock,
      widgetDataStorageManagerMock
    } = setup()
    idGeneratorMock.mockImplementationOnce(() => widgetClone.id)

    await cloneWidgetSubCase(widget);

    expect(widgetDataStorageManagerMock.copyObjectData).toBeCalledTimes(1);
    expect(widgetDataStorageManagerMock.copyObjectData).toBeCalledWith(widget.id, widgetClone.id);
  })
})
