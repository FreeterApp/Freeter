/*
 * Copyright: (c) 2024, Alex Kaul
 * GNU General Public License v3.0 or later (see COPYING or https://www.gnu.org/licenses/gpl-3.0.txt)
 */

import { mapEntityCollection } from '@/base/entityCollection';
import { createEntitiesState, EntitiesState } from '@/base/state/entities';
import { createUiState, UiState } from '@/base/state/ui';
import { MigrateVersionedObject } from '@common/base/versionedObject';

export const currentAppStateVersion = 2;

export interface AppState {
  entities: EntitiesState;
  ui: UiState;
}

export function createAppState(): AppState {
  return {
    entities: createEntitiesState(),
    ui: createUiState()
  }
}

export function initAppStateWidgets(appState: AppState): AppState {
  const { widgets, widgetTypes } = appState.entities;
  const updWidgets = mapEntityCollection(widgets, widget => {
    const type = widgetTypes[widget.type];
    if (type) {
      return {
        ...widget,
        settings: type.createSettingsState(widget.settings)
      }
    }
    return widget;
  })

  return {
    ...appState,
    entities: {
      ...appState.entities,
      widgets: updWidgets
    }
  }
}

export function createPersistentAppState(appState: AppState) {
  const { copy, dragDrop, editMode, palette, memSaver, modalScreens, worktable, ...persistentUi } = appState.ui
  const { widgetTypes, widgets, ...persistentEntities } = appState.entities;
  return {
    entities: {
      ...persistentEntities,
      widgets: mapEntityCollection(widgets, widget => {
        const { exposedApi, ...persistentWidget } = widget;
        return persistentWidget
      })
    },
    ui: persistentUi
  }
}

export type PersistentAppState = ReturnType<typeof createPersistentAppState>;

export function mergeAppStateWithPersistentAppState(
  appState: AppState,
  persistentAppState: PersistentAppState
): AppState {
  return {
    ...appState,
    entities: {
      ...appState.entities,
      ...persistentAppState.entities,
      // widgets: mapEntityCollection(persistentAppState.entities.widgets, persistentWidget => ({
      //   ...persistentWidget,
      // }))
    },
    ui: {
      ...appState.ui,
      ...persistentAppState.ui,
      appConfig: {
        ...appState.ui.appConfig,
        ...persistentAppState.ui.appConfig,
      },
      apps: {
        ...appState.ui.apps,
        ...persistentAppState.ui.apps,
      },
      projectSwitcher: {
        ...appState.ui.projectSwitcher,
        ...persistentAppState.ui.projectSwitcher,
      },
      shelf: {
        ...appState.ui.shelf,
        ...persistentAppState.ui.shelf,
      },
    }
  }
}

export const migrateAppState: MigrateVersionedObject<object, PersistentAppState> = (fromData, fromVer) => {
  console.log(fromVer);
  let toData = {
    ...fromData
  } as PersistentAppState
  if (fromVer < 2) {
    toData = {
      ...toData,
      entities: {
        ...toData.entities,
        projects: mapEntityCollection(toData.entities.projects, prj => ({
          ...prj,
          settings: {
            ...prj.settings,
            memSaver: {}
          }
        })),
        workflows: mapEntityCollection(toData.entities.workflows, wfl => ({
          ...wfl,
          settings: {
            ...wfl.settings,
            memSaver: {}
          }
        }))
      },
      ui: {
        ...toData.ui,
        appConfig: {
          ...toData.ui.appConfig,
          memSaver: {
            activateWorkflowsOnProjectSwitch: true,
            workflowInactiveAfter: -1
          }
        }
      }
    }
  }
  return toData;
}
