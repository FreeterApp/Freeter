/*
 * Copyright: (c) 2024, Alex Kaul
 * GNU General Public License v3.0 or later (see COPYING or https://www.gnu.org/licenses/gpl-3.0.txt)
 */

import { ActionBarItem, ActionBarItems } from '@/base/actionBar';
import { canGoBack, canGoForward, canGoHome, canReload, goBack, goForward, goHome, labelAutoReloadStart, labelAutoReloadStop, labelGoBack, labelGoForward, labelGoHome, labelOpenInBrowser, labelReload, openCurrentInBrowser, reload } from './actions';
import { backSvg, forwardSvg, homeSvg, openInBrowserSvg, reloadSvg, reloadStartSvg, reloadStopSvg } from './icons';
import { WidgetApi } from '@/base/widgetApi';

export function createActionBarItems(
  elWebview: Electron.WebviewTag | null,
  widgetApi: WidgetApi,
  homeUrl: string,
  autoReload: number,
  autoReloadStopped: boolean,
  setAutoReloadStopped: (val: boolean) => void
): ActionBarItems {
  if (!elWebview || !homeUrl) {
    return []
  }

  let reloadItem: ActionBarItem;
  if (autoReload > 0) {
    reloadItem = {
      enabled: canReload(),
      icon: autoReloadStopped ? reloadStartSvg : reloadStopSvg,
      id: 'RELOAD',
      title: autoReloadStopped ? labelAutoReloadStart : labelAutoReloadStop,
      doAction: async () => setAutoReloadStopped(!autoReloadStopped)
    }
  } else {
    reloadItem = {
      enabled: canReload(),
      icon: reloadSvg,
      id: 'RELOAD',
      title: labelReload,
      doAction: async () => reload(elWebview)
    }
  }

  return [
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
    reloadItem,
    {
      enabled: true,
      icon: openInBrowserSvg,
      id: 'OPEN-IN-BROWSER',
      title: labelOpenInBrowser,
      doAction: async () => openCurrentInBrowser(elWebview, widgetApi)
    }
  ];
}
