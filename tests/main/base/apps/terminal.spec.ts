/*
 * Copyright: (c) 2024, Alex Kaul
 * GNU General Public License v3.0 or later (see COPYING or https://www.gnu.org/licenses/gpl-3.0.txt)
 */

import { createArgsFactoryToExecCmdLineInLinuxTerminal, createArgsFactoryToExecCmdLineInMacTerminal, createArgsFactoryToExecCmdLineInWinTerminal } from '@/base/apps/terminal'

describe('createArgsFactoryToExecCmdLineInLinuxTerminal()', () => {
  it('should create an args factory', () => {
    const gotFactory = createArgsFactoryToExecCmdLineInLinuxTerminal('some-terminal');

    expect(Array.isArray(gotFactory('some-cmd'))).toBe(true);
  })

  describe('factory', () => {
    it.each<[expectedRes: string[], terminal: string, cmdLine: string]>([
      [['gnome-terminal', '--', 'bash', '-c', '"simple-cmd; exec bash"'], 'gnome-terminal', 'simple-cmd'],
      [['gnome-terminal', '--', 'bash', '-c', '"cmd with \\"quotes\\" and \\\\backslashes\\\\; exec bash"'], 'gnome-terminal', 'cmd with "quotes" and \\backslashes\\'],

      [['konsole', '-e', 'bash', '-c', '"simple-cmd; exec bash"'], 'konsole', 'simple-cmd'],
      [['konsole', '-e', 'bash', '-c', '"cmd with \\"quotes\\" and \\\\backslashes\\\\; exec bash"'], 'konsole', 'cmd with "quotes" and \\backslashes\\'],

      [['xterm', '-e', 'bash', '-c', '"simple-cmd; exec bash"'], 'xterm', 'simple-cmd'],
      [['xterm', '-e', 'bash', '-c', '"cmd with \\"quotes\\" and \\\\backslashes\\\\; exec bash"'], 'xterm', 'cmd with "quotes" and \\backslashes\\'],
    ])(
      'should create "%p" args when the terminal is "%s" and cmdLine is "%s"',
      (expectedRes, terminal, cmdLine) => {
        const factory = createArgsFactoryToExecCmdLineInLinuxTerminal(terminal);

        const gotRes = factory(cmdLine);

        expect(gotRes).toEqual(expectedRes);
      }
    )
  })
})

describe('createArgsFactoryToExecCmdLineInWinTerminal()', () => {
  it('should create an args factory', () => {
    const gotFactory = createArgsFactoryToExecCmdLineInWinTerminal('some-terminal');

    expect(Array.isArray(gotFactory('some-cmd'))).toBe(true);
  })

  describe('factory', () => {
    it.each<[expectedRes: string[], terminal: string, cmdLine: string]>([
      [['cmd.exe', '/s', '/k', '"simple-cmd"'], 'cmd.exe', 'simple-cmd'],
      [['cmd.exe', '/s', '/k', '"cmd with "quotes" and \\backslashes\\"'], 'cmd.exe', 'cmd with "quotes" and \\backslashes\\'],

      [['cmd.exe', '/s', '/k', '"simple-cmd"'], 'cmd', 'simple-cmd'],
      [['cmd.exe', '/s', '/k', '"cmd with "quotes" and \\backslashes\\"'], 'cmd', 'cmd with "quotes" and \\backslashes\\'],
    ])(
      'should create "%p" args when the terminal is "%s" and cmdLine is "%s"',
      (expectedRes, terminal, cmdLine) => {
        const factory = createArgsFactoryToExecCmdLineInWinTerminal(terminal);

        const gotRes = factory(cmdLine);

        expect(gotRes).toEqual(expectedRes);
      }
    )
  })

  describe('createArgsFactoryToExecCmdLineInMacTerminal()', () => {
    it('should create an args factory', () => {
      const gotFactory = createArgsFactoryToExecCmdLineInMacTerminal('some-terminal');

      expect(Array.isArray(gotFactory('some-cmd'))).toBe(true);
    })

    describe('factory', () => {
      it.each<[expectedRes: string[], terminal: string, cmdLine: string, cwd: string | undefined]>([
        [['osascript', '-e', expect.stringMatching(new RegExp('tell application \\"Terminal\\".*do script \\"cd some/dir && simple-cmd\\"', 's'))], 'Terminal.app', 'simple-cmd', 'some/dir'],
        [['osascript', '-e', expect.stringMatching(new RegExp('tell application \\"Terminal\\".*do script \\"cmd with \\\\\\"quotes\\\\\\" and \\\\\\\\backslashes\\\\\\\\\\"', 's'))], 'Terminal.app', 'cmd with "quotes" and \\backslashes\\', undefined],
      ])(
        'should create "%p" args when the terminal is "%s", cmdLine is "%s" and cwd is "%s"',
        (expectedRes, terminal, cmdLine, cwd) => {
          const factory = createArgsFactoryToExecCmdLineInMacTerminal(terminal);

          const gotRes = factory(cmdLine, cwd);

          expect(gotRes).toEqual(expectedRes);
        }
      )
    })
  })
})
