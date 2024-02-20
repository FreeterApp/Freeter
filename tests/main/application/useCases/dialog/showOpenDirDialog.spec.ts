/*
 * Copyright: (c) 2024, Alex Kaul
 * GNU General Public License v3.0 or later (see COPYING or https://www.gnu.org/licenses/gpl-3.0.txt)
 */

import { BrowserWindow } from '@/application/interfaces/browserWindow';
import { DialogProvider } from '@/application/interfaces/dialogProvider';
import { createShowOpenDirDialogUseCase } from '@/application/useCases/dialog/showOpenDirDialog';
import { OpenDirDialogConfig, OpenDialogResult } from '@common/base/dialog';

const providerRetVal: OpenDialogResult = {
  canceled: false,
  filePaths: ['file/path']
};

function setup() {
  const dialogProviderMock: DialogProvider = {
    showMessageBox: jest.fn(),
    showOpenDirDialog: jest.fn(async () => providerRetVal),
    showOpenFileDialog: jest.fn(),
    showSaveFileDialog: jest.fn(),
  }
  const useCase = createShowOpenDirDialogUseCase({
    dialogProvider: dialogProviderMock
  });
  return {
    dialogProviderMock,
    useCase
  }
}

describe('showOpenDirDialogUseCase()', () => {
  it('should call showOpenDirDialog() of dialogProvider with right params and return a right val', async () => {
    const win = {} as unknown as BrowserWindow;
    const cfg: OpenDirDialogConfig = { title: 'title' };
    const { useCase, dialogProviderMock } = setup()

    const res = await useCase(win, cfg);

    expect(dialogProviderMock.showOpenDirDialog).toBeCalledTimes(1);
    expect(dialogProviderMock.showOpenDirDialog).toBeCalledWith(win, cfg);
    expect(res).toBe(providerRetVal);
  });
})
