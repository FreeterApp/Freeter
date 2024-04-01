/*
 * Copyright: (c) 2024, Alex Kaul
 * GNU General Public License v3.0 or later (see COPYING or https://www.gnu.org/licenses/gpl-3.0.txt)
 */

import { UseAppState } from '@/ui/hooks/appState';

type Deps = {
  useAppState: UseAppState;
}

export function createTopBarViewModelHook({
  useAppState,
}: Deps) {
  function useViewModel() {
    const [
      editMode,
      currentProjectId,
      projects,
      workflows,
    ] = useAppState(state => [
      state.ui.editMode,
      state.ui.projectSwitcher.currentProjectId,
      state.entities.projects,
      state.entities.workflows,
    ])

    const currentWorkflow = workflows[projects[currentProjectId]?.currentWorkflowId || ''];
    const showPalette = editMode && !!currentWorkflow;
    return {
      showPalette,
    }
  }

  return useViewModel;
}

export type TopBarViewModelHook = ReturnType<typeof createTopBarViewModelHook>;
export type TopBarViewModel = ReturnType<TopBarViewModelHook>;
