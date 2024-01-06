/*
 * Copyright: (c) 2024, Alex Kaul
 * GNU General Public License v3.0 or later (see COPYING or https://www.gnu.org/licenses/gpl-3.0.txt)
 */

import { app, protocol, ProtocolRequest } from 'electron';

/**
 * Should be called **before `app` is ready**
 */
export function registerFileProtocol(
  scheme: string,
  handler: (request: ProtocolRequest, callback: (response: string | Electron.ProtocolResponse) => void) => void
): void {
  app.whenReady().then(() => protocol.registerFileProtocol(scheme, handler))
}

/**
 * Should be called **before `app` is ready**
 */
export function registerHttpProtocol(
  scheme: string,
  handler: (request: ProtocolRequest, callback: (response: Electron.ProtocolResponse) => void) => void,
  asStandard?: boolean
): void {
  if (asStandard) {
    protocol.registerSchemesAsPrivileged([{
      scheme,
      privileges: {
        standard: true,
        supportFetchAPI: true,
      }
    }])
  }

  app.whenReady().then(() => protocol.registerHttpProtocol(scheme, handler))
}
