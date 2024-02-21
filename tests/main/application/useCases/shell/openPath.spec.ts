/*
 * Copyright: (c) 2024, Alex Kaul
 * GNU General Public License v3.0 or later (see COPYING or https://www.gnu.org/licenses/gpl-3.0.txt)
 */

import { createOpenPathUseCase } from '@/application/useCases/shell/openPath';
import { mockShellProvider } from '@tests/infra/mocks/shellProvider';

const providerRetVal = 'provider return value';
function setup() {
  const shellProviderMock = mockShellProvider({
    openPath: jest.fn(async () => providerRetVal)
  })
  const useCase = createOpenPathUseCase({
    shellProvider: shellProviderMock
  });
  return {
    shellProviderMock,
    useCase
  }
}

describe('openPathUseCase()', () => {
  it('should call openPath() of shellProvider with right params and return a right val', async () => {
    const testPath = 'some/file/path'
    const { useCase, shellProviderMock } = setup()

    const res = await useCase(testPath);

    expect(shellProviderMock.openPath).toBeCalledTimes(1);
    expect(shellProviderMock.openPath).toBeCalledWith(testPath);
    expect(res).toBe(providerRetVal);
  });
})
