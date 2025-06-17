/*
 * Copyright: (c) 2024, Alex Kaul
 * GNU General Public License v3.0 or later (see COPYING or https://www.gnu.org/licenses/gpl-3.0.txt)
 */

import { WidgetApi } from '@/widgets/appModules';
import { sanitizeUrl } from '@common/helpers/sanitizeUrl';

export const labelGoHome = 'Go to start page';
export const labelGoBack = 'Go Back';
export const labelGoForward = 'Go Forward';
export const labelReload = 'Reload this page';
export const labelHardReload = 'Hard reload this page';
export const labelAutoReloadStart = 'Start auto-reload';
export const labelAutoReloadStop = 'Stop auto-reload';
export const labelOpenInBrowser = 'Open in web browser';
export const labelSaveAs = 'Save as...';
export const labelCopyCurrentAddress = 'Copy current address';
export const labelZoom = 'Zoom';
export const labelPrintPage = 'Print...';
export const labelOpenLinkInBrowser = 'Open link in web browser';
export const labelSaveLinkAs = 'Save link as...';
export const labelCopyLinkAddress = 'Copy link address';
export const labelSaveImageAs = 'Save image as...';
export const labelCopyImage = 'Copy image';
export const labelCopyImageAddress = 'Copy image address';
export const labelUndo = 'Undo';
export const labelRedo = 'Redo';
export const labelCut = 'Cut';
export const labelCopy = 'Copy';
export const labelPaste = 'Paste';
export const labelPasteAsPlainText = 'Paste as plain text';
export const labelSelectAll = 'Select All';
export const labelDevTools = 'Developer tools'


export function canReload() {
  return true;
}

export function reload(elWebview: Electron.WebviewTag) {
  if (elWebview.isLoading()) {
    elWebview.stop();
  }
  elWebview.reload();
}

export function hardReload(elWebview: Electron.WebviewTag) {
  if (elWebview.isLoading()) {
    elWebview.stop();
  }
  elWebview.reloadIgnoringCache();
}

export function canGoBack(elWebview: Electron.WebviewTag) {
  return elWebview.canGoBack();
}

export function goBack(elWebview: Electron.WebviewTag) {
  elWebview.goBack()
}

export function canGoForward(elWebview: Electron.WebviewTag) {
  return elWebview.canGoForward();
}

export function goForward(elWebview: Electron.WebviewTag) {
  elWebview.goForward()
}

export function canGoHome(elWebview: Electron.WebviewTag, url: string) {
  const homeUrl = sanitizeUrl(url);
  let enabled = false;
  if (homeUrl) {
    const curUrl = elWebview.getURL();
    if (!curUrl) {
      enabled = false;
    } else {
      enabled = new URL(curUrl).toString() !== new URL(homeUrl).toString();
    }
  }
  return enabled;
}

export function goHome(elWebview: Electron.WebviewTag, homeUrl: string) {
  elWebview.loadURL(sanitizeUrl(homeUrl));
}

export function zoomPage(elWebview: Electron.WebviewTag, zoomFactor: number) {
  elWebview.setZoomFactor(zoomFactor);
}

export function openCurrentInBrowser(elWebview: Electron.WebviewTag, widgetApi: WidgetApi) {
  widgetApi.shell.openExternalUrl(elWebview.getURL());
}

export function savePage(elWebview: Electron.WebviewTag) {
  elWebview.downloadURL(elWebview.getURL());
}

export function copyCurrentAddress(elWebview: Electron.WebviewTag, widgetApi: WidgetApi) {
  widgetApi.clipboard.writeText(elWebview.getURL());
}

export function printPage(elWebview: Electron.WebviewTag) {
  elWebview.print();
}

export function openLinkInBrowser(url: string, widgetApi: WidgetApi) {
  widgetApi.shell.openExternalUrl(url);
}

export function saveLink(url: string, elWebview: Electron.WebviewTag) {
  elWebview.downloadURL(url);
}

export function copyLinkAddress(url: string, widgetApi: WidgetApi) {
  widgetApi.clipboard.writeText(url);
}

export function openDevTools(elWebview: Electron.WebviewTag) {
  if (elWebview.isDevToolsOpened()) {
    elWebview.closeDevTools();
  }
  elWebview.openDevTools();
}
