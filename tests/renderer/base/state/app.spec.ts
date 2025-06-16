/*
 * Copyright: (c) 2024, Alex Kaul
 * GNU General Public License v3.0 or later (see COPYING or https://www.gnu.org/licenses/gpl-3.0.txt)
 */

import { AppState, initAppStateWidgets, createPersistentAppState, mergeAppStateWithPersistentAppState, PersistentAppState } from '@/base/state/app';
import { CreateSettingsState } from '@/widgets/appModules';
import { fixtureWidgetA } from '@tests/base/fixtures/widget';
import { fixtureAppConfig } from '@tests/base/fixtures/appConfig';
import { fixtureAppState } from '@tests/base/state/fixtures/appState';
import { fixtureAppAInColl, fixtureAppBInColl, fixtureProjectAInColl, fixtureProjectBInColl, fixtureWidgetAInColl, fixtureWidgetBInColl, fixtureWidgetCInColl, fixtureWidgetTypeAInColl, fixtureWorkflowAInColl, fixtureWorkflowBInColl } from '@tests/base/state/fixtures/entitiesState';
import { fixtureProjectSwitcher } from '@tests/base/state/fixtures/projectSwitcher'
import { fixtureShelf } from '@tests/base/state/fixtures/shelf'
import { fixtureApps } from '@tests/base/state/fixtures/apps';
import { EditTogglePos } from '@/base/state/ui';

type Settings = {
  prop: string;
  newProp: number;
}

const createSettingsState: CreateSettingsState<Settings> = settings => ({
  prop: typeof settings.prop === 'string' ? settings.prop : '',
  newProp: typeof settings.newProp === 'number' ? settings.newProp : (typeof settings.oldProp1 === 'number' ? settings.oldProp1 : (typeof settings.oldProp2 === 'number' ? settings.oldProp2 : 0)),
})

describe('AppState', () => {
  describe('initAppStateWidgets', () => {
    it('should update widgets\' settings to the current structure', async () => {
      const widgetType = 'WIDGET-TYPE';
      const state = fixtureAppState({
        entities: {
          widgetTypes: {
            ...fixtureWidgetTypeAInColl({
              id: widgetType,
              createSettingsState
            })
          },
          widgets: {
            ...fixtureWidgetAInColl({ id: 'A', type: widgetType, settings: { prop: 'val1', oldProp1: 123, obsolete: '-' } }),
            ...fixtureWidgetBInColl({ id: 'B', type: widgetType, settings: { prop: 'val1', newProp: 222 } }),
            ...fixtureWidgetCInColl({ id: 'C', type: widgetType, settings: { prop: 'val2', oldProp2: 456 } }),
          }
        }
      });
      const expectState: AppState = {
        ...state,
        entities: {
          ...state.entities,
          widgets: {
            'A': { ...state.entities.widgets['A']!, settings: { prop: 'val1', newProp: 123 } },
            'B': { ...state.entities.widgets['B']!, settings: { prop: 'val1', newProp: 222 } },
            'C': { ...state.entities.widgets['C']!, settings: { prop: 'val2', newProp: 456 } },
          }
        }
      }

      const gotState = initAppStateWidgets(state);

      expect(gotState).toEqual(expectState);
    })

    it('should not update settings for widgets of unknown type', async () => {
      const widgetType = 'WIDGET-TYPE';
      const unknownType = 'UNKNOWN-TYPE';
      const state = fixtureAppState({
        entities: {
          widgetTypes: {
            ...fixtureWidgetTypeAInColl({
              id: widgetType,
              createSettingsState
            })
          },
          widgets: {
            ...fixtureWidgetAInColl({ id: 'A', type: unknownType, settings: { prop: 'val1', oldProp1: 123, obsolete: '-' } }),
            ...fixtureWidgetBInColl({ id: 'B', type: unknownType, settings: { prop: 'val1', newProp: 222 } }),
            ...fixtureWidgetCInColl({ id: 'C', type: widgetType, settings: { prop: 'val2', oldProp2: 456 } }),
          }
        }
      });
      const expectState: AppState = {
        ...state,
        entities: {
          ...state.entities,
          widgets: {
            ...state.entities.widgets,
            'C': { ...state.entities.widgets['C']!, settings: { prop: 'val2', newProp: 456 } },
          }
        }
      }

      const gotState = initAppStateWidgets(state);

      expect(gotState).toEqual(expectState);
    })
  })

  describe('createPersistentAppState', () => {
    it('creates PersistentAppState by picking props from AppState that should be persisted', () => {
      const widgetA = fixtureWidgetA({ exposedApi: { some: 'object' } });
      const state = fixtureAppState({
        entities: {
          apps: fixtureAppAInColl(),
          projects: fixtureProjectAInColl(),
          widgets: {
            [widgetA.id]: widgetA
          },
          widgetTypes: fixtureWidgetTypeAInColl(),
          workflows: fixtureWorkflowAInColl()
        },
      });
      const { exposedApi: _, ...persistentWidgetA } = widgetA;
      const expectPersistentState: PersistentAppState = {
        entities: {
          apps: state.entities.apps,
          projects: state.entities.projects,
          widgets: {
            [persistentWidgetA.id]: persistentWidgetA
          },
          workflows: state.entities.workflows
        },
        ui: {
          appConfig: state.ui.appConfig,
          apps: state.ui.apps,
          menuBar: state.ui.menuBar,
          topBar: state.ui.topBar,
          editTogglePos: state.ui.editTogglePos,
          projectSwitcher: state.ui.projectSwitcher,
          shelf: state.ui.shelf
        }
      }

      const gotPersistentState = createPersistentAppState(state);

      expect(gotPersistentState).toEqual(expectPersistentState);
    })
  })

  describe('mergeAppStateWithPersistentAppState', () => {
    it('correctly merges AppState with all PersistentAppState props', () => {
      const widgetA = fixtureWidgetA({})
      const state = fixtureAppState({
        entities: {
          apps: fixtureAppAInColl(),
          projects: fixtureProjectAInColl(),
          widgets: {
            [widgetA.id]: widgetA
          },
          widgetTypes: fixtureWidgetTypeAInColl(),
          workflows: fixtureWorkflowAInColl()
        },
        ui: {
          menuBar: true,
          projectSwitcher: fixtureProjectSwitcher(),
          shelf: fixtureShelf()
        }
      })
      const { ...persistentWidgetA } = widgetA;
      const persistentState: PersistentAppState = {
        entities: {
          apps: fixtureAppBInColl(),
          projects: fixtureProjectBInColl(),
          widgets: {
            [persistentWidgetA.id]: persistentWidgetA
          },
          workflows: fixtureWorkflowBInColl()
        },
        ui: {
          appConfig: fixtureAppConfig({ mainHotkey: 'Accelerator' }),
          apps: fixtureApps({ appIds: ['APP1', 'APP2'] }),
          menuBar: false,
          topBar: true,
          editTogglePos: EditTogglePos.TabBarRight,
          projectSwitcher: fixtureProjectSwitcher({ currentProjectId: 'B1', projectIds: ['B1', 'B2'] }),
          shelf: fixtureShelf({ widgetList: [{ id: 'A1', widgetId: 'A1' }] })
        }
      }
      const expectState: AppState = {
        entities: {
          ...state.entities,
          ...persistentState.entities,
          widgets: {
            [persistentWidgetA.id]: {
              ...persistentWidgetA,
            }
          }
        },
        ui: {
          ...state.ui,
          ...persistentState.ui
        }
      }

      const gotState = mergeAppStateWithPersistentAppState(state, persistentState);

      expect(gotState).toEqual(expectState);
    })
  })
})
