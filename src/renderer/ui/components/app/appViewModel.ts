/*
 * Copyright: (c) 2024, Alex Kaul
 * GNU General Public License v3.0 or later (see COPYING or https://www.gnu.org/licenses/gpl-3.0.txt)
 */

import { ShowContextMenuUseCase } from '@/application/useCases/contextMenu/showContextMenu';
import { contextMenuForTextInput } from '@/base/contextMenu';
import { ModalScreenId } from '@/base/state/ui';
import { sanitizeUiThemeId } from '@/base/uiTheme';
import { UseAppState } from '@/ui/hooks/appState';
import React, { ReactNode, createElement } from 'react';

type Deps = {
  useAppState: UseAppState;
  WidgetSettings: React.FC;
  WorkflowSettings: React.FC;
  AppManager: React.FC;
  ProjectManager: React.FC;
  ApplicationSettings: React.FC;
  About: React.FC;
  showContextMenuUseCase: ShowContextMenuUseCase;
}

export function createAppViewModelHook({
  useAppState,
  WidgetSettings,
  WorkflowSettings,
  ProjectManager,
  AppManager,
  ApplicationSettings,
  About,
  showContextMenuUseCase,
}: Deps) {
  function useViewModel() {
    const [
      editMode,
      projectIds,
      currentProjectId,
      projects,
      workflows,
      modalScreensOrder,
      uiTheme,
      hasTopBar
    ] = useAppState(state => [
      state.ui.editMode,
      state.ui.projectSwitcher.projectIds,
      state.ui.projectSwitcher.currentProjectId,
      state.entities.projects,
      state.entities.workflows,
      state.ui.modalScreens.order,
      state.ui.appConfig.uiTheme,
      state.ui.topBar
    ])

    const projectList = useAppState.useEntityList(state => state.entities.projects, projectIds);
    const hasProjects = projectList.length > 0;
    const currentWorkflow = workflows[projects[currentProjectId]?.currentWorkflowId || ''];
    const showPalette = editMode && !!currentWorkflow;

    const modalScreenComps: Record<ModalScreenId, ReactNode> = {
      about: createElement(About, {}),
      applicationSettings: createElement(ApplicationSettings, {}),
      appManager: createElement(AppManager, {}),
      projectManager: createElement(ProjectManager, {}),
      widgetSettings: createElement(WidgetSettings, {}),
      workflowSettings: createElement(WorkflowSettings, {})
    }

    const modalScreens = modalScreensOrder.map((id, idx, arr) => {
      if (modalScreenComps[id]) {
        return { id, comp: modalScreenComps[id], isLast: idx === arr.length - 1 };
      } else {
        return null
      }
    })
    const hasModalScreens = modalScreens.length > 0;

    const contextMenuHandler: React.MouseEventHandler<HTMLDivElement> = (e) => {
      const node = e.target as HTMLElement | null;

      switch (node?.nodeName.toLowerCase()) {
        case 'input':
        case 'textarea': {
          showContextMenuUseCase(contextMenuForTextInput);
          break;
        }
      }
    }

    const uiThemeId = sanitizeUiThemeId(uiTheme);
    return {
      showPalette,
      hasProjects,
      modalScreens,
      hasModalScreens,
      contextMenuHandler,
      uiThemeId,
      hasTopBar
    }
  }

  return useViewModel;
}

export type AppViewModelHook = ReturnType<typeof createAppViewModelHook>;
export type AppViewModel = ReturnType<AppViewModelHook>;
