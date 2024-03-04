/*
 * Copyright: (c) 2024, Alex Kaul
 * GNU General Public License v3.0 or later (see COPYING or https://www.gnu.org/licenses/gpl-3.0.txt)
 */

import { CoreSettingsProps, useCoreSettingsViewModel } from '@/ui/components/widgetSettings/coreSettings/coreSettingsViewModel';
import { SettingBlock } from '@/widgets/appModules';

export function CoreSettings(props: CoreSettingsProps) {
  const {
    coreSettings,
    updateCoreSettings,
  } = useCoreSettingsViewModel(props);

  return (<>
    <SettingBlock
      titleForId='name'
      title='Name'
    >
      <input id="name" type="text" value={coreSettings.name} onChange={e => updateCoreSettings({
        ...coreSettings,
        name: e.target.value
      })}/>
    </SettingBlock>
  </>)
}
