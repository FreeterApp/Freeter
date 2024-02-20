/*
 * Copyright: (c) 2024, Alex Kaul
 * GNU General Public License v3.0 or later (see COPYING or https://www.gnu.org/licenses/gpl-3.0.txt)
 */

import { BrowserWindow } from '@/application/interfaces/browserWindow';
import { DialogProvider } from '@/application/interfaces/dialogProvider';
import { createShowOpenFileDialogUseCase } from '@/application/useCases/dialog/showOpenFileDialog';
import { OpenFileDialogConfig, OpenDialogResult } from '@common/base/dialog';

const providerRetVal: OpenDialogResult = {
  canceled: false,
  filePaths: ['file/path']
};

function setup() {
  const dialogProviderMock: DialogProvider = {
    showMessageBox: jest.fn(),
    showOpenDirDialog: jest.fn(),
    showOpenFileDialog: jest.fn(async () => providerRetVal),
    showSaveFileDialog: jest.fn(),
  }
  const useCase = createShowOpenFileDialogUseCase({
    dialogProvider: dialogProviderMock
  });
  return {
    dialogProviderMock,
    useCase
  }
}

describe('showOpenFileDialogUseCase()', () => {
  it('should call showOpenFileDialog() of dialogProvider with right params and return a right val', async () => {
    const win = {} as unknown as BrowserWindow;
    const cfg: OpenFileDialogConfig = { title: 'title' };
    const { useCase, dialogProviderMock } = setup()

    const res = await useCase(win, cfg);

    expect(dialogProviderMock.showOpenFileDialog).toBeCalledTimes(1);
    expect(dialogProviderMock.showOpenFileDialog).toBeCalledWith(win, cfg);
    expect(res).toBe(providerRetVal);
  });
})
