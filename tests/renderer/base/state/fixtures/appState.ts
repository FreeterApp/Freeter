/*
 * Copyright: (c) 2024, Alex Kaul
 * GNU General Public License v3.0 or later (see COPYING or https://www.gnu.org/licenses/gpl-3.0.txt)
 */

import { AppState } from '@/base/state/app';
import { StateInStore } from '@common/application/interfaces/store';
import { deepFreeze } from '@common/helpers/deepFreeze';

const appState: AppState = {
  entities: {
    projects: {},
    widgets: {},
    widgetTypes: {},
    workflows: {}
  },
  ui: {
    about: false,
    dragDrop: {},
    editMode: false,
    menuBar: true,
    appConfig: {
      mainHotkey: ''
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
      projectIds: null,
      projects: null
    },
    projectSwitcher: {
      currentProjectId: '',
      projectIds: [],
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
