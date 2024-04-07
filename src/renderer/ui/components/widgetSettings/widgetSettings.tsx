/*
 * Copyright: (c) 2024, Alex Kaul
 * GNU General Public License v3.0 or later (see COPYING or https://www.gnu.org/licenses/gpl-3.0.txt)
 */

import { WidgetComponent } from '@/ui/components/widget/widget';
import { WidgetSettingsViewModelHook } from '@/ui/components/widgetSettings/widgetSettingsViewModel';
import clsx from 'clsx';
import styles from './widgetSettings.module.scss';
import settingsScreenStyles from '@/ui/components/basic/settingsScreen/settingsScreen.module.scss'
import { CoreSettings } from '@/ui/components/widgetSettings/coreSettings';
import { SettingsScreen } from '@/ui/components/basic/settingsScreen/settingsScreen';
import { memo } from 'react';

type Deps = {
  Widget: WidgetComponent;
  useWidgetSettingsViewModel: WidgetSettingsViewModelHook;
}

export function createWidgetSettingsComponent({
  Widget,
  useWidgetSettingsViewModel,
}: Deps) {
  function WidgetSettings() {

    const {
      widgetInEnv,
      settingsApi,
      SettingsEditorComp,
      sharedState,
      updateCoreSettings,
      onOkClickHandler: onSaveClickHandler,
      onCancelClickHandler: onCloseClickHandler,
    } = useWidgetSettingsViewModel();

    if (widgetInEnv && SettingsEditorComp) {
      return (<SettingsScreen title='Widget Settings' onOkClick={onSaveClickHandler} onCancelClick={onCloseClickHandler}>
        <div className={styles['settings-preview']}>
          <Widget widget={widgetInEnv.widget} env={widgetInEnv.env}></Widget>
        </div>
        <div className={clsx(settingsScreenStyles['settings-screen-panel'], styles['settings-editor'])}>
          <div>
            <CoreSettings coreSettings={widgetInEnv.widget.coreSettings} updateCoreSettings={updateCoreSettings}></CoreSettings>
            <SettingsEditorComp settings={widgetInEnv.widget.settings} settingsApi={settingsApi} sharedState={sharedState}></SettingsEditorComp>
          </div>
        </div>
      </SettingsScreen>)
    } else {
      return null;
    }
  }

  return memo(WidgetSettings);
}

export type WidgetSettingsComponent = ReturnType<typeof createWidgetSettingsComponent>;
