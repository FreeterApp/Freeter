/*
 * Copyright: (c) 2024, Alex Kaul
 * GNU General Public License v3.0 or later (see COPYING or https://www.gnu.org/licenses/gpl-3.0.txt)
 */

import { ProjectManagerSettingsProps, useProjectManagerSettingsViewModel } from '@/ui/components/projectManager/projectManagerSettings/projectManagerSettingsViewModel';
import { SettingBlock } from '@/widgets/appModules';

export function ProjectManagerSettings(props: ProjectManagerSettingsProps) {
  const {
    settings,
    updateSettings,
    refNameInput,
  } = useProjectManagerSettingsViewModel(props);

  return (
    settings!==null &&
    <div role="tabpanel">
      <SettingBlock
        titleForId='name'
        title='Name'
      >
        <input id="name" type="text" ref={refNameInput} value={settings.name} onChange={e => updateSettings({
          ...settings,
          name: e.target.value
        })}/>
      </SettingBlock>
    </div>
  )
}
