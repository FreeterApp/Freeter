/*
 * Copyright: (c) 2024, Alex Kaul
 * GNU General Public License v3.0 or later (see COPYING or https://www.gnu.org/licenses/gpl-3.0.txt)
 */

import { ProcessProvider } from '@/application/interfaces/processProvider';

export function createProcessProvider(): ProcessProvider {
  return {
    getProcessInfo: () => ({
      browser: {
        name: 'Chrome',
        ver: process.versions.chrome
      },
      os: {
        name: process.platform,
        ver: process.getSystemVersion()
      },
      isLinux: process.platform === 'linux',
      isMac: process.platform === 'darwin',
      isWin: process.platform === 'win32',
      isDevMode: process.env.NODE_ENV !== 'production'
    })
  }
}

