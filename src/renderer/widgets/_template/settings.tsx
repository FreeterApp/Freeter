/*
 * Copyright: (c) 2024, Alex Kaul
 * GNU General Public License v3.0 or later (see COPYING or https://www.gnu.org/licenses/gpl-3.0.txt)
 */

import { CreateSettingsState, ReactComponent, SettingsEditorReactComponentProps } from '@/widgets/types';

export interface Settings {
  text: string;
}

export const createSettingsState: CreateSettingsState<Settings> = (settings) => ({
  text: typeof settings.text === 'string' ? settings.text : ''
})

function SettingsEditorComp({settings, settingsApi}: SettingsEditorReactComponentProps<Settings>) {
  const {text} = settings;
  const {updateSettings} = settingsApi;
  return (
    <>
      <label>Text <input type="text" name="text" value={text} onChange={e => updateSettings({ text: e.target.value})}/></label>
    </>
  )
}

export const settingsEditorComp: ReactComponent<SettingsEditorReactComponentProps<Settings>> = {
  type: 'react',
  Comp: SettingsEditorComp
}
