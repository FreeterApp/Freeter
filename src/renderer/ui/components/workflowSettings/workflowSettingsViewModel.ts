/*
 * Copyright: (c) 2024, Alex Kaul
 * GNU General Public License v3.0 or later (see COPYING or https://www.gnu.org/licenses/gpl-3.0.txt)
 */

import { CloseWorkflowSettingsUseCase } from '@/application/useCases/workflowSettings/closeWorkflowSettings';
import { SaveWorkflowSettingsUseCase } from '@/application/useCases/workflowSettings/saveWorkflowSettings';
import { UpdateWorkflowSettingsUseCase } from '@/application/useCases/workflowSettings/updateWorkflowSettings';
import { WorkflowSettings } from '@/base/workflow';
import { UseAppState } from '@/ui/hooks/appState';
import { useCallback } from 'react';

type Deps = {
  useAppState: UseAppState;
  saveWorkflowSettingsUseCase: SaveWorkflowSettingsUseCase;
  updateWorkflowSettingsUseCase: UpdateWorkflowSettingsUseCase;
  closeWorkflowSettingsUseCase: CloseWorkflowSettingsUseCase;
}

export function createWorkflowSettingsViewModelHook({
  useAppState,
  saveWorkflowSettingsUseCase,
  updateWorkflowSettingsUseCase,
  closeWorkflowSettingsUseCase,
}: Deps) {
  function useViewModel() {
    const {
      settings,
    } = useAppState(state => ({
      settings: state.ui.modalScreens.data.workflowSettings.workflow?.settings
    }))

    const updateSettings = useCallback((updSettings: WorkflowSettings) => {
      updateWorkflowSettingsUseCase(updSettings);
    }, [])

    const onOkClickHandler = useCallback(() => {
      saveWorkflowSettingsUseCase();
    }, []);

    const onCancelClickHandler = useCallback(() => {
      closeWorkflowSettingsUseCase();
    }, []);

    return {
      settings,
      updateSettings,
      onOkClickHandler,
      onCancelClickHandler,
    }
  }

  return useViewModel;
}

export type WorkflowSettingsViewModelHook = ReturnType<typeof createWorkflowSettingsViewModelHook>;
export type WorkflowSettingsViewModel = ReturnType<WorkflowSettingsViewModelHook>;
