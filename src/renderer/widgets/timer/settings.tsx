/*
 * Copyright: (c) 2024, Alex Kaul
 * GNU General Public License v3.0 or later (see COPYING or https://www.gnu.org/licenses/gpl-3.0.txt)
 */

import { CreateSettingsState, ReactComponent, SettingsEditorReactComponentProps, SettingBlock, SettingRow, SettingActions } from '@/widgets/appModules';
import { glockenspielArpeggioId, timerEndSoundFiles, timerEndSoundFilesById } from '@/widgets/timer/audio/timer-end';
import { playSvg } from '@/widgets/timer/icons';
import { useAudioFile } from '@/widgets/timer/useAudioFile';
import { useCallback } from 'react';

export interface Settings {
  mins: number;
  endSound: string;
  endSoundVol: number;
}

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

export const endSoundOptions: SelectOption<string>[] = [
  {
    label: '(No Sound)',
    value: ''
  },
  ...timerEndSoundFiles.map(item=>({
    label: item.name,
    value: item.id
  }))
];
const endSoundValues = endSoundOptions.map(item=>item.value);
function isEndSoundValue(val: unknown): val is string {
  if (typeof val !== 'string') {
    return false;
  }

  if (endSoundValues.indexOf(val as string)>-1) {
    return true;
  }

  return false;
}
const defaultEndSound = glockenspielArpeggioId;

const endSoundVolOptions: SelectOption<number>[] = [];
for (let vol = 0; vol <= 100; vol += 10) {
  endSoundVolOptions.push({
    label: vol + '%',
    value: vol
  });
}

export const createSettingsState: CreateSettingsState<Settings> = (settings) => ({
  mins: typeof settings.mins === 'number' ? settings.mins : 25,
  endDesktop: typeof settings.endDesktop === 'boolean' ? settings.endDesktop : true,
  endSound: isEndSoundValue(settings.endSound) ? settings.endSound : defaultEndSound,
  endSoundVol: typeof settings.endSoundVol === 'number' ? settings.endSoundVol : 70,
})

function SettingsEditorComp({settings, settingsApi}: SettingsEditorReactComponentProps<Settings>) {
  const {updateSettings} = settingsApi;
  const endSound = useAudioFile(timerEndSoundFilesById[settings.endSound]?.path || '', settings.endSoundVol);

  const testSoundAction = useCallback(async () => {
    endSound.play();
  }, [endSound])

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

      <SettingBlock
        titleForId='timer-endSound'
        title='Play Sound When Timer Ends'
      >
        <select id="timer-endSound" value={settings.endSound} onChange={e => {
          updateSettings({
            ...settings,
            endSound: e.target.value
          })
        }}>
          {
            endSoundOptions.map(opt=>(
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

      <SettingBlock
        titleForId='timer-endSoundVol'
        title='End Sound Volume'
      >
        <SettingRow>
          <select id="timer-endSoundVol" value={settings.endSoundVol} onChange={e => {
            updateSettings({
              ...settings,
              endSoundVol: Number(e.target.value) || 80
            })
          }}>
            {
              endSoundVolOptions.map(opt=>(
                <option
                  key={opt.value}
                  value={opt.value}
                >
                  {opt.label}
                </option>
              ))
            }
          </select>
          <SettingActions
            actions={[{
              id: 'TEST-SOUND',
              icon: playSvg,
              title: 'Test Sound',
              doAction: testSoundAction
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
