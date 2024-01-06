/*
 * Copyright: (c) 2024, Alex Kaul
 * GNU General Public License v3.0 or later (see COPYING or https://www.gnu.org/licenses/gpl-3.0.txt)
 */

import { ProcessInfo, ProcessInfoBrowser, ProcessInfoOs } from '@common/base/process';
import { makeFixture } from '@utils/makeFixture';

const processInfoBrowser: ProcessInfoBrowser = {
  name: 'Chrome',
  ver: '20.30'
}

const processInfoOsLinux: ProcessInfoOs = {
  name: 'linux',
  ver: '10.5'
}

const processInfoOsMac: ProcessInfoOs = {
  name: 'darwin',
  ver: '10.5'
}

const processInfoOsWin: ProcessInfoOs = {
  name: 'win32',
  ver: '10.5'
}

const processInfoLinux: ProcessInfo = {
  browser: processInfoBrowser,
  isDevMode: false,
  isLinux: true,
  isMac: false,
  isWin: false,
  os: processInfoOsLinux,
}

const processInfoMac: ProcessInfo = {
  browser: processInfoBrowser,
  isDevMode: false,
  isLinux: false,
  isMac: true,
  isWin: false,
  os: processInfoOsMac,
}

const processInfoWin: ProcessInfo = {
  browser: processInfoBrowser,
  isDevMode: false,
  isLinux: false,
  isMac: false,
  isWin: true,
  os: processInfoOsWin,
}

export const fixtureProcessInfoLinux = makeFixture(processInfoLinux);
export const fixtureProcessInfoMac = makeFixture(processInfoMac);
export const fixtureProcessInfoWin = makeFixture(processInfoWin);

export const fixtureProcessInfoOsLinux = makeFixture(processInfoOsLinux);
export const fixtureProcessInfoOsMac = makeFixture(processInfoOsMac);
export const fixtureProcessInfoOsWin = makeFixture(processInfoOsWin);

export const fixtureProcessInfoBrowser = makeFixture(processInfoBrowser);
