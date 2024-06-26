/*
 * Copyright: (c) 2024, Alex Kaul
 * GNU General Public License v3.0 or later (see COPYING or https://www.gnu.org/licenses/gpl-3.0.txt)
 */

import { WorkflowSettingsViewModelHook } from '@/ui/components/workflowSettings/workflowSettingsViewModel';
import clsx from 'clsx';
import * as styles from './workflowSettings.module.scss';
import * as settingsScreenStyles from '@/ui/components/basic/settingsScreen/settingsScreen.module.scss'
import { SettingsScreen } from '@/ui/components/basic/settingsScreen/settingsScreen';
import { SettingBlock } from '@/widgets/appModules';
import { memo } from 'react';

type Deps = {
  useWorkflowSettingsViewModel: WorkflowSettingsViewModelHook;
}

export function createWorkflowSettingsComponent({
  useWorkflowSettingsViewModel,
}: Deps) {
  function WorkflowSettings() {

    const {
      settings,
      updateSettings,
      onOkClickHandler: onSaveClickHandler,
      onCancelClickHandler: onCloseClickHandler,
    } = useWorkflowSettingsViewModel();

    if (settings) {
      return (<SettingsScreen title='Workflow Settings' onOkClick={onSaveClickHandler} onCancelClick={onCloseClickHandler}>
        <div className={clsx(settingsScreenStyles['settings-screen-panel'], styles['settings-editor'])}>
          <SettingBlock
            titleForId='name'
            title='Name'
          >
            <input id="name" type="text" value={settings.name} onChange={e => updateSettings({
              ...settings,
              name: e.target.value
            })}/>

          </SettingBlock>
        </div>
      </SettingsScreen>)
    } else {
      return null;
    }
  }

  return memo(WorkflowSettings);
}

export type WorkflowSettingsComponent = ReturnType<typeof createWorkflowSettingsComponent>;
