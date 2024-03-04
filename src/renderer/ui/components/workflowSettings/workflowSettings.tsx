/*
 * Copyright: (c) 2024, Alex Kaul
 * GNU General Public License v3.0 or later (see COPYING or https://www.gnu.org/licenses/gpl-3.0.txt)
 */

import { WorkflowSettingsViewModelHook } from '@/ui/components/workflowSettings/workflowSettingsViewModel';
import clsx from 'clsx';
import styles from './workflowSettings.module.scss';
import settingsScreenStyles from '@/ui/components/basic/settingsScreen/settingsScreen.module.scss'
import { SettingsScreen } from '@/ui/components/basic/settingsScreen/settingsScreen';
import { SettingBlock } from '@/widgets/appModules';

type Deps = {
  useWorkflowSettingsViewModel: WorkflowSettingsViewModelHook;
}

export function createWorkflowSettingsComponent({
  useWorkflowSettingsViewModel,
}: Deps) {
  function Component() {

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

  return Component;
}

export type WorkflowSettingsComponent = ReturnType<typeof createWorkflowSettingsComponent>;
