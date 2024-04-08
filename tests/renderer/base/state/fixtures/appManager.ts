/*
 * Copyright: (c) 2024, Alex Kaul
 * GNU General Public License v3.0 or later (see COPYING or https://www.gnu.org/licenses/gpl-3.0.txt)
 */

import { AppManagerState } from '@/base/state/ui';
import { deepFreeze } from '@common/helpers/deepFreeze';

const appManagerState: AppManagerState = {
  currentAppId: '',
  deleteAppIds: null,
  apps: null,
  appIds: null,
}

export const fixtureAppManager = (testData?: Partial<AppManagerState>): AppManagerState => deepFreeze({
  ...appManagerState,
  ...testData
})
