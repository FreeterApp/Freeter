/*
 * Copyright: (c) 2024, Alex Kaul
 * GNU General Public License v3.0 or later (see COPYING or https://www.gnu.org/licenses/gpl-3.0.txt)
 */

import { App, AppSettings } from '@/base/app';
import { makeFixture } from '@utils/makeFixture';

const appSettings: AppSettings[] = [{
  name: 'App A',
  cmdArgs: 'args a',
  execPath: 'path/a'
}, {
  name: 'App B',
  cmdArgs: 'args b',
  execPath: 'path/b'
}, {
  name: 'App C',
  cmdArgs: 'args c',
  execPath: 'path/c'
}, {
  name: 'App D',
  cmdArgs: 'args d',
  execPath: 'path/d'
}]

const apps: App[] = [{
  id: 'P-A',
  settings: appSettings[0],
}, {
  id: 'P-B',
  settings: appSettings[1],
}, {
  id: 'P-C',
  settings: appSettings[2],
}, {
  id: 'P-D',
  settings: appSettings[3],
}];

export const fixtureAppSettingsA = makeFixture(appSettings[0]);
export const fixtureAppSettingsB = makeFixture(appSettings[1]);
export const fixtureAppSettingsC = makeFixture(appSettings[2]);
export const fixtureAppSettingsD = makeFixture(appSettings[3]);

export const fixtureAppA = makeFixture(apps[0]);
export const fixtureAppB = makeFixture(apps[1]);
export const fixtureAppC = makeFixture(apps[2]);
export const fixtureAppD = makeFixture(apps[3]);
