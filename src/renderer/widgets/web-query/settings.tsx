/*
 * Copyright: (c) 2024, Alex Kaul
 * GNU General Public License v3.0 or later (see COPYING or https://www.gnu.org/licenses/gpl-3.0.txt)
 */

import { CreateSettingsState, ReactComponent, SettingsEditorReactComponentProps, SettingBlock } from '@/widgets/appModules';

export interface SettingsEngine {
  id: string;
  name: string;
  descr: string;
  url: string;
}

const engineDdgo: SettingsEngine = {id: 'ddgo', name: 'DuckDuckGo', url: 'https://duckduckgo.com/?q=QUERY', descr: 'Search'};
const engines: SettingsEngine[] = [
  {id: 'webpages', name: 'Webpages in Worktable', url: '', descr: 'Search in webpages'},
  {id: 'bing', name: 'Bing', url: 'https://www.bing.com/search?q=QUERY', descr: 'Search'},
  {id: 'bing-imgs', name: 'Bing (Images)', url: 'https://www.bing.com/images/search?q=QUERY', descr: 'Search for images'},
  {id: 'bing-maps', name: 'Bing (Maps)', url: 'https://www.bing.com/maps/search?q=QUERY', descr: 'Search for maps'},
  {id: 'bing-news', name: 'Bing (News)', url: 'https://www.bing.com/news/search?q=QUERY', descr: 'Search for news'},
  {id: 'bing-vids', name: 'Bing (Videos)', url: 'https://www.bing.com/videos/search?q=QUERY', descr: 'Search for videos'},
  engineDdgo,
  {id: 'ddgo-lite', name: 'DuckDuckGo (Lite)', url: 'https://lite.duckduckgo.com/lite/?q=QUERY', descr: 'Search'},
  {id: 'ddgo-imgs', name: 'DuckDuckGo (Images)', url: 'https://duckduckgo.com/?q=QUERY&iax=images&ia=images', descr: 'Search for images'},
  {id: 'ddgo-maps', name: 'DuckDuckGo (Maps)', url: 'https://duckduckgo.com/?q=QUERY&iax=maps&ia=maps', descr: 'Search for maps'},
  {id: 'ddgo-news', name: 'DuckDuckGo (News)', url: 'https://duckduckgo.com/?q=QUERY&iar=news&ia=news', descr: 'Search for news'},
  {id: 'ddgo-vids', name: 'DuckDuckGo (Videos)', url: 'https://duckduckgo.com/?q=QUERY&iax=videos&ia=videos', descr: 'Search for videos'},
  {id: 'goog', name: 'Google', url: 'https://www.google.com/search?q=QUERY', descr: 'Search'},
  {id: 'goog-imgs', name: 'Google (Images)', url: 'https://www.google.com/search?q=QUERY&tbm=isch', descr: 'Search for images'},
  {id: 'goog-maps', name: 'Google (Maps)', url: 'https://www.google.com/maps/search/QUERY', descr: 'Search for maps'},
  {id: 'goog-news', name: 'Google (News)', url: 'https://www.google.com/search?q=QUERY&tbm=nws', descr: 'Search for news'},
  {id: 'goog-vids', name: 'Google (Videos)', url: 'https://www.google.com/search?q=QUERY&tbm=vid', descr: 'Search for videos'},
  {id: 'ovrs', name: 'Openverse (All Content)', url: 'https://openverse.org/search/?q=QUERY', descr: 'Search for content'},
  {id: 'ovrs-auds', name: 'Openverse (Audio)', url: 'https://openverse.org/search/audio?q=QUERY', descr: 'Search for audio'},
  {id: 'ovrs-imgs', name: 'Openverse (Images)', url: 'https://openverse.org/search/image?q=QUERY', descr: 'Search for images'},
  {id: 'wkpd', name: 'Wikipedia', url: 'https://en.wikipedia.org/w/index.php?search=QUERY', descr: 'Search Wikipedia'},
  {id: 'wfal', name: 'Wolfram|Alpha', url: 'https://www.wolframalpha.com/input?i=QUERY', descr: 'Calculate / Know about'},
]
export const defaultEngine = engineDdgo;

export const enginesById = Object.fromEntries(engines.map(item => [item.id, item]));

export interface Settings {
  engine: string;
  descr: string;
  query: string;
  url: string;
}

export const createSettingsState: CreateSettingsState<Settings> = (settings) => {
  let engineObj: SettingsEngine | undefined;
  if (typeof settings.engine === 'string') {
    if (settings.engine !== '') {
      engineObj = enginesById[settings.engine]
      if (!engineObj) {
        engineObj = defaultEngine;
      }
    }
  } else {
    engineObj = defaultEngine;
  }
  let engine: string;
  let descr: string;
  let url: string;
  if (engineObj) {
    engine = engineObj.id;
    descr = '';
    url = '';
  } else {
    engine = '';
    descr = typeof settings.descr === 'string' ? settings.descr : '';
    url = typeof settings.url === 'string' ? settings.url : '';
  }
  return {
    engine,
    descr,
    url,
    query: typeof settings.query === 'string' ? settings.query : ''
  }
}

function SettingsEditorComp({settings, settingsApi}: SettingsEditorReactComponentProps<Settings>) {
  const {updateSettings} = settingsApi;

  function updEngine(newEngineId: string) {
    if (newEngineId === '') {
      const curEngineObj = enginesById[settings.engine];
      if (curEngineObj) {
        updateSettings({
          ...settings,
          descr: curEngineObj.descr,
          engine: newEngineId,
          url: curEngineObj.url
        })
      } else {
        updateSettings({
          ...settings,
          engine: newEngineId
        })
      }
    } else {
      updateSettings({
        ...settings,
        engine: newEngineId
      })
    }
  }

  return (
    <>
      <SettingBlock
        titleForId='web-query-engine'
        title='Query Engine'
        moreInfo='Pick one of the common engines to perform your queries with, select Custom Engine to define your own engine using URL Template, or select Webpages in Worktable to use Webpages in the same Worktable which have QUERY placeholder inside their URLs.'
      >
        <select id="web-query-engine" value={settings.engine} onChange={e => {
          updEngine(e.target.value)
        }}>
          <option key='' value=''>Custom Engine</option>
          {
            engines.map(engine=>(
              <option
                key={engine.id}
                value={engine.id}
              >
                {engine.name}
              </option>
            ))
          }
        </select>
      </SettingBlock>

      <SettingBlock
        titleForId='web-query-descr'
        title='Description'
        moreInfo='A short description displayed in the query field.'
      >
        {
          settings.engine===''
          ? <input
              id="web-query-descr"
              type="text"
              value={settings.descr}
              maxLength={100}
              onChange={e => updateSettings({
                ...settings,
                descr: e.target.value
              })}
              placeholder="Type a description"
            />
          : <input id="web-query-descr" type="text" disabled={true} value={enginesById[settings.engine]?.descr || ''} />
        }
      </SettingBlock>

      <SettingBlock
        titleForId='web-query-url'
        title='URL Template'
        moreInfo='A template of a URL that will be opened to perform the query. Capitilized QUERY inside the url template is a placeholder that will be replaced with a query typed in the widget.'
      >
        {
          settings.engine===''
          ? <input
              id="web-query-url"
              type="text"
              value={settings.url}
              maxLength={2000}
              onChange={e => updateSettings({
                ...settings,
                url: e.target.value
              })}
              placeholder="Type a URL template"
            />
          : <input id="web-query-url" type="text" disabled={true} value={enginesById[settings.engine]?.url || ''} />
        }
      </SettingBlock>

      <SettingBlock
        titleForId='web-query-query'
        title='Query Template'
        moreInfo='If you need to retype similar queries, use this setting to specify a template for them. Capitilized QUERY inside the url template is a placeholder that will be replaced with a query typed in the widget. Template examples: "How to QUERY in Blender?" to search for Blender tutorials, "site:freeter.io QUERY" to search on freeter.io website.'
      >
        {
          <input
            id="web-query-query"
            type="text"
            value={settings.query}
            onChange={e => updateSettings({
              ...settings,
              query: e.target.value
            })}
            placeholder="Type a query template"
          />
        }
      </SettingBlock>
    </>
  )
}

export const settingsEditorComp: ReactComponent<SettingsEditorReactComponentProps<Settings>> = {
  type: 'react',
  Comp: SettingsEditorComp
}
