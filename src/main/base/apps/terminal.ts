/*
 * Copyright: (c) 2024, Alex Kaul
 * GNU General Public License v3.0 or later (see COPYING or https://www.gnu.org/licenses/gpl-3.0.txt)
 */

export function createArgsFactoryToExecCmdLineInLinuxTerminal(terminal: string) {
  let factory: (cmdLine: string) => string[];

  switch (terminal) {
    case 'gnome-terminal': {
      factory = cmdLine => [terminal, '--', 'sh', '-c', cmdLine];
      break;
    }
    default: {
      factory = cmdLine => [terminal, '-e', 'sh', '-c', cmdLine];
    }
  }

  return factory;
}

export function createArgsFactoryToExecCmdLineInWinTerminal(terminal: string) {
  let factory: (cmdLine: string) => string[];

  switch (terminal.toLowerCase()) {
    default: {
      factory = cmdLine => ['cmd.exe', '/s', '/c', `"${cmdLine}"`];
    }
  }

  return factory;
}

export function createArgsFactoryToExecCmdLineInMacTerminal() {
  const factory: (cmdLine: string, cwd?: string) => string[] = (cmdLine, cwd) => {
    const scriptCmdLine = `${cwd ? `cd ${cwd} && ` : ''}${cmdLine}`.replaceAll('"', '\\"');
    const script = `\
      if application "Terminal" is running then\n\
        tell application "Terminal"\n\
            activate\n\
            do script "${scriptCmdLine}"\n\
        end tell\n\
      else\n\
        tell application "Terminal"\n\
            activate\n\
            do script "${scriptCmdLine}" in window 1\n\
        end tell\n\
      end if\n\
    `;

    return ['osascript', '-e', script]
  }

  return factory;
}
