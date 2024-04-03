/*
 * Copyright: (c) 2024, Alex Kaul
 * GNU General Public License v3.0 or later (see COPYING or https://www.gnu.org/licenses/gpl-3.0.txt)
 */

import { CreateSettingsState, SettingsEditorReactComponentProps, ReactComponent, SettingBlock } from '@/widgets/appModules';
import { debounce } from '@common/helpers/debounce';
import { useCallback, useState } from 'react';

const settingsSessionScopes = ['app', 'prj', 'wfl', 'wgt'] as const;
export type SettingsSessionScope = typeof settingsSessionScopes[number];
function isSettingsSessionScope(val: unknown): val is SettingsSessionScope {
  if (typeof val !== 'string') {
    return false;
  }

  if (settingsSessionScopes.indexOf(val as SettingsSessionScope)>-1) {
    return true;
  }

  return true;
}

const settingsSessionPersist = ['persist', 'temp'] as const;
export type SettingsSessionPersist = typeof settingsSessionPersist[number];
function isSettingsSessionPersist(val: unknown): val is SettingsSessionPersist {
  if (typeof val !== 'string') {
    return false;
  }

  if (settingsSessionPersist.indexOf(val as SettingsSessionPersist)>-1) {
    return true;
  }

  return true;
}

const settingsViewMode = ['desktop', 'mobile'] as const;
export type SettingsViewMode = typeof settingsViewMode[number];
function isSettingsViewMode(val: unknown): val is SettingsViewMode {
  if (typeof val !== 'string') {
    return false;
  }

  if (settingsViewMode.indexOf(val as SettingsViewMode)>-1) {
    return true;
  }

  return true;
}

export interface Settings {
  autoReload: number;
  sessionPersist: SettingsSessionPersist;
  sessionScope: SettingsSessionScope;
  url: string;
  viewMode: SettingsViewMode;
}

export const createSettingsState: CreateSettingsState<Settings> = (settings) => ({
  autoReload: typeof settings.autoReload === 'number' ? settings.autoReload : 0,
  sessionPersist: isSettingsSessionPersist(settings.sessionPersist) ? settings.sessionPersist : 'persist',
  sessionScope: isSettingsSessionScope(settings.sessionScope) ? settings.sessionScope : 'prj',
  url: typeof settings.url === 'string' ? settings.url : '',
  viewMode: isSettingsViewMode(settings.viewMode) ? settings.viewMode : 'mobile',
})

const debounceUpdate3s = debounce((fn: () => void) => fn(), 3000);

export function SettingsEditorComp({settings, settingsApi}: SettingsEditorReactComponentProps<Settings>) {
  const {updateSettings} = settingsApi;
  const [url, setUrl] = useState(settings.url);
  const updateUrl = useCallback((newUrl: string, debounce: boolean) => {
    setUrl(newUrl);
    const updateUrlInSettings = () => updateSettings({
      ...settings,
      url: newUrl
    })
    if (debounce) {
      debounceUpdate3s(updateUrlInSettings);
    } else {
      debounceUpdate3s.cancel();
      updateUrlInSettings();
    }
  }, [settings, updateSettings])
  return (
    <>
      <SettingBlock
        titleForId='webpage-url'
        title='URL'
        moreInfo='Type a URL of a webpage or a web app to open in the widget.'
      >
        <input id="webpage-url" type="text" value={url} onChange={e => updateUrl(e.target.value, true)} onBlur={e=>updateUrl(e.target.value, false)} placeholder="Type a URL" />
      </SettingBlock>

      <SettingBlock
        titleForId='webpage-session-scope'
        title='Session Scope'
        moreInfo='When you login to a website, the widget stores the data in a session to keep you logged in. Session scope
                  specifies how the session data should be shared between webpage widgets. By default, the Application scope
                  is set. This scope shares the session data between all webpage widgets. It enables you to login to a
                  website with one webpage widget and use the same account in all webpage widgets that have the Application
                  scope. However sometimes you may need to access a webpage using different accounts. For example, if your
                  project depends on multiple social media accounts, a narrower scope would be a better fit. Project Scope
                  will share the data between widgets within the same project. Workflow Scope - between widgets within the
                  same workflow tab. Widget Scope will not share the session data with other webpage widgets.'
      >
        <select id="webpage-session-scope" value={settings.sessionScope} onChange={e => updateSettings({
          ...settings,
          sessionScope: isSettingsSessionScope(e.target.value) ? e.target.value : 'prj'
        })}>
          <option value="app">Application</option>
          <option value="prj">Project</option>
          <option value="wfl">Workflow</option>
          <option value="wgt">Widget</option>
        </select>
      </SettingBlock>

      <SettingBlock
        titleForId='webpage-session-persistence'
        title='Session Persistence'
        moreInfo='By default, the widget will persist the session data after you exit the application. Set the Temporary mode to clear the session data on exit.'
      >
        <select id="webpage-session-persistence" value={settings.sessionPersist} onChange={e => updateSettings({
          ...settings,
          sessionPersist: isSettingsSessionPersist(e.target.value) ? e.target.value : 'persist'
        })}>
          <option value="persist">Persistent</option>
          <option value="temp">Temporary</option>
        </select>
      </SettingBlock>

      <SettingBlock
        titleForId='webpage-view-mode'
        title='View Mode'
        moreInfo="By default, the widget will try to open a mobile version of a web app/site where it's supported, to have
                 a compact size which better fits workflow tabs containing multiple various widget. In some cases it might not work on desktops as intended. To fix that switch the view mode from Mobile to Desktop mode."
      >
        <select id="webpage-view-mode" value={settings.viewMode} onChange={e => updateSettings({
          ...settings,
          viewMode: isSettingsViewMode(e.target.value) ? e.target.value : 'mobile'
        })}>
          <option value="desktop">Desktop</option>
          <option value="mobile">Mobile</option>
        </select>
      </SettingBlock>

      <SettingBlock
        titleForId='webpage-auto-reload'
        title='Auto-Reload'
        moreInfo="If you need to automatically refresh the webpage, use this option to set the auto-reload interval."
      >
        <select id="webpage-auto-reload" value={settings.autoReload} onChange={e => updateSettings({
          ...settings,
          autoReload: Number.parseInt(e.target.value) || 0
        })}>
          <option value="0">Disabled</option>
          <option value="10">10 Seconds</option>
          <option value="30">30 Seconds</option>
          <option value="60">1 Minute</option>
          <option value="300">5 Minutes</option>
          <option value="600">10 Minutes</option>
          <option value="3600">60 Minutes</option>
        </select>
      </SettingBlock>
    </>
  )
}

export const settingsEditorComp: ReactComponent<SettingsEditorReactComponentProps<Settings>> = {
  type: 'react',
  Comp: SettingsEditorComp
}
