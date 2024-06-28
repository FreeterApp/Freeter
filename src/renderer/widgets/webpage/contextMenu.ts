/*
 * Copyright: (c) 2024, Alex Kaul
 * GNU General Public License v3.0 or later (see COPYING or https://www.gnu.org/licenses/gpl-3.0.txt)
 */

import { canGoBack, canGoForward, canGoHome, copyCurrentAddress, copyLinkAddress, goBack, goForward, goHome, hardReload, labelAutoReloadStart, labelAutoReloadStop, labelCopy, labelCopyCurrentAddress, labelCopyImageAddress, labelCopyLinkAddress, labelCut, labelDevTools, labelGoBack, labelGoForward, labelGoHome, labelHardReload, labelOpenInBrowser, labelOpenLinkInBrowser, labelPaste, labelPasteAsPlainText, labelPrintPage, labelRedo, labelReload, labelSaveAs, labelSaveImageAs, labelSaveLinkAs, labelSelectAll, labelUndo, openCurrentInBrowser, openDevTools, openLinkInBrowser, printPage, reload, saveLink, savePage } from './actions';
import { WidgetApi, WidgetContextMenuFactory, WidgetMenuItem } from '@/widgets/appModules';
import { ContextMenuParams } from 'electron';

function isElectronContextMenuParams(data: unknown): data is ContextMenuParams {
  if (!data) {
    return false;
  }

  return ((data as ContextMenuParams).x !== undefined && (data as ContextMenuParams).y !== undefined);
}

export function createContextMenuFactory(
  elWebview: Electron.WebviewTag | null,
  widgetApi: WidgetApi,
  homeUrl: string,
  autoReload: number,
  autoReloadStopped: boolean,
  setAutoReloadStopped: (val: boolean) => void
): WidgetContextMenuFactory {
  return (_contextId, contextData) => {
    const items: WidgetMenuItem[] = []
    if (elWebview && homeUrl) {
      let reloadItems: WidgetMenuItem[] = [
        {
          doAction: async () => reload(elWebview),
          label: labelReload
        },
        {
          doAction: async () => hardReload(elWebview),
          label: labelHardReload
        }
      ];
      if (autoReload > 0) {
        reloadItems = [{
          doAction: async () => setAutoReloadStopped(!autoReloadStopped),
          label: autoReloadStopped ? labelAutoReloadStart : labelAutoReloadStop
        }, ...reloadItems]
      }
      const defaultItems: WidgetMenuItem[] = [
        {
          doAction: async () => goHome(elWebview, homeUrl),
          enabled: canGoHome(elWebview, homeUrl),
          label: labelGoHome
        }, {
          doAction: async () => goBack(elWebview),
          enabled: canGoBack(elWebview),
          label: labelGoBack
        }, {
          doAction: async () => goForward(elWebview),
          enabled: canGoForward(elWebview),
          label: labelGoForward
        },
        ...reloadItems,
        {
          type: 'separator'
        }, {
          doAction: async () => openCurrentInBrowser(elWebview, widgetApi),
          label: labelOpenInBrowser
        }, {
          doAction: async () => savePage(elWebview),
          label: labelSaveAs
        }, {
          doAction: async () => copyCurrentAddress(elWebview, widgetApi),
          label: labelCopyCurrentAddress
        }, {
          doAction: async () => printPage(elWebview),
          label: labelPrintPage
        }
      ]

      const devItems: WidgetMenuItem[] = [
        {
          doAction: async () => openDevTools(elWebview),
          label: labelDevTools
        }
      ]

      if (!contextData) {
        items.push(...defaultItems);
      } else if (isElectronContextMenuParams(contextData)) {
        const editFlags = contextData.editFlags;
        const hasText = contextData.selectionText.length > 0;

        // link context
        if (contextData.linkURL) {
          if (items.length) {
            items.push({ type: 'separator' })
          }
          const itemsGroup: WidgetMenuItem[] = [
            {
              doAction: async () => openLinkInBrowser(contextData.linkURL, widgetApi),
              label: labelOpenLinkInBrowser
            }, {
              doAction: async () => saveLink(contextData.linkURL, elWebview),
              label: labelSaveLinkAs
            }, {
              doAction: async () => copyLinkAddress(contextData.linkText, contextData.linkURL, widgetApi),
              label: labelCopyLinkAddress
            }
          ]

          items.push(...itemsGroup);
        }

        // image context
        if (contextData.mediaType === 'image') {
          if (items.length) {
            items.push({ type: 'separator' })
          }
          const itemsGroup: WidgetMenuItem[] = [
            {
              doAction: async () => saveLink(contextData.srcURL, elWebview),
              label: labelSaveImageAs
              // }, {
              //   doAction: async () => copy(elWebview),
              //   label: labelCopyImage
            }, {
              doAction: async () => copyLinkAddress(contextData.titleText, contextData.srcURL, widgetApi),
              label: labelCopyImageAddress
            }
          ]

          items.push(...itemsGroup);
        }

        // if no specific context, then show default one
        if (!contextData.linkURL && contextData.mediaType === 'none' && !contextData.isEditable && !hasText) {
          if (items.length) {
            items.push({ type: 'separator' })
          }

          items.push(...defaultItems);
        }

        // editable context
        if (contextData.isEditable) {
          if (items.length) {
            items.push({ type: 'separator' })
          }
          const itemsGroup: WidgetMenuItem[] = [
            {
              enabled: editFlags.canUndo,
              label: labelUndo,
              role: 'undo'
            }, {
              enabled: editFlags.canRedo,
              label: labelRedo,
              role: 'redo'
            }
          ]

          items.push(...itemsGroup);
        }

        // editable or text context
        if (contextData.isEditable || hasText) {
          if (items.length) {
            items.push({ type: 'separator' })
          }
          if (contextData.isEditable) {
            items.push({
              enabled: editFlags.canCut && hasText,
              label: labelCut,
              role: 'cut',
            })
          }
          if (contextData.isEditable || hasText) {
            items.push({
              enabled: editFlags.canCopy && hasText,
              label: labelCopy,
              role: 'copy',
            })
          }
          if (contextData.isEditable) {
            items.push({
              enabled: editFlags.canPaste,
              label: labelPaste,
              role: 'paste',
            })
            items.push({
              enabled: editFlags.canPaste,
              label: labelPasteAsPlainText,
              role: 'pasteAndMatchStyle',
            })
            items.push({
              label: labelSelectAll,
              role: 'selectAll',
            })
          }
        }
      }

      if (items.length > 0) {
        items.push({ type: 'separator' })
      }
      items.push(...devItems);
    }

    return items;
  }
}
