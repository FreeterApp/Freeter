/*
 * Copyright: (c) 2024, Alex Kaul
 * GNU General Public License v3.0 or later (see COPYING or https://www.gnu.org/licenses/gpl-3.0.txt)
 */

import { ContextMenuProvider } from '@/application/interfaces/contextMenuProvider';
import { createShowWidgetContextMenuUseCase } from '@/application/useCases/widget/showWidgetContextMenu';
import { fixtureWidgetMenuItemA } from '@tests/base/fixtures/menu';

const widgetId = 'WIDGET-ID';

async function setup() {
  const contextMenuProviderMock: ContextMenuProvider = {
    show: jest.fn()
  }
  const useCase = createShowWidgetContextMenuUseCase({
    contextMenuProvider: contextMenuProviderMock
  });
  return {
    contextMenuProviderMock,
    useCase
  }
}

describe('showWidgetContextMenuUseCase()', () => {
  // it('should do nothing, if the widget id does not exist', async () => {
  //   const widget = fixtureWidgetA({ id: widgetId })
  //   const initState = fixtureAppState({
  //     entities: {
  //       widgets: {
  //         [widgetId]: widget
  //       }
  //     }
  //   })
  //   const {
  //     contextMenuProviderMock,
  //     useCase
  //   } = await setup(initState)

  //   useCase('NO-SUCH-ID', () => [], '', undefined);

  //   expect(contextMenuProviderMock.show).not.toBeCalled();
  // })

  it('should do nothing, if contextMenuFactory is undefined', async () => {
    const {
      contextMenuProviderMock,
      useCase
    } = await setup()

    useCase(widgetId, undefined, '', undefined);

    expect(contextMenuProviderMock.show).not.toBeCalled();
  })

  it('should call contextMenuFactory with a specified contextId and then call show() of contextMenuProvider with items returned by contextMenuFactory', async () => {
    const contextId = 'context-id';
    const contextData = { some: 'data' };
    const contextMenuItems = [fixtureWidgetMenuItemA()];
    const {
      contextMenuProviderMock,
      useCase
    } = await setup()

    useCase(
      widgetId,
      (ctxId, ctxData) => (ctxId === contextId && ctxData === contextData) ? contextMenuItems : [],
      contextId,
      contextData
    );

    expect(contextMenuProviderMock.show).toBeCalledTimes(1);
    expect(contextMenuProviderMock.show).toBeCalledWith(contextMenuItems);
  });
})
