/*
 * Copyright: (c) 2024, Alex Kaul
 * GNU General Public License v3.0 or later (see COPYING or https://www.gnu.org/licenses/gpl-3.0.txt)
 */

import { IdGenerator } from '@/application/interfaces/idGenerator';
import { AppStore } from '@/application/interfaces/store';
import { CloneWorkflowSubCase } from '@/application/useCases/workflow/cloneWorkflowSubCase';
import { EntityId } from '@/base/entity';
import { addManyToEntityCollection, addOneToEntityCollection, getOneFromEntityCollection, updateOneInEntityCollection } from '@/base/entityCollection';
import { findIdIndexOnList } from '@/base/entityList';
import { addWorkflowToAppState, deleteProjectsFromAppState, modalScreensStateActions } from '@/base/state/actions';

type Deps = {
  appStore: AppStore;
  cloneWorkflowSubCase: CloneWorkflowSubCase;
  idGenerator: IdGenerator;
}
export function createSaveChangesInProjectManagerUseCase({
  appStore,
  cloneWorkflowSubCase,
  idGenerator,
}: Deps) {
  const useCase = async () => {
    let state = appStore.get();
    const prevProjects = state.entities.projects;
    const { deleteProjectIds, projectIds, projects, duplicateProjectIds } = state.ui.modalScreens.data.projectManager;

    if (projects !== null && projectIds !== null && deleteProjectIds !== null && duplicateProjectIds !== null) {
      state = {
        ...state,
        entities: {
          ...state.entities,
          projects
        },
        ui: {
          ...state.ui,
          projectSwitcher: {
            ...state.ui.projectSwitcher,
            projectIds
          },
        }
      };
      state = modalScreensStateActions.closeModalScreen(state, 'projectManager');

      for (const prjId of projectIds) {
        // init a workflow for each newly added, non-duplicate project
        if (!getOneFromEntityCollection(prevProjects, prjId) && !duplicateProjectIds[prjId]) {
          state = addWorkflowToAppState(state, prjId, idGenerator())[0];
        }
      }

      const projectIdsToDel = Object.entries(deleteProjectIds).filter(item => item[1]).map(item => item[0]);
      if (projectIdsToDel.length > 0) {
        state = deleteProjectsFromAppState(state, projectIdsToDel);
      }

      const arrToIdFromId = Object.entries(duplicateProjectIds);
      if (arrToIdFromId.length > 0) {
        for (const [toPrjId, fromPrjId] of arrToIdFromId) {
          const { projects, workflows } = state.entities;
          const fromPrj = projects[fromPrjId];
          const toPrj = projects[toPrjId];
          if (fromPrj && toPrj) {
            const newWorkflowIds: EntityId[] = [];
            for (const wflId of fromPrj.workflowIds) {
              const wfl = workflows[wflId];
              if (wfl) {
                const [newWfl, newWgts] = await cloneWorkflowSubCase(wfl, state.entities);
                newWorkflowIds.push(newWfl.id);
                state = {
                  ...state,
                  entities: {
                    ...state.entities,
                    workflows: addOneToEntityCollection(state.entities.workflows, newWfl),
                    widgets: addManyToEntityCollection(state.entities.widgets, newWgts)
                  }
                }
              }
            }
            if (newWorkflowIds.length > 0) {
              state = {
                ...state,
                entities: {
                  ...state.entities,
                  projects: updateOneInEntityCollection(state.entities.projects, {
                    id: toPrjId,
                    changes: {
                      workflowIds: [...toPrj.workflowIds, ...newWorkflowIds],
                      currentWorkflowId: newWorkflowIds[0]
                    }
                  })
                }
              }
            }
          }
        }
      }

      if (findIdIndexOnList(state.ui.projectSwitcher.projectIds, state.ui.projectSwitcher.currentProjectId) < 0) {
        state = {
          ...state,
          ui: {
            ...state.ui,
            projectSwitcher: {
              ...state.ui.projectSwitcher,
              currentProjectId: state.ui.projectSwitcher.projectIds[0] || ''
            }
          }
        }
      }
      appStore.set(state);
    }
  }

  return useCase;
}

export type SaveChangesInProjectManagerUseCase = ReturnType<typeof createSaveChangesInProjectManagerUseCase>;
