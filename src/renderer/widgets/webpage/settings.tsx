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

  return false;
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

  return false;
}

export interface Settings {
  autoReload: number;
  sessionPersist: SettingsSessionPersist;
  sessionScope: SettingsSessionScope;
  url: string;
  injectedCSS: string;
  injectedJS: string;
  userAgent: string;
}

export const createSettingsState: CreateSettingsState<Settings> = (settings) => ({
  autoReload: typeof settings.autoReload === 'number' ? settings.autoReload : 0,
  sessionPersist: isSettingsSessionPersist(settings.sessionPersist) ? settings.sessionPersist : 'persist',
  sessionScope: isSettingsSessionScope(settings.sessionScope) ? settings.sessionScope : 'prj',
  url: typeof settings.url === 'string' ? settings.url : '',
  injectedCSS: typeof settings.injectedCSS === 'string' ? settings.injectedCSS : '',
  injectedJS: typeof settings.injectedJS === 'string' ? settings.injectedJS : '',
  userAgent: typeof settings.userAgent === 'string' ? settings.userAgent : '',
})

const debounceUpdate3s = debounce((fn: () => void) => fn(), 3000);

export function SettingsEditorComp({settings, settingsApi}: SettingsEditorReactComponentProps<Settings>) {
  const {updateSettings} = settingsApi;

  // TODO: refactor the updateUrl, updateInjectedJs, updateUserAgent
  const [url, setUrl] = useState(settings.url);
  const [injectedJs, setInjectedJs] = useState(settings.injectedJS);
  const [userAgent, setUserAgent] = useState(settings.userAgent);
  const updateUrl = useCallback((newVal: string, debounce: boolean) => {
    setUrl(newVal);
    const updateValInSettings = () => updateSettings({
      ...settings,
      url: newVal
    })
    if (debounce) {
      debounceUpdate3s(updateValInSettings);
    } else {
      debounceUpdate3s.cancel();
      updateValInSettings();
    }
  }, [settings, updateSettings])
  const updateInjectedJs = useCallback((newVal: string, debounce: boolean) => {
    setInjectedJs(newVal);
    const updateValInSettings = () => updateSettings({
      ...settings,
      injectedJS: newVal
    })
    if (debounce) {
      debounceUpdate3s(updateValInSettings);
    } else {
      debounceUpdate3s.cancel();
      updateValInSettings();
    }
  }, [settings, updateSettings])
  const updateUserAgent = useCallback((newVal: string, debounce: boolean) => {
    setUserAgent(newVal);
    const updateValInSettings = () => updateSettings({
      ...settings,
      userAgent: newVal
    })
    if (debounce) {
      debounceUpdate3s(updateValInSettings);
    } else {
      debounceUpdate3s.cancel();
      updateValInSettings();
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

      <SettingBlock
        titleForId='webpage-inject-css'
        title='Inject CSS'
        moreInfo='Inject the following CSS style into the webpage.'
      >
        <textarea id="webpage-inject-css" value={settings.injectedCSS} onChange={e => updateSettings({...settings, injectedCSS: e.target.value})} placeholder="Type CSS"></textarea>
      </SettingBlock>

      <SettingBlock
        titleForId='webpage-inject-js'
        title='Inject JS'
        moreInfo='Inject the following JS script into the webpage.'
      >
        <textarea id="webpage-inject-js" value={injectedJs} onChange={e => updateInjectedJs(e.target.value, true)} onBlur={e=>updateInjectedJs(e.target.value, false)} placeholder="Type JS"></textarea>
      </SettingBlock>

      <SettingBlock
        titleForId='webpage-user-agent'
        title='User Agent'
        moreInfo='Set the following User Agent string for the webpage.'
      >
        <input id="webpage-user-agent" type="text" value={userAgent} onChange={e => updateUserAgent(e.target.value, true)} onBlur={e=>updateUserAgent(e.target.value, false)} placeholder="Type User Agent string" />
      </SettingBlock>
    </>
  )
}

export const settingsEditorComp: ReactComponent<SettingsEditorReactComponentProps<Settings>> = {
  type: 'react',
  Comp: SettingsEditorComp
}
