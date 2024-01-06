/*
 * Copyright: (c) 2024, Alex Kaul
 * GNU General Public License v3.0 or later (see COPYING or https://www.gnu.org/licenses/gpl-3.0.txt)
 */

import { AppState } from '@/base/state/app';

function resetAll(state: AppState): AppState {
  if (
    state.ui.about ||
    state.ui.applicationSettings.appConfig ||
    state.ui.projectManager.projects ||
    state.ui.widgetSettings.widgetInEnv ||
    state.ui.workflowSettings.workflow
  ) {
    return {
      ...state,
      ui: {
        ...state.ui,
        about: false,
        applicationSettings: { appConfig: null },
        projectManager: { currentProjectId: '', deleteProjectIds: null, projectIds: null, projects: null },
        widgetSettings: { widgetInEnv: null },
        workflowSettings: { workflow: null }
      }
    }
  } else {
    return state;
  }
}

export const modalScreensStateActions = {
  resetAll,
}
