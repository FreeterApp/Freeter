/*
 * Copyright: (c) 2024, Alex Kaul
 * GNU General Public License v3.0 or later (see COPYING or https://www.gnu.org/licenses/gpl-3.0.txt)
 */

import { CloseApplicationSettingsUseCase } from '@/application/useCases/applicationSettings/closeApplicationSettings';
import { GetMainHotkeyOptionsUseCase } from '@/application/useCases/applicationSettings/getMainHotkeyOptions';
import { SaveApplicationSettingsUseCase } from '@/application/useCases/applicationSettings/saveApplicationSettings';
import { UpdateApplicationSettingsUseCase } from '@/application/useCases/applicationSettings/updateApplicationSettings';
import { AppConfig } from '@/base/appConfig';
import { UseAppState } from '@/ui/hooks/appState';
import { useCallback } from 'react';

type Deps = {
  useAppState: UseAppState;
  getMainHotkeyOptionsUseCase: GetMainHotkeyOptionsUseCase;
  saveApplicationSettingsUseCase: SaveApplicationSettingsUseCase;
  updateApplicationSettingsUseCase: UpdateApplicationSettingsUseCase;
  closeApplicationSettingsUseCase: CloseApplicationSettingsUseCase;
}

export function createApplicationSettingsViewModelHook({
  useAppState,
  getMainHotkeyOptionsUseCase,
  saveApplicationSettingsUseCase,
  updateApplicationSettingsUseCase,
  closeApplicationSettingsUseCase,
}: Deps) {
  const hotkeyOptions = getMainHotkeyOptionsUseCase();

  function useViewModel() {
    const {
      appConfig,
    } = useAppState(state => ({
      appConfig: state.ui.modalScreens.data.applicationSettings.appConfig
    }))

    const updateSettings = useCallback((newAppConfig: AppConfig) => {
      updateApplicationSettingsUseCase(newAppConfig);
    }, [])

    const onOkClickHandler = useCallback(() => {
      saveApplicationSettingsUseCase();
    }, []);

    const onCancelClickHandler = useCallback(() => {
      closeApplicationSettingsUseCase();
    }, []);

    return {
      appConfig,
      hotkeyOptions,
      updateSettings,
      onOkClickHandler,
      onCancelClickHandler,
    }
  }

  return useViewModel;
}

export type ApplicationSettingsViewModelHook = ReturnType<typeof createApplicationSettingsViewModelHook>;
export type ApplicationSettingsViewModel = ReturnType<ApplicationSettingsViewModelHook>;
