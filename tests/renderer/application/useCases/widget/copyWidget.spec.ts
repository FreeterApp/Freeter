/*
 * Copyright: (c) 2024, Alex Kaul
 * GNU General Public License v3.0 or later (see COPYING or https://www.gnu.org/licenses/gpl-3.0.txt)
 */

import { createCopyWidgetUseCase } from '@/application/useCases/widget/copyWidget';
import { AppState } from '@/base/state/app';
import { fixtureAppState } from '@tests/base/state/fixtures/appState';
import { fixtureAppStore } from '@tests/data/fixtures/appStore';
import { fixtureCopyState } from '@tests/base/state/fixtures/copy';
import { fixtureWidgetA, fixtureWidgetB } from '@tests/base/fixtures/widget';

async function setup(initState: AppState) {
  const [appStore] = await fixtureAppStore(initState);
  const copyWidgetUseCase = createCopyWidgetUseCase({
    appStore,
  });
  return {
    appStore,
    copyWidgetUseCase,
  }
}

describe('copyWidgetUseCase()', () => {
  it('should do nothing, if no such widget exists', async () => {
    const widgetA = fixtureWidgetA()
    const initState = fixtureAppState({
      entities: {
        widgets: {
          [widgetA.id]: widgetA
        },
      },
      ui: {
        copy: fixtureCopyState({}),
      }
    })
    const {
      appStore,
      copyWidgetUseCase
    } = await setup(initState)
    const expectState = appStore.get();

    copyWidgetUseCase('NO-SUCH-ID');

    expect(appStore.get()).toBe(expectState);
  })

  it('should add the widget to the copy state', async () => {
    const widgetA = fixtureWidgetA()
    const initState = fixtureAppState({
      entities: {
        widgets: {
          [widgetA.id]: widgetA
        },
      },
      ui: {
        copy: fixtureCopyState({}),
      }
    })
    const expectState: AppState = {
      ...initState,
      ui: {
        ...initState.ui,
        copy: {
          ...initState.ui.copy,
          widgets: {
            entities: {
              [widgetA.id]: {
                id: widgetA.id,
                deps: {},
                entity: widgetA
              }
            },
            list: [widgetA.id]
          }
        }
      }
    }
    const {
      appStore,
      copyWidgetUseCase
    } = await setup(initState)

    copyWidgetUseCase(widgetA.id);

    expect(appStore.get()).toEqual(expectState);
  })

  it('should move the widget to the front of the copied widgets list, when it is already there', async () => {
    const widgetA = fixtureWidgetA()
    const initState = fixtureAppState({
      entities: {
        widgets: {
          [widgetA.id]: widgetA
        },
      },
      ui: {
        copy: fixtureCopyState({
          widgets: {
            entities: {
              [widgetA.id]: {
                id: widgetA.id,
                deps: {},
                entity: widgetA
              }
            },
            list: ['some-id', 'some-id2', widgetA.id, 'some-id3']
          }
        }),
      }
    })
    const expectState: AppState = {
      ...initState,
      ui: {
        ...initState.ui,
        copy: {
          ...initState.ui.copy,
          widgets: {
            ...initState.ui.copy.widgets,
            list: [widgetA.id, 'some-id', 'some-id2', 'some-id3']
          }
        }
      }
    }
    const {
      appStore,
      copyWidgetUseCase
    } = await setup(initState)

    copyWidgetUseCase(widgetA.id);

    expect(appStore.get()).toEqual(expectState);
  })

  it('should remove entities from the copy state, when there are too many items on the list', async () => {
    const widgetA = fixtureWidgetA()
    const widgetB = fixtureWidgetB()
    const initState = fixtureAppState({
      entities: {
        widgets: {
          [widgetA.id]: widgetA,
          [widgetB.id]: widgetB,
        },
      },
      ui: {
        copy: fixtureCopyState({
          widgets: {
            entities: {
              [widgetA.id]: {
                id: widgetA.id,
                deps: {},
                entity: widgetA
              }
            },
            list: ['some-id', 'some-id2', 'some-id3', 'some-id4', 'some-id5', 'some-id6', 'some-id7', 'some-id8', 'some-id9', widgetA.id]
          }
        }),
      }
    })
    const expectState: AppState = {
      ...initState,
      ui: {
        ...initState.ui,
        copy: {
          ...initState.ui.copy,
          widgets: {
            ...initState.ui.copy.widgets,
            entities: {
              [widgetB.id]: {
                id: widgetB.id,
                deps: {},
                entity: widgetB
              }
            },
            list: [widgetB.id, 'some-id', 'some-id2', 'some-id3', 'some-id4', 'some-id5', 'some-id6', 'some-id7', 'some-id8', 'some-id9']
          }
        }
      }
    }
    const {
      appStore,
      copyWidgetUseCase
    } = await setup(initState)

    copyWidgetUseCase(widgetB.id);

    expect(appStore.get()).toEqual(expectState);
  })

})
