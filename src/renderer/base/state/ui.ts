/*
 * Copyright: (c) 2024, Alex Kaul
 * GNU General Public License v3.0 or later (see COPYING or https://www.gnu.org/licenses/gpl-3.0.txt)
 */

import { AppConfig } from '@/base/appConfig';
import { EntityId } from '@/base/entity';
import { EntityCollection } from '@/base/entityCollection';
import { EntityIdList } from '@/base/entityList';
import { Project } from '@/base/project';
import { WidgetInEnv } from '@/base/widget';
import { WidgetLayoutItemWH, WidgetLayoutItemXY } from '@/base/widgetLayout';
import { WidgetList } from '@/base/widgetList';
import { Workflow } from '@/base/workflow';

export interface DragDropFromPaletteState {
  widgetTypeId: EntityId;
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
}

export interface ProjectSwitcherState {
  projectIds: EntityIdList;
  currentProjectId: EntityId;
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

export interface UiState {
  editMode: boolean;
  menuBar: boolean;
  about: boolean;
  appConfig: AppConfig;
  applicationSettings: ApplicationSettingsState;
  dragDrop: DragDropState;
  palette: PaletteState;
  projectManager: ProjectManagerState;
  projectSwitcher: ProjectSwitcherState;
  shelf: ShelfState;
  widgetSettings: WidgetSettingsState;
  workflowSettings: WorkflowSettingsState;
  worktable: WorktableState;
}

export function createUiState(): UiState {
  return {
    dragDrop: {},
    editMode: false,
    menuBar: true,
    about: false,
    appConfig: {
      mainHotkey: 'CmdOrCtrl+Shift+F'
    },
    applicationSettings: {
      appConfig: null
    },
    palette: {
      widgetTypeIds: []
    },
    projectManager: {
      currentProjectId: '',
      deleteProjectIds: null,
      projects: null,
      projectIds: null
    },
    projectSwitcher: {
      currentProjectId: '',
      projectIds: []
    },
    shelf: {
      widgetList: []
    },
    widgetSettings: {
      widgetInEnv: null
    },
    workflowSettings: {
      workflow: null
    },
    worktable: {}
  }
}
