/*
 * Copyright: (c) 2024, Alex Kaul
 * GNU General Public License v3.0 or later (see COPYING or https://www.gnu.org/licenses/gpl-3.0.txt)
 */

import { moveItemInList, removeItemFromList } from '@/base/list';
import { AppState } from '@/base/state/app';
import { ModalScreenData, ModalScreenId } from '@/base/state/ui';

function updateModalScreen<I extends ModalScreenId>(state: AppState, screenId: I, screenData: Partial<ModalScreenData<I>>): AppState {
  return {
    ...state,
    ui: {
      ...state.ui,
      modalScreens: {
        ...state.ui.modalScreens,
        data: {
          ...state.ui.modalScreens.data,
          [screenId]: {
            ...state.ui.modalScreens.data[screenId],
            ...screenData
          }
        }
      }
    }
  }
}

function openModalScreen<I extends ModalScreenId>(state: AppState, screenId: I, screenData: ModalScreenData<I>): AppState {
  const { order } = state.ui.modalScreens;
  const idx = order.findIndex(id => id === screenId);
  const newOrder = (idx < 0 ? [...order, screenId] : moveItemInList(order, idx, undefined));
  return {
    ...state,
    ui: {
      ...state.ui,
      modalScreens: {
        ...state.ui.modalScreens,
        data: {
          ...state.ui.modalScreens.data,
          [screenId]: screenData
        },
        order: newOrder
      }
    }
  }
}

function closeModalScreen(state: AppState, screenId: ModalScreenId): AppState {
  const { data } = state.ui.modalScreens;
  const newData = { ...data };
  switch (screenId) {
    case 'applicationSettings': {
      newData.applicationSettings = { appConfig: null };
      break;
    }
    case 'projectManager': {
      newData.projectManager = { currentProjectId: '', deleteProjectIds: null, projectIds: null, projects: null };
      break;
    }
    case 'widgetSettings': {
      newData.widgetSettings = { widgetInEnv: null };
      break;
    }
    case 'workflowSettings': {
      newData.workflowSettings = { workflow: null };
      break;
    }
  }

  const { order } = state.ui.modalScreens;
  const idx = order.findIndex(id => id === screenId);
  const newOrder = (idx < 0 ? order : removeItemFromList(order, idx));
  return {
    ...state,
    ui: {
      ...state.ui,
      modalScreens: {
        ...state.ui.modalScreens,
        data: newData,
        order: newOrder
      }
    }
  }
}

export const modalScreensStateActions = {
  openModalScreen,
  updateModalScreen,
  closeModalScreen,
}
