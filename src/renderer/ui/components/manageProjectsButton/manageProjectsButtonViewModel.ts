/*
 * Copyright: (c) 2024, Alex Kaul
 * GNU General Public License v3.0 or later (see COPYING or https://www.gnu.org/licenses/gpl-3.0.txt)
 */

import { OpenProjectManagerUseCase } from '@/application/useCases/projectManager/openProjectManager';
import { useCallback } from 'react';

type Deps = {
  openProjectManagerUseCase: OpenProjectManagerUseCase;
}

export function createManageProjectsButtonViewModelHook({
  openProjectManagerUseCase,
}: Deps) {
  function useViewModel() {
    const onButtonClickHandler = useCallback(() => {
      openProjectManagerUseCase();
    }, []);

    return {
      onButtonClickHandler,
    }
  }

  return useViewModel;
}

export type ManageProjectsButtonViewModelHook = ReturnType<typeof createManageProjectsButtonViewModelHook>;
export type ManageProjectsButtonViewModel = ReturnType<ManageProjectsButtonViewModelHook>;
