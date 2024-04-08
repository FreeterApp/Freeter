/*
 * Copyright: (c) 2024, Alex Kaul
 * GNU General Public License v3.0 or later (see COPYING or https://www.gnu.org/licenses/gpl-3.0.txt)
 */

import { createOpenAppUseCase } from '@/application/useCases/shell/openApp';
import { ProcessInfo } from '@common/base/process';
import { mockChildProcessProvider } from '@tests/infra/mocks/childProcessProvider';
import { mockProcessProvider } from '@tests/infra/mocks/processProvider';
import { fixtureProcessInfoLinux, fixtureProcessInfoMac, fixtureProcessInfoWin } from '@testscommon/base/fixtures/process';

function setup(processInfo: ProcessInfo) {
  const childProcessProviderMock = mockChildProcessProvider({
    spawnDetached: jest.fn()
  })
  const processProviderMock = mockProcessProvider({
    getProcessInfo: jest.fn(() => processInfo)
  })
  const useCase = createOpenAppUseCase({
    childProcessProvider: childProcessProviderMock,
    processProvider: processProviderMock
  });
  return {
    childProcessProviderMock,
    useCase
  }
}

describe('openAppUseCase()', () => {
  it('should call spawnDetached() of childProcessProvider with right params, when os=linux', () => {
    const testPath = 'some/file/path'
    const testArgs = ['arg1', 'arg2']
    const { useCase, childProcessProviderMock } = setup(fixtureProcessInfoLinux())

    useCase(testPath, testArgs);

    expect(childProcessProviderMock.spawnDetached).toHaveBeenCalledTimes(1);
    expect(childProcessProviderMock.spawnDetached).toHaveBeenCalledWith(testPath, testArgs, { shell: false });
  });
  it('should call spawnDetached() of childProcessProvider with right params, when os=win', () => {
    const testPath = 'some/file/path'
    const testArgs = ['arg1', 'arg2']
    const { useCase, childProcessProviderMock } = setup(fixtureProcessInfoWin())

    useCase(testPath, testArgs);

    expect(childProcessProviderMock.spawnDetached).toHaveBeenCalledTimes(1);
    expect(childProcessProviderMock.spawnDetached).toHaveBeenCalledWith(testPath, testArgs, { shell: false });
  });
  it('should call spawnDetached() of childProcessProvider with right params, when os=mac', () => {
    const testPath = 'some/file/path'
    const testArgs = ['arg1', 'arg2']
    const { useCase, childProcessProviderMock } = setup(fixtureProcessInfoMac())

    useCase(testPath, testArgs);

    expect(childProcessProviderMock.spawnDetached).toHaveBeenCalledTimes(1);
    expect(childProcessProviderMock.spawnDetached).toHaveBeenCalledWith('open', [testPath, '--args', ...testArgs], { shell: false });
  });
})
