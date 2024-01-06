/*
 * Copyright: (c) 2024, Alex Kaul
 * GNU General Public License v3.0 or later (see COPYING or https://www.gnu.org/licenses/gpl-3.0.txt)
 */

import { globalShortcut } from 'electron';
import { GlobalShortcutProvider } from '@/application/interfaces/globalShortcutProvider';

export function createGlobalShortcutProvider(): GlobalShortcutProvider {
  let curMainAccelerator: string = '';
  return {
    setMainShortcut: async (accelerator, windowTarget) => {
      if (accelerator !== curMainAccelerator) {
        if (curMainAccelerator !== '') {
          globalShortcut.unregister(curMainAccelerator);
          curMainAccelerator = '';
        }

        if (accelerator !== '') {
          const res = globalShortcut.register(accelerator, () => {
            if (!windowTarget.isFocused() || !windowTarget.isVisible()) {
              windowTarget.show();
            } else {
              windowTarget.hide();
            }
          })
          if (res) {
            curMainAccelerator = accelerator;
          }
          return res;
        }
      }
      return true;
    },
    destroy: () => {
      globalShortcut.unregisterAll();
    }
  }
}
