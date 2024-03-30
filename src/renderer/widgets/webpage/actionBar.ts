/*
 * Copyright: (c) 2024, Alex Kaul
 * GNU General Public License v3.0 or later (see COPYING or https://www.gnu.org/licenses/gpl-3.0.txt)
 */

import { ActionBarItems } from '@/base/actionBar';
import { canGoBack, canGoForward, canGoHome, canRefresh, goBack, goForward, goHome, labelGoBack, labelGoForward, labelGoHome, labelOpenInBrowser, labelRefresh, openCurrentInBrowser, refresh } from './actions';
import { backSvg, forwardSvg, homeSvg, openInBrowserSvg, refreshSvg } from './icons';
import { WidgetApi } from '@/base/widgetApi';

export function createActionBarItems(elWebview: Electron.WebviewTag | null, widgetApi: WidgetApi, homeUrl: string): ActionBarItems {
  return (!elWebview || !homeUrl) ? [] : [
    {
      enabled: canGoHome(elWebview, homeUrl),
      icon: homeSvg,
      id: 'HOME',
      title: labelGoHome,
      doAction: async () => goHome(elWebview, homeUrl)
    },
    {
      enabled: canGoBack(elWebview),
      icon: backSvg,
      id: 'BACK',
      title: labelGoBack,
      doAction: async () => goBack(elWebview)
    },
    {
      enabled: canGoForward(elWebview),
      icon: forwardSvg,
      id: 'FORWARD',
      title: labelGoForward,
      doAction: async () => goForward(elWebview)
    },
    {
      enabled: canRefresh(),
      icon: refreshSvg,
      id: 'REFRESH',
      title: labelRefresh,
      doAction: async () => refresh(elWebview)
    },
    {
      enabled: true,
      icon: openInBrowserSvg,
      id: 'OPEN-IN-BROWSER',
      title: labelOpenInBrowser,
      doAction: async () => openCurrentInBrowser(elWebview, widgetApi)
    }
  ];
}
