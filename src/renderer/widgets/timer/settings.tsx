/*
 * Copyright: (c) 2024, Alex Kaul
 * GNU General Public License v3.0 or later (see COPYING or https://www.gnu.org/licenses/gpl-3.0.txt)
 */

import { CreateSettingsState, ReactComponent, SettingsEditorReactComponentProps, SettingBlock } from '@/widgets/appModules';

export interface Settings {
  mins: number;
  endDesktop: boolean;
  endSound: number;
  endSoundVol: number;
  tickSound: number;
  tickSoundVol: number;
}

export const createSettingsState: CreateSettingsState<Settings> = (settings) => ({
  mins: typeof settings.mins === 'number' ? settings.mins : 25,
  endDesktop: typeof settings.endDesktop === 'boolean' ? settings.endDesktop : true,
  endSound: typeof settings.endSound === 'number' ? settings.endSound : 1,
  endSoundVol: typeof settings.endSoundVol === 'number' ? settings.endSoundVol : 80,
  tickSound: typeof settings.tickSound === 'number' ? settings.tickSound : 0,
  tickSoundVol: typeof settings.tickSoundVol === 'number' ? settings.tickSoundVol : 80,
})

interface SelectOption<T> {
  value: T;
  label: string;
}

const timerMinsOptions: SelectOption<number>[] = [];
for (let mins = 5; mins <= 90; mins += 5) {
  timerMinsOptions.push({
    label: mins + ' minutes',
    value: mins
  });
}


function SettingsEditorComp({settings, settingsApi}: SettingsEditorReactComponentProps<Settings>) {
  const {updateSettings} = settingsApi;

  return (
    <>
      <SettingBlock
        titleForId='timer-mins'
        title='Timer'
      >
        <select id="timer-mins" value={settings.mins} onChange={e => {
          updateSettings({
            ...settings,
            mins: Number(e.target.value) || 5
          })
        }}>
          {
            timerMinsOptions.map(opt=>(
              <option
                key={opt.value}
                value={opt.value}
              >
                {opt.label}
              </option>
            ))
          }
        </select>
      </SettingBlock>
    </>
  )
}

export const settingsEditorComp: ReactComponent<SettingsEditorReactComponentProps<Settings>> = {
  type: 'react',
  Comp: SettingsEditorComp
}
