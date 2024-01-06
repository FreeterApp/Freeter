/*
 * Copyright: (c) 2024, Alex Kaul
 * GNU General Public License v3.0 or later (see COPYING or https://www.gnu.org/licenses/gpl-3.0.txt)
 */

import { ProcessProvider } from '@/application/interfaces/processProvider';

type Deps = {
  process: ProcessProvider;
}

export function createGetMainHotkeyOptionsUseCase({
  process,
}: Deps) {
  const { isMac } = process.getProcessInfo();

  const hotkeyOptions: { caption: string; value: string }[] = [
    { caption: 'Disable Hotkey', value: '' },
    { caption: (isMac ? 'Alt+Command+F' : 'Alt+Ctrl+F'), value: 'Alt+CmdOrCtrl+F' },
    { caption: (isMac ? 'Alt+Command+Space' : 'Alt+Ctrl+Space'), value: 'Alt+CmdOrCtrl+Space' },
    { caption: (isMac ? 'Alt+Command+Shift+F' : 'Alt+Ctrl+Shift+F'), value: 'Alt+CmdOrCtrl+Shift+F' },
    { caption: (isMac ? 'Alt+Command+Shift+Space' : 'Alt+Ctrl+Shift+Space'), value: 'Alt+CmdOrCtrl+Shift+Space' },
    { caption: (isMac ? 'Alt+Shift+F' : 'Alt+Shift+F'), value: 'Alt+Shift+F' },
    { caption: (isMac ? 'Alt+Shift+Space' : 'Alt+Shift+Space'), value: 'Alt+Shift+Space' },
    { caption: (isMac ? 'Command+Shift+F' : 'Ctrl+Shift+F'), value: 'CmdOrCtrl+Shift+F' },
    { caption: (isMac ? 'Command+Shift+Space' : 'Ctrl+Shift+Space'), value: 'CmdOrCtrl+Shift+Space' },
  ];

  const useCase = () => hotkeyOptions;

  return useCase;
}

export type GetMainHotkeyOptionsUseCase = ReturnType<typeof createGetMainHotkeyOptionsUseCase>;
