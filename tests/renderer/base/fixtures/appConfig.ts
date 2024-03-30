/*
 * Copyright: (c) 2024, Alex Kaul
 * GNU General Public License v3.0 or later (see COPYING or https://www.gnu.org/licenses/gpl-3.0.txt)
 */

import { AppConfig } from '@/base/appConfig';
import { deepFreeze } from '@common/helpers/deepFreeze';

const appConfig: AppConfig = {
  mainHotkey: '',
  uiTheme: 'light'
}

export const fixtureAppConfig = (testData?: Partial<AppConfig>): AppConfig => deepFreeze({
  ...appConfig,
  ...testData
})
