/*
 * Copyright: (c) 2024, Alex Kaul
 * GNU General Public License v3.0 or later (see COPYING or https://www.gnu.org/licenses/gpl-3.0.txt)
 */

import { createSaveWidgetSettingsUseCase } from '@/application/useCases/widgetSettings/saveWidgetSettings';
import { AppState } from '@/base/state/app';
import { fixtureWidgetA, fixtureWidgetEnvAreaShelf } from '@tests/base/fixtures/widget';
import { fixtureAppState } from '@tests/base/state/fixtures/appState';
import { fixtureWidgetSettings } from '@tests/base/state/fixtures/widgetSettings';
import { fixtureAppStore } from '@tests/data/fixtures/appStore';

async function setup(initState: AppState) {
  const [appStore] = await fixtureAppStore(initState);
  const saveWidgetSettingsUseCase = createSaveWidgetSettingsUseCase({
    appStore
  });
  return {
    appStore,
    saveWidgetSettingsUseCase
  }
}

describe('saveWidgetSettingsUseCase()', () => {
  it('should do nothing, if widgetInEnv is null', async () => {
    const widget = fixtureWidgetA();
    const initState = fixtureAppState({
      entities: {
        widgets: {
          [widget.id]: widget
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
      saveWidgetSettingsUseCase
    } = await setup(initState)

    const expectState = appStore.get();
    saveWidgetSettingsUseCase();

    expect(appStore.get()).toBe(expectState);
  })

  it('should save the settings to Widgets state and set widgetInEnv=null in Widget Settings state', async () => {
    const widget = fixtureWidgetA({
      coreSettings: {
        name: 'Name A'
      },
      settings: {
        setting: 'value'
      }
    });
    const widgetWithNewSettings: typeof widget = {
      ...widget,
      coreSettings: {
        name: 'Name B',
      },
      settings: {
        setting: 'new-value'
      }
    }
    const initState = fixtureAppState({
      entities: {
        widgets: {
          [widget.id]: widget
        }
      },
      ui: {
        widgetSettings: fixtureWidgetSettings({
          widgetInEnv: {
            widget: widgetWithNewSettings,
            env: fixtureWidgetEnvAreaShelf()
          }
        })
      }
    })
    const expectState: AppState = {
      ...initState,
      entities: {
        ...initState.entities,
        widgets: {
          ...initState.entities.widgets,
          [widget.id]: {
            ...initState.entities.widgets[widget.id]!,
            coreSettings: widgetWithNewSettings.coreSettings,
            settings: widgetWithNewSettings.settings,
          }
        }
      },
      ui: {
        ...initState.ui,
        widgetSettings: {
          ...initState.ui.widgetSettings,
          widgetInEnv: null
        }
      }
    }
    const {
      appStore,
      saveWidgetSettingsUseCase
    } = await setup(initState)

    saveWidgetSettingsUseCase();

    const newState = appStore.get();
    expect(newState).toEqual(expectState);
  })
})
