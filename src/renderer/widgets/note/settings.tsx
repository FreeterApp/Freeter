/*
 * Copyright: (c) 2024, Alex Kaul
 * GNU General Public License v3.0 or later (see COPYING or https://www.gnu.org/licenses/gpl-3.0.txt)
 */

import { CreateSettingsState, ReactComponent, SettingBlock, SettingsEditorReactComponentProps } from '@/widgets/appModules';

export interface Settings {
  spellCheck: boolean;
}

export const createSettingsState: CreateSettingsState<Settings> = (settings) => ({
  spellCheck: typeof settings.spellCheck === 'boolean' ? settings.spellCheck : false,
})

function SettingsEditorComp({settings, settingsApi}: SettingsEditorReactComponentProps<Settings>) {
  const {updateSettings} = settingsApi;
  return (
    <>
      <SettingBlock
        titleForId='note-spell-check'
        title='Spell Checker'
      >
        <div>
          <label>
            <input type="checkbox" id="note-spell-check" checked={settings.spellCheck} onChange={_=>updateSettings({
              ...settings,
              spellCheck: !settings.spellCheck
            })}/>
            Enable spell checking
          </label>
        </div>
      </SettingBlock>
    </>
  )
}

export const settingsEditorComp: ReactComponent<SettingsEditorReactComponentProps<Settings>> = {
  type: 'react',
  Comp: SettingsEditorComp
}
