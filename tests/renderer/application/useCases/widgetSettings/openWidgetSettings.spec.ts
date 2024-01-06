/*
 * Copyright: (c) 2024, Alex Kaul
 * GNU General Public License v3.0 or later (see COPYING or https://www.gnu.org/licenses/gpl-3.0.txt)
 */

import { createOpenWidgetSettingsUseCase } from '@/application/useCases/widgetSettings/openWidgetSettings';
import { AppState } from '@/base/state/app';
import { fixtureWidgetA, fixtureWidgetEnvAreaShelf } from '@tests/base/fixtures/widget';
import { fixtureAppState } from '@tests/base/state/fixtures/appState';
import { fixtureWidgetSettings } from '@tests/base/state/fixtures/widgetSettings';
import { fixtureAppStore } from '@tests/data/fixtures/appStore';

const widgetId = 'WIDGET-ID';

async function setup(initState: AppState) {
  const [appStore] = await fixtureAppStore(initState);
  const openWidgetSettingsUseCase = createOpenWidgetSettingsUseCase({
    appStore
  });
  return {
    appStore,
    openWidgetSettingsUseCase
  }
}

describe('openWidgetSettingsUseCase()', () => {
  it('should set widgetInEnv with isPreview=true to the state, if the widget id exists', async () => {
    const widget = fixtureWidgetA({ id: widgetId })
    const env = fixtureWidgetEnvAreaShelf();
    const initState = fixtureAppState({
      entities: {
        widgets: {
          [widgetId]: widget
        }
      },
      ui: {
        widgetSettings: fixtureWidgetSettings({
          widgetInEnv: null
        })
      }
    })
    const expectState: AppState = {
      ...initState,
      ui: {
        ...initState.ui,
        widgetSettings: {
          ...initState.ui.widgetSettings,
          widgetInEnv: {
            widget,
            env: {
              ...env,
              isPreview: true
            }
          }
        }
      }
    }
    const {
      appStore,
      openWidgetSettingsUseCase
    } = await setup(initState)

    openWidgetSettingsUseCase(widgetId, env);

    const newState = appStore.get();
    expect(newState).toEqual(expectState);
  })

  it('should do nothing, if the widget id does not exist', async () => {
    const widget = fixtureWidgetA({ id: widgetId })
    const env = fixtureWidgetEnvAreaShelf();
    const initState = fixtureAppState({
      entities: {
        widgets: {
          [widgetId]: widget
        }
      },
      ui: {
        widgetSettings: fixtureWidgetSettings({
          widgetInEnv: null
        })
      }
    })
    const {
      appStore,
      openWidgetSettingsUseCase
    } = await setup(initState)
    const expectState = appStore.get();

    openWidgetSettingsUseCase('NO-SUCH-ID', env);

    expect(appStore.get()).toBe(expectState);
  })
})
