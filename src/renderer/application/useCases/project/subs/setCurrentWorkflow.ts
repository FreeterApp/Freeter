/*
 * Copyright: (c) 2024, Alex Kaul
 * GNU General Public License v3.0 or later (see COPYING or https://www.gnu.org/licenses/gpl-3.0.txt)
 */

import { activateWorkflowSubCase } from '@/application/useCases/memSaver/subs/activateWorkflow';
import { EntityId } from '@/base/entity';
import { entityStateActions } from '@/base/state/actions';
import { AppState } from '@/base/state/app';

export function setCurrentWorkflowSubCase(
  appState: AppState,
  projectId: EntityId,
  newCurrentWorkflowId: EntityId,
  activate: boolean,
): AppState {
  const project = entityStateActions.projects.getOne(appState, projectId)
  if (project) {
    if (project.currentWorkflowId !== newCurrentWorkflowId) {
      appState = entityStateActions.projects.updateOne(appState, {
        id: projectId,
        changes: {
          currentWorkflowId: newCurrentWorkflowId
        }
      })
      if (activate) {
        appState = {
          ...appState,
          ui: {
            ...appState.ui,
            memSaver: activateWorkflowSubCase(newCurrentWorkflowId, appState.ui.memSaver)
          }
        }
      }
    }
  }

  return appState;
}
