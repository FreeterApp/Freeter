/*
 * Copyright: (c) 2024, Alex Kaul
 * GNU General Public License v3.0 or later (see COPYING or https://www.gnu.org/licenses/gpl-3.0.txt)
 */

import { fixtureEntitiesState } from '@tests/base/state/fixtures/entitiesState';
import { ObjectManager } from '@common/base/objectManager';
import { DataStorageRenderer } from '@/application/interfaces/dataStorage';
import { fixtureWidgetA } from '@tests/base/fixtures/widget';
import { createCloneWidgetSubCase } from '@/application/useCases/widget/cloneWidgetSubCase';
import { EntitiesState } from '@/base/state/entities';

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
  it('should return null id and unchanged entities state, if there is no widget id in the entities state', async () => {
    const initState = fixtureEntitiesState({
      widgets: {}
    })
    const {
      cloneWidgetSubCase
    } = setup()
    const expectState = initState;

    const [gotId, gotState] = await cloneWidgetSubCase('NO-SUCH-ID', initState);

    expect(gotId).toBeNull();
    expect(gotState).toBe(expectState);
  })

  it('should create a widget clone with a new id in the entities state', async () => {
    const widgetId = 'WIDGET-ID';
    const newWidgetId = 'NEW-WIDGET-ID';
    const initState = fixtureEntitiesState({
      widgets: {
        [widgetId]: fixtureWidgetA({ id: widgetId })
      }
    })
    const {
      cloneWidgetSubCase,
      idGeneratorMock
    } = setup()
    idGeneratorMock.mockImplementationOnce(() => newWidgetId)
    const expectState: EntitiesState = {
      ...initState,
      widgets: {
        ...initState.widgets,
        [newWidgetId]: {
          ...initState.widgets[widgetId]!,
          id: newWidgetId
        }
      }
    };

    const [gotId, gotState] = await cloneWidgetSubCase(widgetId, initState);

    expect(gotId).toBe(newWidgetId);
    expect(gotState).toEqual(expectState);
  })

  it('should call widgetDataStorageManager\'s copyObjectData with right args', async () => {
    const widgetId = 'WIDGET-ID';
    const newWidgetId = 'NEW-WIDGET-ID';
    const initState = fixtureEntitiesState({
      widgets: {
        [widgetId]: fixtureWidgetA({ id: widgetId })
      }
    })
    const {
      cloneWidgetSubCase,
      idGeneratorMock,
      widgetDataStorageManagerMock
    } = setup()
    idGeneratorMock.mockImplementationOnce(() => newWidgetId)

    await cloneWidgetSubCase(widgetId, initState);

    expect(widgetDataStorageManagerMock.copyObjectData).toBeCalledTimes(1);
    expect(widgetDataStorageManagerMock.copyObjectData).toBeCalledWith(widgetId, newWidgetId);
  })
})
