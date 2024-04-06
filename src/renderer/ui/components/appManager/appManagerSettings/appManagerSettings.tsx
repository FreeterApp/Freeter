/*
 * Copyright: (c) 2024, Alex Kaul
 * GNU General Public License v3.0 or later (see COPYING or https://www.gnu.org/licenses/gpl-3.0.txt)
 */

import { AppManagerSettingsProps, useAppManagerSettingsViewModel } from '@/ui/components/appManager/appManagerSettings/appManagerSettingsViewModel';
import { SettingActions, SettingBlock, SettingRow } from '@/ui/components/basic/settingsScreen/setting';
import { browse14Svg } from '@/ui/assets/images/appIcons';

export function AppManagerSettings(props: AppManagerSettingsProps) {
  const {
    settings,
    updateSettings,
    refNameInput,
    pickExecPath,
  } = useAppManagerSettingsViewModel(props);

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

      <SettingBlock
        titleForId='execPath'
        title='Executable File'
      >
        <SettingRow>
          <input
            id="execPath"
            type="text"
            value={settings.execPath}
            onChange={e => updateSettings({
              ...settings,
              execPath: e.target.value
            })}
          />
          <SettingActions
            actions={[{
              id: 'SELECT-EXECPATH',
              icon: browse14Svg,
              title: 'Select Executable File',
              doAction: async () => {
                const execPath = await pickExecPath(settings.execPath);
                if (execPath) {
                  updateSettings({
                    ...settings,
                    execPath
                  });
                }
              }
            }]}
          />
        </SettingRow>
      </SettingBlock>

      <SettingBlock
        titleForId='cmdArgs'
        title='Command Line Arguments'
      >
        <input id="cmdArgs" type="text" value={settings.cmdArgs} onChange={e => updateSettings({
          ...settings,
          cmdArgs: e.target.value
        })}/>
      </SettingBlock>

    </div>
  )
}
