/*
 * Copyright: (c) 2024, Alex Kaul
 * GNU General Public License v3.0 or later (see COPYING or https://www.gnu.org/licenses/gpl-3.0.txt)
 */

import { mapEntityCollection } from '@/base/entityCollection';
import { createEntitiesState, EntitiesState } from '@/base/state/entities';
import { createUiState, UiState } from '@/base/state/ui';
import { MigrateVersionedObject } from '@common/base/versionedObject';

export const currentAppStateVersion = 1;

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
  const { applicationSettings, dragDrop, editMode, about, palette, projectManager, widgetSettings, workflowSettings, worktable, ...persistentUi } = appState.ui
  const { widgetTypes, /* widgets, */...persistentEntities } = appState.entities;
  return {
    // entities: {
    //   ...persistentEntities,
    //   widgets: mapEntityCollection(widgets, widget => {
    //     const { ...persistentWidget } = widget;
    //     return persistentWidget
    //   })
    // },
    entities: persistentEntities,
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
      ...persistentAppState.ui
    }
  }
}

export const migrateAppState: MigrateVersionedObject<object, PersistentAppState> = (data) => data as PersistentAppState;
