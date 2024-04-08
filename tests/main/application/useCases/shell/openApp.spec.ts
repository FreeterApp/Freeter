/*
 * Copyright: (c) 2024, Alex Kaul
 * GNU General Public License v3.0 or later (see COPYING or https://www.gnu.org/licenses/gpl-3.0.txt)
 */

import { createOpenAppUseCase } from '@/application/useCases/shell/openApp';
import { mockChildProcessProvider } from '@tests/infra/mocks/childProcessProvider';

function setup() {
  const childProcessProviderMock = mockChildProcessProvider({
    spawnDetached: jest.fn()
  })
  const useCase = createOpenAppUseCase({
    childProcessProvider: childProcessProviderMock
  });
  return {
    childProcessProviderMock,
    useCase
  }
}

describe('openAppUseCase()', () => {
  it('should call spawnDetached() of childProcessProvider with right params', () => {
    const testPath = 'some/file/path'
    const testArgs = ['arg1', 'arg2']
    const { useCase, childProcessProviderMock } = setup()

    useCase(testPath, testArgs);

    expect(childProcessProviderMock.spawnDetached).toHaveBeenCalledTimes(1);
    expect(childProcessProviderMock.spawnDetached).toHaveBeenCalledWith(testPath, testArgs, { shell: false });
  });
})
