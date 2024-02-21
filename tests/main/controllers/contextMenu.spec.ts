/*
 * Copyright: (c) 2024, Alex Kaul
 * GNU General Public License v3.0 or later (see COPYING or https://www.gnu.org/licenses/gpl-3.0.txt)
 */

import { ipcPopupOsContextMenuChannel } from '@common/ipc/channels';
import { createContextMenuControllers } from '@/controllers/contextMenu';
import { fixtureIpcMainEvent } from '@tests/infra/mocks/ipcMain';
import { MenuItemsIpc } from '@common/base/menu';
import { fixtureMenuItemIpcA, fixtureMenuItemIpcB } from '@testscommon/base/fixtures/menu';

const popupUseCaseRes = 999;

function setup() {
  const popupContextMenuUseCase = jest.fn(async () => popupUseCaseRes);

  const [
    popupContextMenuController
  ] = createContextMenuControllers({
    popupContextMenuUseCase,
  })

  return {
    popupContextMenuUseCase,
    popupContextMenuController,
  }
}

describe('ContextMenuControllers', () => {
  describe('PopupContextMenuController', () => {
    it('should have a right channel name', () => {
      const { channel } = setup().popupContextMenuController;

      expect(channel).toBe(ipcPopupOsContextMenuChannel)
    })

    it('should call a right usecase with right params and return a right value', async () => {
      const testItems: MenuItemsIpc = [fixtureMenuItemIpcA(), fixtureMenuItemIpcB()];

      const { popupContextMenuController, popupContextMenuUseCase } = setup();
      const { handle } = popupContextMenuController;
      const event = fixtureIpcMainEvent();

      const res = await handle(event, testItems);

      expect(popupContextMenuUseCase).toBeCalledTimes(1);
      expect(popupContextMenuUseCase).toBeCalledWith(testItems);
      expect(res).toBe(popupUseCaseRes);
    });
  })
})
