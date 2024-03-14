/*
 * Copyright: (c) 2024, Alex Kaul
 * GNU General Public License v3.0 or later (see COPYING or https://www.gnu.org/licenses/gpl-3.0.txt)
 */

import { CloneWidgetSubCase } from '@/application/useCases/widget/cloneWidgetSubCase';
import { createCloneWidgetLayoutItemSubCase } from '@/application/useCases/widgetLayout/cloneWidgetLayoutItemSubCase';
import { fixtureWidgetLayoutItemA } from '@tests/base/fixtures/widgetLayout';
import { IdGenerator } from '@/application/interfaces/idGenerator';
import { fixtureEntitiesState, fixtureWidgetAInColl } from '@tests/base/state/fixtures/entitiesState';

function setup() {
  const idGeneratorMock: jest.MockedFn<IdGenerator> = jest.fn().mockImplementation(() => 'SOME-ID');
  const cloneWidgetSubCaseMock: jest.MockedFn<CloneWidgetSubCase> = jest.fn().mockImplementation(async (_id, state) => [null, state]);
  const cloneWidgetLayoutItemSubCase = createCloneWidgetLayoutItemSubCase({
    idGenerator: idGeneratorMock,
    cloneWidgetSubCase: cloneWidgetSubCaseMock
  });

  return {
    cloneWidgetLayoutItemSubCase,
    idGeneratorMock,
    cloneWidgetSubCaseMock
  }
}

beforeEach(() => {
  jest.clearAllMocks()
})

describe('cloneWidgetLayoutItemSubCase()', () => {
  it('should call cloneWidgetSubCase with right params', async () => {
    const wgtLayoutItem = fixtureWidgetLayoutItemA({ widgetId: 'WGT-ID' });
    const initState = fixtureEntitiesState({})
    const {
      cloneWidgetLayoutItemSubCase,
      cloneWidgetSubCaseMock
    } = setup()

    await cloneWidgetLayoutItemSubCase(wgtLayoutItem, initState);

    expect(cloneWidgetSubCaseMock).toBeCalledWith(wgtLayoutItem.widgetId, initState);
  })

  it('should return null item and unchanged entities state, if cloneWidgetSubCase return null id', async () => {
    const wgtLayoutItem = fixtureWidgetLayoutItemA();
    const initState = fixtureEntitiesState({})
    const {
      cloneWidgetLayoutItemSubCase,
      cloneWidgetSubCaseMock
    } = setup()
    cloneWidgetSubCaseMock.mockResolvedValueOnce([null, initState]);
    const expectState = initState;

    const [gotItem, gotState] = await cloneWidgetLayoutItemSubCase(wgtLayoutItem, initState);

    expect(gotItem).toBeNull();
    expect(gotState).toBe(expectState);
  })

  it('should return a widgetLayoutItem clone with right ids and a state returned by cloneWidgetSubCase', async () => {
    const widgetId = 'WIDGET-ID';
    const layoutItemId = 'LAYOUT-ITEM-ID'
    const newWidgetId = 'NEW-WIDGET-ID';
    const newLayoutItemId = 'NEW-LAYOUT-ITEM-ID';
    const layoutItem = fixtureWidgetLayoutItemA({
      id: layoutItemId,
      widgetId
    })
    const initState = fixtureEntitiesState({
      widgets: {}
    })
    const {
      cloneWidgetLayoutItemSubCase,
      cloneWidgetSubCaseMock,
      idGeneratorMock
    } = setup()
    const stateAfterCloneWidget = fixtureEntitiesState({
      ...initState,
      widgets: fixtureWidgetAInColl()
    })
    cloneWidgetSubCaseMock.mockResolvedValueOnce([newWidgetId, stateAfterCloneWidget]);
    idGeneratorMock.mockImplementationOnce(() => newLayoutItemId)

    const [gotItem, gotState] = await cloneWidgetLayoutItemSubCase(layoutItem, initState);

    expect(gotItem).toEqual({
      ...layoutItem,
      id: newLayoutItemId,
      widgetId: newWidgetId
    });
    expect(gotState).toBe(stateAfterCloneWidget);
  })
})
