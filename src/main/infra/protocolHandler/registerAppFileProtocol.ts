/*
 * Copyright: (c) 2024, Alex Kaul
 * GNU General Public License v3.0 or later (see COPYING or https://www.gnu.org/licenses/gpl-3.0.txt)
 */

import { registerFileProtocol, registerHttpProtocol } from '@/infra/protocolHandler/protocolHandler';
import { hostFreeterApp, schemeFreeterFile } from '@common/infra/network';

export function registerAppFileProtocol(devMode: boolean) {
  if (devMode) {
    registerHttpProtocol(
      schemeFreeterFile,
      (req, callback) => {
        const urlObj = new URL(req.url);
        if (urlObj.host !== hostFreeterApp) {
          callback({ error: -3 } /* NET_ERROR=ABORTED */);
        }

        callback({ url: 'http://localhost:4000' + urlObj.pathname });
      },
      // The 'freeter-file' protocol should be standard in the dev mode:
      // - to enable the 'react-dev-tools' extension to run.
      true
    )
  } else {
    registerFileProtocol(schemeFreeterFile, (req, callback) => {
      const urlObj = new URL(req.url);
      if (urlObj.host !== hostFreeterApp) {
        callback({ error: -3 } /* NET_ERROR=ABORTED */);
      }

      // TODO
      // const relativePath = path.normalize(urlObj.pathname.substring(1));
      // const appPath = <app exe path>
      // const filePath = path.join(appPath, relativePath);
      callback({ error: -3 } /* NET_ERROR=ABORTED */);
    })
  }
}
