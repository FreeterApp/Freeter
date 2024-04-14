/*
 * Copyright: (c) 2024, Alex Kaul
 * GNU General Public License v3.0 or later (see COPYING or https://www.gnu.org/licenses/gpl-3.0.txt)
 */

import { BrowserWindowConstructorOptions, BrowserWindow as ElectronBrowserWindow, app } from 'electron';
import { BrowserWindow } from '@/application/interfaces/browserWindow'
import { GetWindowStateUseCase } from '@/application/useCases/browserWindow/getWindowState';
import { SetWindowStateUseCase } from '@/application/useCases/browserWindow/setWindowState';

const minWidth = 1200;
const minHeight = 600;

const defaultWinParams = {
  width: 1200,
  height: 700,
}

/**
 * BrowserWindow factory
 *
 * Should be called **in `app.whenReady().then(...)`**
 */
export function createRendererWindow(
  preload: string,
  url: string,
  icon: string | undefined,
  deps: {
    getWindowStateUseCase: GetWindowStateUseCase,
    setWindowStateUseCase: SetWindowStateUseCase,
  },
  opts: {
    devTools?: boolean,
  }
): BrowserWindow {
  const { getWindowStateUseCase, setWindowStateUseCase } = deps;
  const { h, w, x, y, isFull, isMaxi, isMini } = getWindowStateUseCase();
  const setDefaultValues = h < minHeight || w < minWidth;

  const win = new ElectronBrowserWindow({
    ...(setDefaultValues
      ? defaultWinParams
      : {
        width: w,
        height: h,
        x,
        y
      }
    ),
    icon,
    title: 'Freeter',
    minWidth,
    minHeight,
    webPreferences: {
      // (SECURITY) Disable access to NodeJS in Renderer
      nodeIntegration: false,
      // (SECURITY) Isolate global objects in preload script
      contextIsolation: true,
      webSecurity: true,
      preload,
      webviewTag: true,
    }
  });
  if (isMaxi) {
    win.maximize();
  }
  if (isFull) {
    win.setFullScreen(true)
  }
  if (isMini) {
    win.minimize();
  }

  function winStateUpdateHandler() {
    const { height, width, x, y } = win.getNormalBounds();
    setWindowStateUseCase({
      x,
      y,
      w: width,
      h: height,
      isFull: win.isFullScreen(),
      isMini: win.isMinimized(),
      isMaxi: win.isMaximized()
    })
  }

  let isQuittingApp = false;
  app.on('before-quit', () => {
    isQuittingApp = true;
  });
  win.on('close', e => {
    if (!isQuittingApp) {
      // Hide, don't close
      win.hide();
      e.preventDefault();
    }
  });

  win.on('resize', winStateUpdateHandler);
  win.on('move', winStateUpdateHandler);
  win.on('minimize', winStateUpdateHandler);
  win.on('restore', winStateUpdateHandler);
  win.on('maximize', winStateUpdateHandler);
  win.on('unmaximize', winStateUpdateHandler);
  win.on('enter-full-screen', winStateUpdateHandler);
  win.on('leave-full-screen', winStateUpdateHandler);

  // prevent leaving the app page (by dragging an image for example)
  win.webContents.on('will-navigate', evt => evt.preventDefault());

  // enable new windows in webview
  win.webContents.on('did-attach-webview', (_, wc) => {
    wc.setWindowOpenHandler((_details) => {
      const { height, width, x, y } = win.getBounds();
      const newW = width - 200;
      const newH = height - 150;
      const newX = x + Math.round((width - newW) / 2)
      const newY = y + Math.round((height - newH) / 2)
      let browserWinOpts: BrowserWindowConstructorOptions = {
        width: newW,
        height: newH,
        x: newX,
        y: newY,
        minimizable: false,
        icon,
        parent: win,
        title: 'Freeter',
        // modal: true // modal hides maximize/close buttons on MacOS
      }
      switch (process.platform) {
        case 'win32': {
          browserWinOpts = {
            ...browserWinOpts,
            frame: false,
            thickFrame: true,
            modal: true,
            titleBarOverlay: true,
            titleBarStyle: 'hidden'
          }
          break;
        }
      }
      return {
        action: 'allow',
        outlivesOpener: false,
        overrideBrowserWindowOptions: browserWinOpts
      }
    })
  })

  // and load the index.html of the app.
  win.loadURL(url);
  if (opts.devTools) {
    win.webContents.openDevTools();
  }

  return win;
}
