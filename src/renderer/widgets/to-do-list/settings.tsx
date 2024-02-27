/*
 * Copyright: (c) 2024, Alex Kaul
 * GNU General Public License v3.0 or later (see COPYING or https://www.gnu.org/licenses/gpl-3.0.txt)
 */

import { CreateSettingsState, ReactComponent, SettingBlock, SettingsEditorReactComponentProps } from '@/widgets/appModules';

export interface Settings {
  doneToBottom: boolean;
}

export const createSettingsState: CreateSettingsState<Settings> = (settings) => ({
  doneToBottom: typeof settings.doneToBottom === 'boolean' ? settings.doneToBottom : true,
})

export function SettingsEditorComp({settings, settingsApi}: SettingsEditorReactComponentProps<Settings>) {
  const {updateSettings} = settingsApi;
  return (
    <>
      <SettingBlock
        titleForId='to-do-list-done-to-bottom'
        title='When Item Completed'
        moreInfo='Controls whether an item should be moved to the bottom of the to-do list when it marked as complete.'
      >
        <div>
          <label>
            <input type="checkbox" id="to-do-list-done-to-bottom" checked={settings.doneToBottom} onChange={_=>updateSettings({
              ...settings,
              doneToBottom: !settings.doneToBottom
            })}/>
            Move It To Bottom
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
