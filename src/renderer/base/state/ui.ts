/*
 * Copyright: (c) 2024, Alex Kaul
 * GNU General Public License v3.0 or later (see COPYING or https://www.gnu.org/licenses/gpl-3.0.txt)
 */

import { App } from '@/base/app';
import { AppConfig } from '@/base/appConfig';
import { Entity, EntityId } from '@/base/entity';
import { EntityCollection } from '@/base/entityCollection';
import { EntityIdList } from '@/base/entityList';
import { List } from '@/base/list';
import { MemSaverWorkflowList } from '@/base/memSaver';
import { Project } from '@/base/project';
import { WidgetEntityDeps, WorkflowEntityDeps } from '@/base/state/entities';
import { defaultUiThemeId } from '@/base/uiTheme';
import { Widget, WidgetInEnv } from '@/base/widget';
import { WidgetLayoutItemWH, WidgetLayoutItemXY } from '@/base/widgetLayout';
import { WidgetList } from '@/base/widgetList';
import { Workflow } from '@/base/workflow';

export interface DragDropFromPaletteState {
  widgetTypeId?: EntityId;
  widgetCopyId?: EntityId;
}

export interface DragDropFromTopBarListState {
  widgetId: EntityId;
  listItemId: EntityId;
}

export interface DragDropFromWorkflowSwitcherState {
  projectId: EntityId;
  workflowId: EntityId;
}

export interface DragDropFromWorktableLayoutState {
  workflowId: EntityId;
  widgetId: EntityId;
  layoutItemId: EntityId;
  layoutItemWH: WidgetLayoutItemWH;
}

export interface DragDropFromState {
  palette?: DragDropFromPaletteState;
  topBarList?: DragDropFromTopBarListState;
  workflowSwitcher?: DragDropFromWorkflowSwitcherState;
  worktableLayout?: DragDropFromWorktableLayoutState;
}

export interface DragDropOverTopBarListState {
  listItemId: EntityId | null;
}

export interface DragDropOverWorkflowSwitcherState {
  workflowId: EntityId | null;
}

export interface DragDropOverWorktableLayoutState {
  layoutItemId: EntityId;
  layoutItemXY: WidgetLayoutItemXY;
}

export interface DragDropOverState {
  topBarList?: DragDropOverTopBarListState;
  workflowSwitcher?: DragDropOverWorkflowSwitcherState;
  worktableLayout?: DragDropOverWorktableLayoutState;
}

export interface DragDropState {
  from?: DragDropFromState;
  over?: DragDropOverState;
}

export interface PaletteState {
  widgetTypeIds: EntityIdList;
}

export interface ProjectManagerState {
  projects: EntityCollection<Project> | null;
  projectIds: EntityIdList | null;
  deleteProjectIds: Record<EntityId, boolean> | null;
  currentProjectId: EntityId;
  /**
   * Marks projects to duplicate data on Save.
   * key = new project id (copy content to)
   * value = existing project id (copy content from)
   */
  duplicateProjectIds: Record<EntityId, EntityId> | null;
}

export enum ProjectSwitcherPos {
  Hidden = 0,
  TopBar = 1,
  TabBarLeft = 2,
  TabBarRight = 3,
}

export interface ProjectSwitcherState {
  projectIds: EntityIdList;
  currentProjectId: EntityId;
  pos: ProjectSwitcherPos;
}

export interface AppManagerState {
  apps: EntityCollection<App> | null;
  appIds: EntityIdList | null;
  deleteAppIds: Record<EntityId, boolean> | null;
  currentAppId: EntityId;
}

export interface ApplicationSettingsState {
  appConfig: AppConfig | null;
}

export interface ShelfState {
  widgetList: WidgetList;
}

export interface WidgetSettingsState {
  widgetInEnv: WidgetInEnv | null;
}

export interface WorkflowSettingsState {
  workflow: Workflow | null;
}

export enum WorktableStateResizingItemEdgeX {
  Left = -1,
  Right = 1
}
export enum WorktableStateResizingItemEdgeY {
  Top = -1,
  Bottom = 1
}
export interface WorktableStateResizingItemEdges {
  x?: WorktableStateResizingItemEdgeX,
  y?: WorktableStateResizingItemEdgeY
}

export interface WorktableResizingItemState {
  workflowId: EntityId;
  itemId: EntityId;
  edges: WorktableStateResizingItemEdges;
  delta: {
    x?: number;
    y?: number;
  };
  minSize: {
    w: number;
    h: number;
  }
}

export interface WorktableState {
  resizingItem?: WorktableResizingItemState;
}

export interface ModalScreensDataState {
  about?: void; // no data - key is used for consistency
  appManager: AppManagerState;
  applicationSettings: ApplicationSettingsState;
  projectManager: ProjectManagerState;
  widgetSettings: WidgetSettingsState;
  workflowSettings: WorkflowSettingsState;
}

export type ModalScreenId = keyof ModalScreensDataState;
export type ModalScreenData<I extends ModalScreenId> = ModalScreensDataState[I];

export interface ModalScreensState {
  data: ModalScreensDataState;
  order: List<ModalScreenId>;
}

export interface CopiedEntitiesItem<T extends Entity, Y> extends Entity {
  entity: T;
  deps: Y;
}
export interface CopyEntitiesState<T extends Entity, Y> {
  entities: EntityCollection<CopiedEntitiesItem<T, Y>>;
  list: EntityIdList;
}

export type CopyWidgetsState = CopyEntitiesState<Widget, WidgetEntityDeps>;
export type CopyWorkflowsState = CopyEntitiesState<Workflow, WorkflowEntityDeps>;

export interface CopyState {
  widgets: CopyWidgetsState;
  workflows: CopyWorkflowsState;
}

export interface AppsState {
  appIds: EntityIdList;
}

export interface MemSaverState {
  activeWorkflows: MemSaverWorkflowList;
  workflowTimeouts: Record<EntityId, NodeJS.Timeout>;
}

export enum EditTogglePos {
  Hidden = 0,
  TopBar = 1,
  TabBarLeft = 2,
  TabBarRight = 3,
}

export interface UiState {
  editMode: boolean;
  menuBar: boolean;
  topBar: boolean;
  editTogglePos: EditTogglePos;
  appConfig: AppConfig;
  apps: AppsState;
  dragDrop: DragDropState;
  copy: CopyState;
  memSaver: MemSaverState;
  modalScreens: ModalScreensState;
  palette: PaletteState;
  projectSwitcher: ProjectSwitcherState;
  shelf: ShelfState;
  worktable: WorktableState;
}

export function createUiState(): UiState {
  return {
    dragDrop: {},
    editMode: false,
    menuBar: true,
    topBar: false,
    editTogglePos: EditTogglePos.TabBarRight,
    appConfig: {
      mainHotkey: 'CmdOrCtrl+Shift+F',
      memSaver: {
        activateWorkflowsOnProjectSwitch: true,
        workflowInactiveAfter: -1
      },
      uiTheme: defaultUiThemeId
    },
    apps: {
      appIds: []
    },
    copy: {
      widgets: {
        entities: {},
        list: []
      },
      workflows: {
        entities: {},
        list: []
      }
    },
    memSaver: {
      activeWorkflows: [],
      workflowTimeouts: {}
    },
    modalScreens: {
      data: {
        appManager: {
          appIds: null,
          apps: null,
          currentAppId: '',
          deleteAppIds: null
        },
        applicationSettings: {
          appConfig: null
        },
        projectManager: {
          currentProjectId: '',
          deleteProjectIds: null,
          projects: null,
          projectIds: null,
          duplicateProjectIds: null
        },
        widgetSettings: {
          widgetInEnv: null
        },
        workflowSettings: {
          workflow: null
        },
      },
      order: []
    },
    palette: {
      widgetTypeIds: ['commander', 'file-opener', 'link-opener', 'note', 'timer', 'to-do-list', 'web-query', 'webpage']
    },
    projectSwitcher: {
      currentProjectId: '',
      projectIds: [],
      pos: ProjectSwitcherPos.TabBarLeft,
    },
    shelf: {
      widgetList: []
    },
    worktable: {}
  }
}
