/*
 * Copyright: (c) 2024, Alex Kaul
 * GNU General Public License v3.0 or later (see COPYING or https://www.gnu.org/licenses/gpl-3.0.txt)
 */

import { Button, CreateSettingsState, List, ReactComponent, SettingsEditorReactComponentProps, addItemToList, delete14Svg, removeItemFromList, SettingBlock, SettingRow, SettingActions } from '@/widgets/appModules';
import { useEffect, useRef, useState } from 'react';

export interface Settings {
  urls: List<string>,
}

export const createSettingsState: CreateSettingsState<Settings> = (settings) => ({
  urls: Array.isArray(settings.urls) ? settings.urls.map(path=>typeof path==='string'?path:'') : [''],
})

function SettingsEditorComp({settings, settingsApi}: SettingsEditorReactComponentProps<Settings>) {
  const urlRefs = useRef<Array<HTMLInputElement|null>>([]);
  const {updateSettings} = settingsApi;
  const [triggerLastUrlFocus, setTriggerLastUrlFocus] = useState(false);

  useEffect(() => {
    if (triggerLastUrlFocus) {
      urlRefs.current[settings.urls.length-1]?.focus();
      setTriggerLastUrlFocus(false);
    }
  }, [settings.urls.length, triggerLastUrlFocus])

  const updateUrlsSetting = (urls: List<string>) => updateSettings({...settings, urls})

  const updUrl = (i: number, url: string) =>
    updateUrlsSetting(settings.urls.map((_path, _i) => i!==_i ? _path : url))
  const addPath = () =>
    updateUrlsSetting(addItemToList(settings.urls, ''))
  const deletePath = (i: number) =>
    updateUrlsSetting(removeItemFromList(settings.urls, i))

  return (
    <>
      <SettingBlock
        titleForId='url0'
        title='URLs'
        moreInfo='Specify the URLs to open with Web Browser.'
      >
        {settings.urls.map((url, i) => (
          <SettingRow key={i}>
            <input
              ref={(el) => {urlRefs.current[i] = el}}
              id={'url'+i}
              type="text"
              value={url}
              placeholder={'Enter a URL'}
              onChange={e => updUrl(i, e.target.value)}
            />
            <SettingActions
              actions={[{
                id: 'DELETE',
                icon: delete14Svg,
                title: 'Delete URL',
                doAction: async () => deletePath(i)
              }]}
            />
          </SettingRow>
        ))}
        <div>
          <Button
            onClick={_ => {
              addPath();
              setTriggerLastUrlFocus(true);
            }}
            caption={'Add a URL'}
            primary={true}
          ></Button>
        </div>
      </SettingBlock>
    </>
  )
}

export const settingsEditorComp: ReactComponent<SettingsEditorReactComponentProps<Settings>> = {
  type: 'react',
  Comp: SettingsEditorComp
}
