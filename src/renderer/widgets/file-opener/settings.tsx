/*
 * Copyright: (c) 2024, Alex Kaul
 * GNU General Public License v3.0 or later (see COPYING or https://www.gnu.org/licenses/gpl-3.0.txt)
 */

import { Button, CreateSettingsState, List, ReactComponent, SettingsEditorReactComponentProps, addItemToList, browse14Svg, delete14Svg, removeItemFromList, SettingBlock, SettingRow, SettingActions, EntityId, mapIdListToEntityList, manage14Svg } from '@/widgets/appModules';
import { SettingsType, isSettingsType, settingsTypeActionNames, settingsTypeNames, settingsTypeNamesCapital, settingsTypes } from '@/widgets/file-opener/settingsType';
import { useEffect, useMemo, useRef, useState } from 'react';

export interface Settings {
  type: SettingsType,
  files: List<string>,
  folders: List<string>,
  openIn: EntityId
}

export const createSettingsState: CreateSettingsState<Settings> = (settings) => ({
  type: isSettingsType(settings.type) ? settings.type : SettingsType.File,
  files: Array.isArray(settings.files) ? settings.files.map(path=>typeof path==='string'?path:'') : [''],
  folders: Array.isArray(settings.folders) ? settings.folders.map(path=>typeof path==='string'?path:'') : [''],
  openIn: typeof settings.openIn === 'string' ? settings.openIn : '',
})

function SettingsEditorComp({settings, settingsApi, sharedState}: SettingsEditorReactComponentProps<Settings>) {
  const pathRefs = useRef<Array<HTMLInputElement|null>>([]);
  const {updateSettings, dialog} = settingsApi;
  const [triggerLastPathFocus, setTriggerLastPathFocus] = useState(false);

  let {openIn} = settings;
  const appList = useMemo(() => mapIdListToEntityList(sharedState.apps.apps, sharedState.apps.appIds), [sharedState.apps.appIds, sharedState.apps.apps])
  const curApp = appList.find(item => item.id===openIn)
  if(!curApp) {
    openIn = '';
  }

  useEffect(() => {
    if (triggerLastPathFocus) {
      pathRefs.current[(settings.type === SettingsType.Folder ? settings.folders.length : settings.files.length)-1]?.focus();
      setTriggerLastPathFocus(false);
    }
  }, [settings.files.length, settings.folders.length, settings.type, triggerLastPathFocus])

  let updatePathsSetting: (paths: List<string>) => void;
  if (settings.type === SettingsType.Folder) {
    updatePathsSetting = paths => updateSettings({...settings, folders: paths})
  } else {
    updatePathsSetting = paths => updateSettings({...settings, files: paths})
  }
  let getPathsSetting: () => List<string>;
  if (settings.type === SettingsType.Folder) {
    getPathsSetting = () => settings.folders
  } else {
    getPathsSetting = () => settings.files
  }

  const updPath = (i: number, path: string) =>
    updatePathsSetting(getPathsSetting().map((_path, _i) => i!==_i ? _path : path))
  const addPath = () =>
    updatePathsSetting(addItemToList(getPathsSetting(), ''))
  const deletePath = (i: number) =>
    updatePathsSetting(removeItemFromList(getPathsSetting(), i))

  let pickPath: (curPath: string) => Promise<string | null>;
  if (settings.type === SettingsType.Folder) {
    pickPath = async (curPath) => {
      const { canceled, filePaths } = await dialog.showOpenDirDialog({defaultPath: curPath, multiSelect: false})
      if (canceled) {
        return null;
      } else {
        return filePaths[0];
      }
    }
  } else {
    pickPath = async (curPath) => {
      const { canceled, filePaths } = await dialog.showOpenFileDialog({defaultPath: curPath, multiSelect: false})
      if (canceled) {
        return null;
      } else {
        return filePaths[0];
      }
    }
  }

  const { showAppManager } = dialog;

  return (
    <>
      <SettingBlock
        titleForId='file-opener-type'
        title='Type'
        moreInfo='Type of the action.'
      >
        <select id="file-opener-type" value={settings.type} onChange={e => {
          const val = Number(e.target.value);
          updateSettings({
            ...settings,
            type: isSettingsType(val) ? val : SettingsType.File
          })
        }}>
          {
            settingsTypes.map(typeId=>(
              <option
                key={typeId}
                value={typeId}
              >
                {settingsTypeActionNames[typeId]}
              </option>
            ))
          }
        </select>
      </SettingBlock>
      <SettingBlock
        titleForId='path0'
        title={`${settingsTypeNamesCapital[settings.type]}s`}
        moreInfo={`Specify the ${settingsTypeNames[settings.type]}s to open.`}
      >
        {(settings.type===SettingsType.Folder ? settings.folders : settings.files).map((path, i) => (
          <SettingRow key={`${settings.type}/${i}`}>
            <input
              ref={(el) => {pathRefs.current[i] = el}}
              id={'path'+i}
              type="text"
              value={path}
              placeholder={`Enter a ${settingsTypeNames[settings.type]} path`}
              onChange={e => updPath(i, e.target.value)}
            />
            <SettingActions
              actions={[{
                id: 'SELECT-PATH',
                icon: browse14Svg,
                title: `Select ${settingsTypeNamesCapital[settings.type]}`,
                doAction: async () => {
                  const pickedPath = await pickPath(getPathsSetting()[i]);
                  if (pickedPath) {
                    updPath(i, pickedPath);
                  }
                }
              }, {
                id: 'DELETE',
                icon: delete14Svg,
                title: `Delete ${settingsTypeNamesCapital[settings.type]} Path`,
                doAction: async () => deletePath(i)
              }]}
            />
          </SettingRow>
        ))}
        <div>
          <Button
            onClick={_ => {
              addPath();
              setTriggerLastPathFocus(true);
            }}
            caption={`Add a ${settingsTypeNames[settings.type]} path`}
            primary={true}
          ></Button>
        </div>
      </SettingBlock>

      <SettingBlock
        titleForId='file-opener-openIn'
        title={`Open ${settingsTypeNamesCapital[settings.type]}s in ...`}
        moreInfo={`Use this option, if you want to open the ${settingsTypeNames[settings.type]}s in a specific app instead of the default one associated with them in the operating system.`}
      >
        <SettingRow>
          <select id="file-opener-openIn" value={settings.openIn} onChange={e => {
            updateSettings({
              ...settings,
              openIn: e.target.value
            })
          }}>
            <option key='' value=''>Default App</option>
            {
              appList.map(app=>(
                <option
                  key={app.id}
                  value={app.id}
                >
                  {app.settings.name}
                </option>
              ))
            }
          </select>
          <SettingActions
            actions={[{
              id: 'MANAGE-APPS',
              icon: manage14Svg,
              title: 'Manage Apps',
              doAction: async () => showAppManager()
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
