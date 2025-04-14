/*
 * Copyright: (c) 2024, Alex Kaul
 * GNU General Public License v3.0 or later (see COPYING or https://www.gnu.org/licenses/gpl-3.0.txt)
 */

import { Button, ReactComponent, WidgetReactComponentProps } from '@/widgets/appModules';
import { Settings, defaultEngine, enginesById } from './settings';
import * as styles from './widget.module.scss';
import { FormEvent, useMemo, useState } from 'react';
import { querySvg } from '@/widgets/web-query/icons';
import { sanitizeUrl } from '@common/helpers/sanitizeUrl';

const queryPlaceholder = 'QUERY';

function WidgetComp({settings, widgetApi}: WidgetReactComponentProps<Settings>) {
  const [typedQuery, setTypedQuery] = useState('');
  const { shell } = widgetApi;

  const {descr, urlTpl, queryTpl, notConfigNotes} = useMemo(() => {
    const engineId = settings.engine;
    let descr = ''
    let urlTpl = '';
    const notConfigNotes: string[] = [];
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

    const queryTpl = settings.query.trim();

    if (queryTpl !== '' && queryTpl.indexOf(queryPlaceholder)<0) {
      notConfigNotes.push('Missing QUERY in Query template')
    }

    return {descr, urlTpl, queryTpl, notConfigNotes}
  }, [settings.descr, settings.engine, settings.query, settings.url])

  const onQuerySubmit = useMemo(() => {
    if (notConfigNotes.length>0) {
      return (_: FormEvent<HTMLFormElement>) => undefined;
    } else {
      const finalQuery = queryTpl === '' ? typedQuery : queryTpl.replaceAll(queryPlaceholder, typedQuery);
      const queryForUrl = encodeURIComponent(finalQuery);
      const finalUrl = urlTpl.replaceAll(queryPlaceholder, queryForUrl);

      return (e: FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        if (settings.engine === 'webpages') {
          document.querySelectorAll<HTMLIFrameElement>('webview').forEach((webview) => {
            if (!webview.dataset.originalSrc && webview.src.includes(queryPlaceholder)) {
              webview.dataset.originalSrc = webview.src;
            }
            if (webview.dataset.originalSrc) {
              webview.src = webview.dataset.originalSrc.replaceAll(queryPlaceholder, queryForUrl);
            }
          });
        } else {
          setTypedQuery('');
          shell.openExternalUrl(finalUrl);
        }
      }
    }
  }, [notConfigNotes.length, queryTpl, shell, typedQuery, urlTpl])

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
