/*
 * Copyright: (c) 2024, Alex Kaul
 * GNU General Public License v3.0 or later (see COPYING or https://www.gnu.org/licenses/gpl-3.0.txt)
 */

import { createApp, duplicateApp, updateAppSettings } from '@/base/app';
import { fixtureAppA, fixtureAppSettingsA } from '@tests/base/fixtures/app';

describe('App', () => {
  describe('createApp()', () => {
    it('should return a new app object with specified props', () => {
      const id = 'ID';
      const appName = 'APP NAME';

      const app = createApp(id, appName);

      expect(app.id).toBe(id);
      expect(app.settings.name).toBe(appName);
      expect(app.settings.cmdArgs).toBe('');
      expect(app.settings.execPath).toBe('');
    })
  })

  describe('duplicateApp()', () => {
    it('should return a new app duplicate object', () => {
      const app = fixtureAppA({
        id: 'APP-ID',
        settings: fixtureAppSettingsA({
          name: 'App Name',
          cmdArgs: 'Cmd Args',
          execPath: 'Exec Path'
        })
      })
      const newId = 'NEW-APP-ID';
      const newName = 'New App Name';

      const newApp = duplicateApp(app, newId, newName);

      expect(newApp.id).toBe(newId);
      expect(newApp.settings).toEqual({
        ...app.settings,
        name: newName
      });
    })
  })

  describe('updateAppSettings()', () => {
    it('should return a new app object with updated settings', () => {
      const currentApp = fixtureAppA();
      const newSettings = fixtureAppSettingsA({ name: 'NEW NAME' });
      const expectedApp = {
        ...currentApp,
        settings: newSettings
      }

      const updatedApp = updateAppSettings(currentApp, newSettings);

      expect(updatedApp).toEqual(expectedApp);
    })
  })

})
