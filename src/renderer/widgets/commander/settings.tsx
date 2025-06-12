/*
 * Copyright: (c) 2024, Alex Kaul
 * GNU General Public License v3.0 or later (see COPYING or https://www.gnu.org/licenses/gpl-3.0.txt)
 */

import { Button, CreateSettingsState, List, ReactComponent, SettingsEditorReactComponentProps, addItemToList, browse14Svg, delete14Svg, removeItemFromList, SettingBlock, SettingRow, SettingActions } from '@/widgets/appModules';
import { useEffect, useRef, useState } from 'react';

export interface Settings {
  cmds: List<string>;
  cwd: string;
}

export const createSettingsState: CreateSettingsState<Settings> = (settings) => ({
  cmds: Array.isArray(settings.cmds) ? settings.cmds.map(cmd=>typeof cmd==='string'?cmd:'') : [''],
  cwd: typeof settings.cwd === 'string' ? settings.cwd : ''
})

function SettingsEditorComp({settings, settingsApi}: SettingsEditorReactComponentProps<Settings>) {
  const cmdRefs = useRef<Array<HTMLInputElement|null>>([]);
  const {updateSettings, dialog} = settingsApi;
  const [triggerLastCmdFocus, setTriggerLastCmdFocus] = useState(false);

  useEffect(() => {
    if (triggerLastCmdFocus) {
      cmdRefs.current[settings.cmds.length-1]?.focus();
      setTriggerLastCmdFocus(false);
    }
  }, [settings.cmds.length, triggerLastCmdFocus])

  const updCwd = (settings: Settings, cwd: string) => updateSettings({...settings, cwd});
  const updCmd = (settings: Settings, i: number, cmd: string) => updateSettings({...settings, cmds: settings.cmds.map((_cmd, _i) => i!==_i ? _cmd : cmd)})
  const addCmd = (settings: Settings) => updateSettings({...settings, cmds: addItemToList(settings.cmds, '')})
  const deleteCmd = (settings: Settings, i: number) => updateSettings({...settings, cmds: removeItemFromList(settings.cmds, i)})

  const pickDir = async (curDir: string) => {
    const { canceled, filePaths } = await dialog.showOpenDirDialog({defaultPath: curDir, multiSelect: false})
    if (canceled) {
      return null;
    } else {
      return filePaths[0];
    }
  };

  return (
    <>
      <SettingBlock
        titleForId='cmd0'
        title='Command-lines'
        moreInfo='Specify the command-lines to run. Each command-line will be executed in a separate shell instance.'
      >
        {settings.cmds.map((cmd, i) => (
          <SettingRow key={i}>
            <input
              ref={(el) => {cmdRefs.current[i] = el}}
              id={'cmd'+i}
              type="text"
              value={cmd}
              placeholder='Enter a command-line'
              onChange={e => updCmd(settings, i, e.target.value)}
            />
            <SettingActions
              actions={[{
                id: 'DELETE',
                icon: delete14Svg,
                title: 'Delete Command-line',
                doAction: async () => deleteCmd(settings, i)
              }]}
            />
          </SettingRow>
        ))}
        <div>
          <Button
            onClick={_ => {
              addCmd(settings);
              setTriggerLastCmdFocus(true);
            }}
            caption='Add a command-line'
            primary={true}
          ></Button>
        </div>
      </SettingBlock>

      <SettingBlock
        titleForId='cwd'
        title='Working Directory'
        moreInfo='Specify a directory path where the command-lines will be executed.'
      >
        <SettingRow>
          <input
            id="cwd"
            type="text"
            value={settings.cwd}
            onChange={e => updCwd(settings, e.target.value)}
            placeholder="Set a directory path"
          />
          <SettingActions
            actions={[{
              id: 'SELECT-DIR',
              icon: browse14Svg,
              title: 'Select Directory',
              doAction: async () => {
                const pickedDir = await pickDir(settings.cwd);
                if (pickedDir) {
                  updCwd(settings, pickedDir);
                }
              }
            }]}
          />
        </SettingRow>
      </SettingBlock>
    </>
  )
}

export const settingsEditorComp: ReactComponent<SettingsEditorReactComponentProps<Settings>> = {
  type: 'react',
  Comp: SettingsEditorComp
}
