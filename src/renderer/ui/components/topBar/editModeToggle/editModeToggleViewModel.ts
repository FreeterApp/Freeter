/*
 * Copyright: (c) 2024, Alex Kaul
 * GNU General Public License v3.0 or later (see COPYING or https://www.gnu.org/licenses/gpl-3.0.txt)
 */

import { ToggleEditModeUseCase } from '@/application/useCases/toggleEditMode';
import { UseAppState } from '@/ui/hooks/appState';
import { useCallback } from 'react';

type Deps = {
  useAppState: UseAppState;
  toggleEditModeUseCase: ToggleEditModeUseCase;
}

export function createEditModeToggleViewModelHook({
  toggleEditModeUseCase,
  useAppState,
}: Deps) {
  function useViewModel() {
    const editMode = useAppState.useWithStrictEq(state => state.ui.editMode);

    const onToggleClickHandler = useCallback(() => {
      toggleEditModeUseCase();
    }, []);

    return {
      editMode,
      onToggleClickHandler,
    }
  }

  return useViewModel;
}

export type EditModeToggleViewModelHook = ReturnType<typeof createEditModeToggleViewModelHook>;
export type EditModeToggleViewModel = ReturnType<EditModeToggleViewModelHook>;
