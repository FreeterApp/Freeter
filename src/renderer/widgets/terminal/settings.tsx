/*
 * Copyright: (c) 2024, Alex Kaul
 * GNU General Public License v3.0 or later (see COPYING or https://www.gnu.org/licenses/gpl-3.0.txt)
 */

import { CreateSettingsState, ReactComponent, SettingsEditorReactComponentProps, SettingBlock } from '@/widgets/appModules';

export interface Settings {
  fontFamily: string;
  fontSize: number;
  cursorStyle: 'block' | 'underline' | 'bar';
  theme: 'light' | 'dark';
  initialCommand: string;
}

const cursorStyles: Settings['cursorStyle'][] = ['block', 'underline', 'bar'];
const themes: Settings['theme'][] = ['light', 'dark'];
const defaultSettings: Settings = {
  fontFamily: 'monospace',
  fontSize: 14,
  cursorStyle: 'block',
  theme: 'light',
  initialCommand: ''
};

function isCursorStyle(value: unknown): value is Settings['cursorStyle'] {
  return cursorStyles.includes(value as Settings['cursorStyle']);
}

function isTheme(value: unknown): value is Settings['theme'] {
  return themes.includes(value as Settings['theme']);
}

export const createSettingsState: CreateSettingsState<Settings> = (settings) => ({
  fontFamily: typeof settings.fontFamily === 'string' && settings.fontFamily.trim() !== ''
    ? settings.fontFamily
    : defaultSettings.fontFamily,
  fontSize: typeof settings.fontSize === 'number' && Number.isFinite(settings.fontSize) && settings.fontSize > 0
    ? Math.round(settings.fontSize)
    : defaultSettings.fontSize,
  cursorStyle: isCursorStyle(settings.cursorStyle) ? settings.cursorStyle : defaultSettings.cursorStyle,
  theme: isTheme(settings.theme) ? settings.theme : defaultSettings.theme,
  initialCommand: typeof settings.initialCommand === 'string' ? settings.initialCommand : defaultSettings.initialCommand
});

function SettingsEditorComp({ settings, settingsApi }: SettingsEditorReactComponentProps<Settings>) {
  const { updateSettings } = settingsApi;

  return (
    <>
      <SettingBlock
        titleForId='terminal-font-family'
        title='Font Family'
        moreInfo='Font family used by the terminal text.'
      >
        <input
          id='terminal-font-family'
          type='text'
          value={settings.fontFamily}
          maxLength={100}
          onChange={(e) => updateSettings({
            ...settings,
            fontFamily: e.target.value
          })}
          placeholder='monospace'
        />
      </SettingBlock>
      <SettingBlock
        titleForId='terminal-font-size'
        title='Font Size'
        moreInfo='Font size in pixels.'
      >
        <input
          id='terminal-font-size'
          type='number'
          min={8}
          max={48}
          value={settings.fontSize}
          onChange={(e) => {
            const parsed = Number.parseInt(e.target.value, 10);
            updateSettings({
              ...settings,
              fontSize: Number.isNaN(parsed) ? defaultSettings.fontSize : parsed
            });
          }}
        />
      </SettingBlock>
      <SettingBlock
        titleForId='terminal-cursor-style'
        title='Cursor Style'
        moreInfo='Choose how the cursor is rendered.'
      >
        <select
          id='terminal-cursor-style'
          value={settings.cursorStyle}
          onChange={(e) => updateSettings({
            ...settings,
            cursorStyle: isCursorStyle(e.target.value) ? e.target.value : defaultSettings.cursorStyle
          })}
        >
          <option value='block'>Block</option>
          <option value='underline'>Underline</option>
          <option value='bar'>Bar</option>
        </select>
      </SettingBlock>
      <SettingBlock
        titleForId='terminal-theme'
        title='Theme'
        moreInfo='Pick a terminal theme.'
      >
        <select
          id='terminal-theme'
          value={settings.theme}
          onChange={(e) => updateSettings({
            ...settings,
            theme: isTheme(e.target.value) ? e.target.value : defaultSettings.theme
          })}
        >
          <option value='light'>Light</option>
          <option value='dark'>Dark</option>
        </select>
      </SettingBlock>
      <SettingBlock
        titleForId='terminal-initial-command'
        title='Initial Command'
        moreInfo='Command to run once when the terminal session starts.'
      >
        <textarea
          id='terminal-initial-command'
          value={settings.initialCommand}
          rows={3}
          onChange={(e) => updateSettings({
            ...settings,
            initialCommand: e.target.value
          })}
          placeholder='Optional command to run'
        />
      </SettingBlock>
    </>
  );
}

export const settingsEditorComp: ReactComponent<SettingsEditorReactComponentProps<Settings>> = {
  type: 'react',
  Comp: SettingsEditorComp
};
