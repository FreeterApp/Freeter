/*
 * Copyright: (c) 2024, Alex Kaul
 * GNU General Public License v3.0 or later (see COPYING or https://www.gnu.org/licenses/gpl-3.0.txt)
 */

import { createSetExposedApiUseCase } from '@/application/useCases/widget/setExposedApi';
import { AppState } from '@/base/state/app';
import { fixtureAppState } from '@tests/base/state/fixtures/appState';
import { fixtureAppStore } from '@tests/data/fixtures/appStore';
import { fixtureWidgetA } from '@tests/base/fixtures/widget';

async function setup(initState: AppState) {
  const [appStore] = await fixtureAppStore(initState);
  const setExposedApiUseCase = createSetExposedApiUseCase({
    appStore,
  });
  return {
    appStore,
    setExposedApiUseCase,
  }
}

describe('setExposedApiUseCase()', () => {
  it('should do nothing, if no such widget exists', async () => {
    const widgetA = fixtureWidgetA({ exposedApi: {} })
    const initState = fixtureAppState({
      entities: {
        widgets: {
          [widgetA.id]: widgetA
        },
      }
    })
    const {
      appStore,
      setExposedApiUseCase
    } = await setup(initState)
    const expectState = appStore.get();

    setExposedApiUseCase('NO-SUCH-ID', { 'some': 'obj' });

    expect(appStore.get()).toBe(expectState);
  })

  it('should update the exposedApi object for the widget', async () => {
    const widgetA = fixtureWidgetA({ exposedApi: {} })
    const newExposedApi = { 'some': 'object' };
    const initState = fixtureAppState({
      entities: {
        widgets: {
          [widgetA.id]: widgetA
        },
      }
    })
    const expectState: AppState = {
      ...initState,
      entities: {
        ...initState.entities,
        widgets: {
          [widgetA.id]: {
            ...widgetA,
            exposedApi: newExposedApi
          }
        }
      }
    }
    const {
      appStore,
      setExposedApiUseCase
    } = await setup(initState)

    setExposedApiUseCase(widgetA.id, newExposedApi);

    expect(appStore.get()).toEqual(expectState);
  })
})
