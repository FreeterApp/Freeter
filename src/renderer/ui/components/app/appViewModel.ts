/*
 * Copyright: (c) 2024, Alex Kaul
 * GNU General Public License v3.0 or later (see COPYING or https://www.gnu.org/licenses/gpl-3.0.txt)
 */

import { ShowContextMenuForTextInputUseCase } from '@/application/useCases/contextMenu/showContextMenuForTextInput';
import { UseAppState } from '@/ui/hooks/appState';
import React from 'react';

type Deps = {
  useAppState: UseAppState;
  WidgetSettings: React.FC;
  WorkflowSettings: React.FC;
  ProjectManager: React.FC;
  ApplicationSettings: React.FC;
  About: React.FC;
  showContextMenuForTextInputUseCase: ShowContextMenuForTextInputUseCase;
}

export function createAppViewModelHook({
  useAppState,
  WidgetSettings,
  WorkflowSettings,
  ProjectManager,
  ApplicationSettings,
  About,
  showContextMenuForTextInputUseCase,
}: Deps) {
  function useViewModel() {
    const [
      editMode,
      projectIds,
      currentProjectId,
      projects,
      workflows
    ] = useAppState(state => [
      state.ui.editMode,
      state.ui.projectSwitcher.projectIds,
      state.ui.projectSwitcher.currentProjectId,
      state.entities.projects,
      state.entities.workflows
    ])

    const projectList = useAppState.useEntityList(state => state.entities.projects, projectIds);
    const hasProjects = projectList.length > 0;
    const currentWorkflow = workflows[projects[currentProjectId]?.currentWorkflowId || ''];
    const showPalette = editMode && !!currentWorkflow;

    const modalScreen = [WidgetSettings({}), WorkflowSettings({}), ProjectManager({}), ApplicationSettings({}), About({})].find(item => item);

    const contextMenuHandler: React.MouseEventHandler<HTMLDivElement> = (e) => {
      const node = e.target as HTMLElement | null;

      switch (node?.nodeName.toLowerCase()) {
        case 'input':
        case 'textarea': {
          showContextMenuForTextInputUseCase();
          break;
        }
      }
    }
    return {
      showPalette,
      hasProjects,
      modalScreen,
      contextMenuHandler
    }
  }

  return useViewModel;
}

export type AppViewModelHook = ReturnType<typeof createAppViewModelHook>;
export type AppViewModel = ReturnType<AppViewModelHook>;
