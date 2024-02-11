/*
 * Copyright: (c) 2024, Alex Kaul
 * GNU General Public License v3.0 or later (see COPYING or https://www.gnu.org/licenses/gpl-3.0.txt)
 */

import { BrowserWindow } from '@/application/interfaces/browserWindow';
import { DialogProvider } from '@/application/interfaces/dialogProvider';
import { createShowMessageBoxUseCase } from '@/application/useCases/dialog/showMessageBox';
import { MessageBoxConfig, MessageBoxResult } from '@common/base/dialog';

const providerRetVal: MessageBoxResult = {
  checkboxChecked: false,
  response: 1
};

function setup() {
  const dialogProviderMock: DialogProvider = {
    showMessageBox: jest.fn(async () => providerRetVal),
    showOpenDirDialog: jest.fn(),
    showOpenFileDialog: jest.fn(),
    showSaveFileDialog: jest.fn(),
  }
  const useCase = createShowMessageBoxUseCase({
    dialogProvider: dialogProviderMock
  });
  return {
    dialogProviderMock,
    useCase
  }
}

describe('showMessageBoxUseCase()', () => {
  it('should call showMessageBox() of dialogProvider with right params and return a right val', async () => {
    const win = {} as unknown as BrowserWindow;
    const cfg: MessageBoxConfig = { message: 'Test' };
    const { useCase, dialogProviderMock } = setup()

    const res = await useCase(win, cfg);

    expect(dialogProviderMock.showMessageBox).toBeCalledTimes(1);
    expect(dialogProviderMock.showMessageBox).toBeCalledWith(win, cfg);
    expect(res).toBe(providerRetVal);
  });
})
