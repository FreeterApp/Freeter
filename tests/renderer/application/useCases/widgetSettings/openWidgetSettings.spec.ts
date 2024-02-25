/*
 * Copyright: (c) 2024, Alex Kaul
 * GNU General Public License v3.0 or later (see COPYING or https://www.gnu.org/licenses/gpl-3.0.txt)
 */

import { createOpenWidgetSettingsUseCase } from '@/application/useCases/widgetSettings/openWidgetSettings';
import { AppState } from '@/base/state/app';
import { fixtureWidgetA, fixtureWidgetEnvAreaShelf } from '@tests/base/fixtures/widget';
import { fixtureAppState } from '@tests/base/state/fixtures/appState';
import { fixtureModalScreens, fixtureModalScreensData } from '@tests/base/state/fixtures/modalScreens';
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
  it('should correctly update the state, when the widget id exists and the screen is not open', async () => {
    const widget = fixtureWidgetA({ id: widgetId })
    const env = fixtureWidgetEnvAreaShelf();
    const initState = fixtureAppState({
      entities: {
        widgets: {
          [widgetId]: widget
        }
      },
      ui: {
        modalScreens: fixtureModalScreens({
          data: fixtureModalScreensData({
            widgetSettings: fixtureWidgetSettings({
              widgetInEnv: null
            })
          }),
          order: ['about']
        })
      }
    })
    const expectState: AppState = {
      ...initState,
      ui: {
        ...initState.ui,
        modalScreens: {
          ...initState.ui.modalScreens,
          data: {
            ...initState.ui.modalScreens.data,
            widgetSettings: {
              ...initState.ui.modalScreens.data.widgetSettings,
              widgetInEnv: {
                widget,
                env: {
                  ...env,
                  isPreview: true
                }
              }
            }
          },
          order: ['about', 'widgetSettings']
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

  it('should correctly update the state, when the widget id exists and the screen is already open', async () => {
    const widget = fixtureWidgetA({ id: widgetId })
    const env = fixtureWidgetEnvAreaShelf();
    const initState = fixtureAppState({
      entities: {
        widgets: {
          [widgetId]: widget
        }
      },
      ui: {
        modalScreens: fixtureModalScreens({
          data: fixtureModalScreensData({
            widgetSettings: fixtureWidgetSettings({
              widgetInEnv: null
            })
          }),
          order: ['widgetSettings', 'about']
        })
      }
    })
    const expectState: AppState = {
      ...initState,
      ui: {
        ...initState.ui,
        modalScreens: {
          ...initState.ui.modalScreens,
          data: {
            ...initState.ui.modalScreens.data,
            widgetSettings: {
              ...initState.ui.modalScreens.data.widgetSettings,
              widgetInEnv: {
                widget,
                env: {
                  ...env,
                  isPreview: true
                }
              }
            }
          },
          order: ['about', 'widgetSettings']
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
        modalScreens: fixtureModalScreens({
          data: fixtureModalScreensData({
            widgetSettings: fixtureWidgetSettings({
              widgetInEnv: null
            })
          }),
          order: ['about']
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
