/*
 * Copyright: (c) 2024, Alex Kaul
 * GNU General Public License v3.0 or later (see COPYING or https://www.gnu.org/licenses/gpl-3.0.txt)
 */

import { Button, ReactComponent, WidgetReactComponentProps } from '@/widgets/appModules';
import { Settings, SettingsMode, defaultEngine, enginesById } from './settings';
import * as styles from './widget.module.scss';
import { FormEvent, useMemo, useState } from 'react';
import { querySvg } from '@/widgets/web-query/icons';
import { sanitizeUrl } from '@common/helpers/sanitizeUrl';
import { WebpageExposedApi } from '@/widgets/interfaces';

const queryPlaceholder = 'QUERY';

const replaceQueryPlaceholder = (strWithQuery: string, queryVal: string) => strWithQuery.replaceAll(queryPlaceholder, queryVal);

function WidgetComp({settings, widgetApi}: WidgetReactComponentProps<Settings>) {
  const [typedQuery, setTypedQuery] = useState('');
  const { shell, widgets } = widgetApi;

  const {descr, urlTpl, queryTpl, notConfigNotes} = useMemo(() => {
    const engineId = settings.engine;
    const modeId = settings.mode;
    let descr = ''
    let urlTpl = '';
    const notConfigNotes: string[] = [];
    if (modeId === SettingsMode.Browser) {
      if (engineId !== '') {
        const engineObj = enginesById[engineId]
        if (engineObj) {
          descr = engineObj.descr;
          urlTpl = engineObj.url;
        } else {
          descr = defaultEngine.descr;
          urlTpl = defaultEngine.url;
        }
      } else {
        descr = settings.descr;
        urlTpl = sanitizeUrl(settings.url);
        if(urlTpl==='') {
          notConfigNotes.push('Invalid URL template')
        } else if (urlTpl.indexOf(queryPlaceholder)<0) {
          notConfigNotes.push('Missing QUERY in URL template')
        }
      }
    } else {
      descr = settings.descr;
    }

    const queryTpl = settings.query.trim();

    if (queryTpl !== '' && queryTpl.indexOf(queryPlaceholder)<0) {
      notConfigNotes.push('Missing QUERY in Query template')
    }

    return {descr, urlTpl, queryTpl, notConfigNotes}
  }, [settings.descr, settings.engine, settings.mode, settings.query, settings.url])

  const onQuerySubmit = useMemo(() => {
    if (notConfigNotes.length>0) {
      return (_: FormEvent<HTMLFormElement>) => undefined;
    } else {
      const finalQuery = queryTpl === '' ? typedQuery : replaceQueryPlaceholder(queryTpl, typedQuery);
      const queryForUrl = encodeURIComponent(finalQuery);

      return (e: FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        setTypedQuery('');
        switch (settings.mode) {
          case SettingsMode.Browser: {
            const finalUrl = replaceQueryPlaceholder(urlTpl, queryForUrl);
            shell.openExternalUrl(finalUrl);
            break;
          }
          case SettingsMode.Webpages: {
            const webpageWidgets = widgets.getWidgetsInCurrentWorkflow<WebpageExposedApi>('webpage');
            for (const {api} of webpageWidgets) {
              if (api.getUrl && api.openUrl) {
                const tplUrl = api.getUrl();
                const finalUrl = replaceQueryPlaceholder(tplUrl, queryForUrl);
                if (tplUrl!==finalUrl) {
                  api.openUrl(finalUrl);
                }
              }
            }
            break;
          }
        }
      }
    }
  }, [notConfigNotes.length, queryTpl, settings.mode, shell, typedQuery, urlTpl, widgets])

  return notConfigNotes.length===0
    ? <form onSubmit={onQuerySubmit} className={styles['web-query']}>
        <input className={styles['web-query-input']} type='text' placeholder={descr} value={typedQuery} onChange={(e) => setTypedQuery(e.target.value)} />
        <Button type='submit' iconSvg={querySvg} title='Query' />
      </form>
    : <div className={styles['not-configured']}>
        {notConfigNotes[0]}
      </div>
}

export const widgetComp: ReactComponent<WidgetReactComponentProps<Settings>> = {
  type: 'react',
  Comp: WidgetComp
}
