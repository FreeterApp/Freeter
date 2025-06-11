/*
 * Copyright: (c) 2024, Alex Kaul
 * GNU General Public License v3.0 or later (see COPYING or https://www.gnu.org/licenses/gpl-3.0.txt)
 */

import { ChangeEventHandler } from 'react';
import { SwitchProjectUseCase } from '@/application/useCases/projectSwitcher/switchProject';
import { UseAppState } from '@/ui/hooks/appState';

type Deps = {
  useAppState: UseAppState;
  switchProjectUseCase: SwitchProjectUseCase;
}

export function createProjectSwitcherViewModelHook({
  useAppState,
  switchProjectUseCase,
}: Deps) {
  function useViewModel() {
    const [_currentProjectId, projectIds] = useAppState(state => ([state.ui.projectSwitcher.currentProjectId, state.ui.projectSwitcher.projectIds]));
    const projects = useAppState.useEntityList(state => state.entities.projects, projectIds);
    const noProjects = projects.length === 0;
    const currentProjectId = projects.findIndex(item => item.id === _currentProjectId) > -1 ? _currentProjectId : '';

    const handleChange: ChangeEventHandler<HTMLSelectElement> = (event) => {
      switchProjectUseCase(event.target.value);
    }

    return {
      currentProjectId,
      projects,
      noProjects,
      handleChange,
    }
  }

  return useViewModel;
}

export type ProjectSwitcherViewModelHook = ReturnType<typeof createProjectSwitcherViewModelHook>;
export type ProjectSwitcherViewModel = ReturnType<ProjectSwitcherViewModelHook>;
