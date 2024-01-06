/*
 * Copyright: (c) 2024, Alex Kaul
 * GNU General Public License v3.0 or later (see COPYING or https://www.gnu.org/licenses/gpl-3.0.txt)
 */

import { WidgetCoreSettings } from '@/base/widget';

export interface CoreSettingsProps {
  updateCoreSettings: (coreSettings: WidgetCoreSettings) => void;
  coreSettings: WidgetCoreSettings;
}

export function useCoreSettingsViewModel(props: CoreSettingsProps) {
  return props;
}
