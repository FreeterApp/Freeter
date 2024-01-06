/*
 * Copyright: (c) 2024, Alex Kaul
 * GNU General Public License v3.0 or later (see COPYING or https://www.gnu.org/licenses/gpl-3.0.txt)
 */

import { ApplicationSettingsViewModelHook } from '@/ui/components/applicationSettings/applicationSettingsViewModel';
import clsx from 'clsx';
import styles from './applicationSettings.module.scss';
import settingsScreenStyles from '@/ui/components/basic/settingsScreen/settingsScreen.module.scss'
import { SettingsScreen } from '@/ui/components/basic/settingsScreen/settingsScreen';

type Deps = {
  useApplicationSettingsViewModel: ApplicationSettingsViewModelHook;
}

export function createApplicationSettingsComponent({
  useApplicationSettingsViewModel,
}: Deps) {
  function Component() {

    const {
      appConfig,
      hotkeyOptions,
      updateSettings,
      onOkClickHandler,
      onCancelClickHandler,
    } = useApplicationSettingsViewModel();

    if (appConfig) {
      return (<SettingsScreen title='Application Settings' onOkClick={onOkClickHandler} onCancelClick={onCancelClickHandler}>
        <div className={clsx(settingsScreenStyles['settings-screen-panel'], styles['settings-editor'])}>
          <fieldset>
            <label
              htmlFor="main-hot-key"
              title="Hotkey enables you to bring Freeter to the front of the screen by pressing the specified key
                     combination."
            >
              Hotkey Combination
            </label>
            <select id="main-hot-key" value={appConfig.mainHotkey} onChange={e => updateSettings({
              ...appConfig,
              mainHotkey: e.target.value
            })}>
              {hotkeyOptions.map(item=>(
                <option key={item.value} value={item.value}>{item.caption}</option>
              ))}
            </select>
          </fieldset>
        </div>
      </SettingsScreen>)
    } else {
      return null;
    }
  }

  return Component;
}

export type ApplicationSettingsComponent = ReturnType<typeof createApplicationSettingsComponent>;
