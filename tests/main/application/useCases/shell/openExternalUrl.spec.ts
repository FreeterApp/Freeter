/*
 * Copyright: (c) 2024, Alex Kaul
 * GNU General Public License v3.0 or later (see COPYING or https://www.gnu.org/licenses/gpl-3.0.txt)
 */

import { createOpenExternalUrlUseCase } from '@/application/useCases/shell/openExternalUrl';
import { mockShellProvider } from '@tests/infra/mocks/shellProvider';

const providerRetVal = 'provider return value';
function setup() {
  const shellProviderMock = mockShellProvider({
    openExternal: jest.fn(async () => providerRetVal as unknown as void)
  })
  const useCase = createOpenExternalUrlUseCase({
    shellProvider: shellProviderMock
  });
  return {
    shellProviderMock,
    useCase
  }
}

describe('openExternalUrlUseCase()', () => {
  it('should call openExternal() of shellProvider with right params and return a right val', async () => {
    const testUrl = 'test://url'
    const { useCase, shellProviderMock } = setup()

    const res = await useCase(testUrl);

    expect(shellProviderMock.openExternal).toBeCalledTimes(1);
    expect(shellProviderMock.openExternal).toBeCalledWith(testUrl);
    expect(res).toBe(providerRetVal);
  });
})
