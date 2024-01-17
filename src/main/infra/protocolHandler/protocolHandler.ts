/*
 * Copyright: (c) 2024, Alex Kaul
 * GNU General Public License v3.0 or later (see COPYING or https://www.gnu.org/licenses/gpl-3.0.txt)
 */

import { app, protocol } from 'electron';

/**
 * Should be called **before `app` is ready**
 */
export function registerProtocol(
  scheme: string,
  handler: (request: Request) => (Response) | (Promise<Response>)
): void {
  protocol.registerSchemesAsPrivileged([{
    scheme,
    privileges: {
      standard: true,
      secure: true,
      supportFetchAPI: true,
    }
  }])
  app.whenReady().then(() => {
    protocol.handle(scheme, handler)
  });
}
