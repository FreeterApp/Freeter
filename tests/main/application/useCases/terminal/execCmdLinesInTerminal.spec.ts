/*
 * Copyright: (c) 2024, Alex Kaul
 * GNU General Public License v3.0 or later (see COPYING or https://www.gnu.org/licenses/gpl-3.0.txt)
 */

import { fixtureProcessInfoLinux, fixtureProcessInfoMac, fixtureProcessInfoWin } from '@testscommon/base/fixtures/process';
import { AppsProvider } from '@/application/interfaces/appsProvider';
import { ChildProcessProvider } from '@/application/interfaces/childProcessProvider';
import { ProcessProvider } from '@/application/interfaces/processProvider';
import { createExecCmdLinesInTerminalUseCase } from '@/application/useCases/terminal/execCmdLinesInTerminal';
import { ProcessInfo } from '@common/base/process';

function setup(processInfo: ProcessInfo, defaultTerminal: string) {
  const appsProviderMock: AppsProvider = {
    getDefaultTerminal: jest.fn(() => defaultTerminal)
  }
  const childProcessProviderMock: ChildProcessProvider = {
    spawnDetached: jest.fn()
  }
  const processProviderMock: ProcessProvider = {
    getProcessInfo: jest.fn(() => processInfo)
  }
  const useCase = createExecCmdLinesInTerminalUseCase({
    appsProvider: appsProviderMock,
    childProcessProvider: childProcessProviderMock,
    processProvider: processProviderMock,
  });
  return {
    appsProviderMock,
    childProcessProviderMock,
    processProviderMock,
    useCase
  }
}

describe('execCmdLinesInTerminalUseCase()', () => {
  it('should call spawnDetached() with right params for each cmdLine, when exec on linux', async () => {
    const testTerminal = 'some-terminal';
    const testCmdLines = ['cmd line 1', 'cmd line 2'];
    const testCwd = 'some/dir';
    const { useCase, childProcessProviderMock } = setup(fixtureProcessInfoLinux(), testTerminal)

    useCase(testCmdLines, testCwd);

    expect(childProcessProviderMock.spawnDetached).toBeCalledTimes(2);
    expect(childProcessProviderMock.spawnDetached).toHaveBeenNthCalledWith(1, testTerminal, ['-e', 'bash', '-c', `"${testCmdLines[0]}; exec bash"`], { cwd: testCwd, shell: true });
    expect(childProcessProviderMock.spawnDetached).toHaveBeenNthCalledWith(2, testTerminal, ['-e', 'bash', '-c', `"${testCmdLines[1]}; exec bash"`], { cwd: testCwd, shell: true });
  });

  it('should call spawnDetached() with right params for each cmdLine, when exec on win', async () => {
    const testTerminal = 'some-terminal';
    const testCmdLines = ['cmd line 1', 'cmd line 2'];
    const testCwd = 'some/dir';
    const { useCase, childProcessProviderMock } = setup(fixtureProcessInfoWin(), testTerminal)

    useCase(testCmdLines, testCwd);

    expect(childProcessProviderMock.spawnDetached).toBeCalledTimes(2);
    expect(childProcessProviderMock.spawnDetached).toHaveBeenNthCalledWith(1, 'cmd.exe', ['/k', '/s', `"${testCmdLines[0]}"`], { cwd: testCwd, shell: true });
    expect(childProcessProviderMock.spawnDetached).toHaveBeenNthCalledWith(2, 'cmd.exe', ['/k', '/s', `"${testCmdLines[1]}"`], { cwd: testCwd, shell: true });
  });

  it('should call spawnDetached() with right params for each cmdLine, when exec on mac', async () => {
    const testTerminal = 'some-terminal';
    const testCmdLines = ['cmd line 1', 'cmd line 2'];
    const testCwd = 'some/dir';
    const { useCase, childProcessProviderMock } = setup(fixtureProcessInfoMac(), testTerminal)

    useCase(testCmdLines, testCwd);

    expect(childProcessProviderMock.spawnDetached).toBeCalledTimes(2);
    expect(childProcessProviderMock.spawnDetached).toHaveBeenNthCalledWith(1, 'osascript', ['-e', expect.stringMatching(new RegExp(`tell application \\"Terminal\\".*do script \\"cd ${testCwd} && ${testCmdLines[0]}\\"`, 's'))], { cwd: testCwd });
    expect(childProcessProviderMock.spawnDetached).toHaveBeenNthCalledWith(2, 'osascript', ['-e', expect.stringMatching(new RegExp(`tell application \\"Terminal\\".*do script \\"cd ${testCwd} && ${testCmdLines[1]}\\"`, 's'))], { cwd: testCwd });
  });
})
