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
import { memo } from 'react';
import { convertStrToUndBool, convertStrToUndNum, convertUndBoolToStr, convertUndNumToStr } from '@/base/convTypes';
import { sanitizePartialMemSaverConfig } from '@/base/memSaver';

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
      inactiveAfterOptions,
      activateOnProjectSwitchOptions,
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

          <SettingBlock
            title='Memory Saver'
            moreInfo='Freeter frees up memory from inactive workflows.
                      This gives active workflows more computer resources and keeps Freeter
                      fast. Your inactive workflows automatically become active again when
                      you go back to them.'
          >
            <SettingBlock
              titleForId='mem-saver-inactive'
              title='Workflow becomes inactive after'
              moreInfo='This setting defines when workflows become inactive.'
            >
              <select id="mem-saver-inactive" value={convertUndNumToStr(settings.memSaver.workflowInactiveAfter)} onChange={e => updateSettings({
                ...settings,
                memSaver: sanitizePartialMemSaverConfig({
                  ...settings.memSaver,
                  workflowInactiveAfter: convertStrToUndNum(e.target.value)
                })
              })}>
                {inactiveAfterOptions.map(item=>(
                  <option
                    key={convertUndNumToStr(item.val)}
                    value={convertUndNumToStr(item.val)}
                  >{item.name}</option>
                ))}
              </select>
            </SettingBlock>
            <SettingBlock
              titleForId='mem-saver-activate-on-project'
              title='Activate the workflow when switching project'
              moreInfo='When turned on, switching to the project this workflow belongs to will activate it even if it is not selected.'
            >
              <select id="mem-saver-activate-on-project" value={convertUndBoolToStr(settings.memSaver.activateWorkflowsOnProjectSwitch)} onChange={e => updateSettings({
                ...settings,
                memSaver: sanitizePartialMemSaverConfig({
                  ...settings.memSaver,
                  activateWorkflowsOnProjectSwitch: convertStrToUndBool(e.target.value)
                })
              })}>
                {activateOnProjectSwitchOptions.map(item=>(
                  <option
                    key={convertUndBoolToStr(item.val)}
                    value={convertUndBoolToStr(item.val)}
                  >{item.name}</option>
                ))}
              </select>
            </SettingBlock>
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
