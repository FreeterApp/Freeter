/*
 * Copyright: (c) 2024, Alex Kaul
 * GNU General Public License v3.0 or later (see COPYING or https://www.gnu.org/licenses/gpl-3.0.txt)
 */

const escDblQuotes = (str: string) => str.replaceAll('"', '\\"');

export function createArgsFactoryToExecCmdLineInLinuxTerminal(terminal: string) {
  let factory: (cmdLine: string) => string[];

  switch (terminal) {
    case 'gnome-terminal': {
      factory = cmdLine => [terminal, '--', 'bash', '-c', `"${escDblQuotes(`${cmdLine}; exec bash`)}"`];
      break;
    }
    default: {
      factory = cmdLine => [terminal, '-e', 'bash', '-c', `"${escDblQuotes(`${cmdLine}; exec bash`)}"`];
    }
  }

  return factory;
}

export function createArgsFactoryToExecCmdLineInWinTerminal(terminal: string) {
  let factory: (cmdLine: string) => string[];

  switch (terminal.toLowerCase()) {
    default: {
      factory = cmdLine => ['cmd.exe', '/k', '/s', `"${escDblQuotes(cmdLine)}"`];
    }
  }

  return factory;
}

export function createArgsFactoryToExecCmdLineInMacTerminal() {
  const factory: (cmdLine: string, cwd?: string) => string[] = (cmdLine, cwd) => {
    const scriptCmdLine = escDblQuotes(`${cwd ? `cd ${cwd} && ` : ''}${cmdLine}`);
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
