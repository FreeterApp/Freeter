/*
 * Copyright: (c) 2024, Alex Kaul
 * GNU General Public License v3.0 or later (see COPYING or https://www.gnu.org/licenses/gpl-3.0.txt)
 */

import { WidgetApi } from '@/widgets/appModules';
import { SettingsViewMode } from '@/widgets/webpage/settings';

export function createUserAgent(viewMode: SettingsViewMode, wapiProcess: WidgetApi['process']) {
  let uaOS: string;

  const processInfo = wapiProcess.getProcessInfo();
  if (viewMode === 'mobile') {
    uaOS = '(Linux; Android)';
  } else {
    switch (processInfo.os.name) {
      case 'darwin': {
        uaOS = '(Macintosh)';
        break;
      }
      case 'linux': {
        uaOS = '(Linux)';
        break;
      }
      case 'win32': {
        uaOS = '(Windows)';
        break;
      }
      default: {
        uaOS = '(-)';
        break;
      }
    }
  }

  const uaChrome = `Chrome/${processInfo.browser.ver}${viewMode === 'mobile' ? ' Mobile' : ''}`;

  return `Mozilla/5.0 ${uaOS} AppleWebKit/537.36 (KHTML, like Gecko) ${uaChrome} Safari/537.36`;
}
