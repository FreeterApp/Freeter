/*
 * Copyright: (c) 2024, Alex Kaul
 * GNU General Public License v3.0 or later (see COPYING or https://www.gnu.org/licenses/gpl-3.0.txt)
 */

import { CreateSettingsState, ReactComponent, SettingsEditorReactComponentProps } from '@/widgets/appModules';

// eslint-disable-next-line @typescript-eslint/no-empty-interface
export interface Settings {
}

export const createSettingsState: CreateSettingsState<Settings> = (_settings) => ({
})

function SettingsEditorComp(/*{}: SettingsEditorReactComponentProps<Settings>*/) {
  return (
    <></>
  )
}

export const settingsEditorComp: ReactComponent<SettingsEditorReactComponentProps<Settings>> = {
  type: 'react',
  Comp: SettingsEditorComp
}
