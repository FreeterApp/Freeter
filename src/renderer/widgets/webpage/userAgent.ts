/*
 * Copyright: (c) 2024, Alex Kaul
 * GNU General Public License v3.0 or later (see COPYING or https://www.gnu.org/licenses/gpl-3.0.txt)
 */

import { WidgetApi } from '@/widgets/types';
import { SettingsViewMode } from '@/widgets/webpage/settings';

export function createUserAgent(viewMode: SettingsViewMode, wapiProcess: WidgetApi['process']) {
  const ua: string[] = ['Mozilla/5.0'];

  const processInfo = wapiProcess.getProcessInfo();
  if (viewMode === 'mobile') {
    ua.push('(Linux; Android)');
  } else {
    switch (processInfo.os.name) {
      case 'darwin': {
        ua.push('(Macintosh)');
        break;
      }
      case 'linux': {
        ua.push('(Linux)');
        break;
      }
      case 'win32': {
        ua.push('(Windows)');
        break;
      }
      default: {
        ua.push('(-)');
        break;
      }
    }
  }

  ua.push(`Chrome/${processInfo.browser.ver}`)

  if (viewMode === 'mobile') {
    ua.push('Mobile')
  }

  return ua.join(' ');
}
