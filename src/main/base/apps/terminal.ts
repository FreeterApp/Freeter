/*
 * Copyright: (c) 2024, Alex Kaul
 * GNU General Public License v3.0 or later (see COPYING or https://www.gnu.org/licenses/gpl-3.0.txt)
 */

const escBackslashesDblQuotes = (str: string) => str.replace(/[\\"]/g, '\\$&');
const escBashCmdLine = escBackslashesDblQuotes;
const escAppleScriptCmdLine = escBackslashesDblQuotes;

export function createArgsFactoryToExecCmdLineInLinuxTerminal(terminal: string) {
  let factory: (cmdLine: string) => string[];

  switch (terminal) {
    case 'gnome-terminal': {
      factory = cmdLine => [terminal, '--', 'bash', '-c', `"${escBashCmdLine(`${cmdLine}; exec bash`)}"`];
      break;
    }
    default: {
      factory = cmdLine => [terminal, '-e', 'bash', '-c', `"${escBashCmdLine(`${cmdLine}; exec bash`)}"`];
    }
  }

  return factory;
}

export function createArgsFactoryToExecCmdLineInWinTerminal(terminal: string) {
  let factory: (cmdLine: string) => string[];

  switch (terminal.toLowerCase()) {
    default: {
      factory = cmdLine => ['cmd.exe', '/s', '/k', `"${cmdLine}"`];
    }
  }

  return factory;
}

export function createArgsFactoryToExecCmdLineInMacTerminal(terminal: string) {
  let factory: (cmdLine: string, cwd?: string) => string[];

  switch (terminal) {
    default: {
      factory = (cmdLine, cwd) => {
        const scriptCmdLine = escAppleScriptCmdLine(`${cwd ? `cd ${cwd} && ` : ''}${cmdLine}`);
        // Without 'launch' Terminal activation will cause it to start with an empty window, if it is not running
        const script = `\
          tell application "Terminal"\n\
            launch\n\
            activate\n\
            do script "${scriptCmdLine}"\n\
          end tell\n\
        `;

        return ['osascript', '-e', script]
      }

    }
  }

  return factory;
}
