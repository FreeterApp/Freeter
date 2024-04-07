/*
 * Copyright: (c) 2024, Alex Kaul
 * GNU General Public License v3.0 or later (see COPYING or https://www.gnu.org/licenses/gpl-3.0.txt)
 */

import { fixtureAppState } from '@tests/base/state/fixtures/appState';
import { fixtureAppAInColl } from '@tests/base/state/fixtures/entitiesState';
import { fixtureApps } from '@tests/base/state/fixtures/apps';
import { SharedState, createSharedState } from '@/base/state/shared';

describe('Shared State', () => {
  describe('createSharedState', () => {
    it('should create an empty object, if availableSlices is empty', async () => {
      const state = fixtureAppState({
        entities: {
          apps: {
            ...fixtureAppAInColl()
          }
        },
        ui: {
          apps: fixtureApps({
            appIds: ['SOME-APP-ID']
          })
        }
      });
      const expectRes: Partial<SharedState> = {
      }

      const gotState = createSharedState(state, []);

      expect(gotState).toEqual(expectRes);
    })

    it('should add the apps state slice, if availableSlices has apps', async () => {
      const state = fixtureAppState({
        entities: {
          apps: {
            ...fixtureAppAInColl()
          }
        },
        ui: {
          apps: fixtureApps({
            appIds: ['SOME-APP-ID']
          })
        }
      });
      const expectRes: Partial<SharedState> = {
        apps: {
          appIds: state.ui.apps.appIds,
          apps: state.entities.apps
        }
      }

      const gotState = createSharedState(state, ['apps']);

      expect(gotState).toEqual(expectRes);
    })
  })
})
