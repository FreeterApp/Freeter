/*
 * Copyright: (c) 2024, Alex Kaul
 * GNU General Public License v3.0 or later (see COPYING or https://www.gnu.org/licenses/gpl-3.0.txt)
 */

import { BrowserWindow } from '@/application/interfaces/browserWindow';
import { DialogProvider } from '@/application/interfaces/dialogProvider';
import { createShowSaveFileDialogUseCase } from '@/application/useCases/dialog/showSaveFileDialog';
import { SaveFileDialogConfig, SaveDialogResult } from '@common/base/dialog';

const providerRetVal: SaveDialogResult = {
  canceled: false,
  filePath: 'file/path'
};

function setup() {
  const dialogProviderMock: DialogProvider = {
    showMessageBox: jest.fn(),
    showOpenDirDialog: jest.fn(),
    showOpenFileDialog: jest.fn(),
    showSaveFileDialog: jest.fn(async () => providerRetVal),
  }
  const useCase = createShowSaveFileDialogUseCase({
    dialogProvider: dialogProviderMock
  });
  return {
    dialogProviderMock,
    useCase
  }
}

describe('showSaveFileDialogUseCase()', () => {
  it('should call showSaveFileDialog() of dialogProvider with right params and return a right val', async () => {
    const win = {} as unknown as BrowserWindow;
    const cfg: SaveFileDialogConfig = { title: 'title' };
    const { useCase, dialogProviderMock } = setup()

    const res = await useCase(win, cfg);

    expect(dialogProviderMock.showSaveFileDialog).toBeCalledTimes(1);
    expect(dialogProviderMock.showSaveFileDialog).toBeCalledWith(win, cfg);
    expect(res).toBe(providerRetVal);
  });
})
