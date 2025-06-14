/*
 * Copyright: (c) 2024, Alex Kaul
 * GNU General Public License v3.0 or later (see COPYING or https://www.gnu.org/licenses/gpl-3.0.txt)
 */

import { AppState } from '@/base/state/app';
import { EditTogglePos, ProjectSwitcherPos } from '@/base/state/ui';
import { StateInStore } from '@common/application/interfaces/store';
import { deepFreeze } from '@common/helpers/deepFreeze';
import { fixtureEntitiesState } from '@tests/base/state/fixtures/entitiesState';

const appState: AppState = {
  entities: fixtureEntitiesState(),
  ui: {
    dragDrop: {},
    editMode: false,
    menuBar: true,
    topBar: true,
    editTogglePos: EditTogglePos.TabBarRight,
    appConfig: {
      mainHotkey: '',
      memSaver: {
        activateWorkflowsOnProjectSwitch: true,
        workflowInactiveAfter: -1
      },
      uiTheme: 'light'
    },
    apps: {
      appIds: [],
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
        appManager: { appIds: null, apps: null, currentAppId: '', deleteAppIds: null },
        applicationSettings: { appConfig: null },
        projectManager: { currentProjectId: '', deleteProjectIds: null, projectIds: null, projects: null, duplicateProjectIds: null },
        widgetSettings: { widgetInEnv: null },
        workflowSettings: { workflow: null },
      },
      order: []
    },
    palette: {
      widgetTypeIds: []
    },
    projectSwitcher: {
      currentProjectId: '',
      projectIds: [],
      pos: ProjectSwitcherPos.TabBarLeft
    },
    shelf: {
      widgetList: []
    },
    worktable: {}
  }
};

interface AppStateTestData extends Pick<StateInStore<AppState>, 'isLoading'> {
  entities?: Partial<AppState['entities']>;
  ui?: Partial<AppState['ui']>;
}

export const fixtureAppState = (
  testData: AppStateTestData
) => deepFreeze({
  ...appState,
  ...testData,
  entities: {
    ...appState.entities,
    ...testData.entities
  },
  ui: {
    ...appState.ui,
    ...testData.ui
  }
});
