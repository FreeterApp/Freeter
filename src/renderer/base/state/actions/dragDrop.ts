/*
 * Copyright: (c) 2024, Alex Kaul
 * GNU General Public License v3.0 or later (see COPYING or https://www.gnu.org/licenses/gpl-3.0.txt)
 */

import { AppState } from '@/base/state/app';

function resetAll(state: AppState): AppState {
  if (state.ui.dragDrop.from || state.ui.dragDrop.over) {
    return {
      ...state,
      ui: {
        ...state.ui,
        dragDrop: {}
      }
    }
  } else {
    return state;
  }
}

function resetOver(state: AppState): AppState {
  if (state.ui.dragDrop.over) {
    return {
      ...state,
      ui: {
        ...state.ui,
        dragDrop: {
          ...state.ui.dragDrop,
          over: undefined
        }
      }
    }
  } else {
    return state;
  }
}

export const dragDropStateActions = {
  resetAll,
  resetOver
}
