/*
 * Copyright: (c) 2024, Alex Kaul
 * GNU General Public License v3.0 or later (see COPYING or https://www.gnu.org/licenses/gpl-3.0.txt)
 */

import { WidgetSettingsState } from '@/base/state/ui';
import { deepFreeze } from '@common/helpers/deepFreeze';

const widgetSettingsState: WidgetSettingsState = {
  widgetInEnv: null
}

export const fixtureWidgetSettings = (testData?: Partial<WidgetSettingsState>): WidgetSettingsState => deepFreeze({
  ...widgetSettingsState,
  ...testData
})
