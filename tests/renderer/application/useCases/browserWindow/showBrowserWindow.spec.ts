/*
 * Copyright: (c) 2024, Alex Kaul
 * GNU General Public License v3.0 or later (see COPYING or https://www.gnu.org/licenses/gpl-3.0.txt)
 */

import { BrowserWindowProvider } from '@/application/interfaces/browserWindowProvider';
import { createShowBrowserWindowUseCase } from '@/application/useCases/browserWindow/showBrowserWindow';

function setup() {
  const browserWindowProviderMock: BrowserWindowProvider = {
    show: jest.fn()
  };
  const useCase = createShowBrowserWindowUseCase({ browserWindow: browserWindowProviderMock });
  return {
    useCase,
    browserWindowProviderMock
  }
}

describe('showBrowserWindowUseCase()', () => {
  it('should call provider\'s show()', async () => {
    const { useCase, browserWindowProviderMock } = setup()

    useCase();

    expect(browserWindowProviderMock.show).toBeCalledTimes(1);
  });
})
