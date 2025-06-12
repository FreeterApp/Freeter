/*
 * Copyright: (c) 2024, Alex Kaul
 * GNU General Public License v3.0 or later (see COPYING or https://www.gnu.org/licenses/gpl-3.0.txt)
 */

import { EditTogglePos, ProjectSwitcherPos } from '@/base/state/ui';
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
      editTogglePos,
      prjSwitcherPos
    ] = useAppState(state => [
      state.ui.editMode,
      state.ui.projectSwitcher.currentProjectId,
      state.entities.projects,
      state.entities.workflows,
      state.ui.editTogglePos,
      state.ui.projectSwitcher.pos
    ])

    const currentWorkflow = workflows[projects[currentProjectId]?.currentWorkflowId || ''];
    const showPalette = editMode && !!currentWorkflow && (editTogglePos === EditTogglePos.TopBar || editTogglePos === EditTogglePos.Hidden);
    const showEditToggle = editTogglePos === EditTogglePos.TopBar;
    const showPrjSwitcher = prjSwitcherPos === ProjectSwitcherPos.TopBar;
    return {
      showPalette,
      showEditToggle,
      showPrjSwitcher
    }
  }

  return useViewModel;
}

export type TopBarViewModelHook = ReturnType<typeof createTopBarViewModelHook>;
export type TopBarViewModel = ReturnType<TopBarViewModelHook>;
