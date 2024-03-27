/*
 * Copyright: (c) 2024, Alex Kaul
 * GNU General Public License v3.0 or later (see COPYING or https://www.gnu.org/licenses/gpl-3.0.txt)
 */

import { CloseApplicationSettingsUseCase } from '@/application/useCases/applicationSettings/closeApplicationSettings';
import { GetUiThemeOptionsUseCase } from '@/application/useCases/applicationSettings/getUiThemeOptions';
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
  getUiThemeOptionsUseCase: GetUiThemeOptionsUseCase;
}

export function createApplicationSettingsViewModelHook({
  useAppState,
  getMainHotkeyOptionsUseCase,
  saveApplicationSettingsUseCase,
  updateApplicationSettingsUseCase,
  closeApplicationSettingsUseCase,
  getUiThemeOptionsUseCase,
}: Deps) {
  const hotkeyOptions = getMainHotkeyOptionsUseCase();
  const uiThemeOptions = getUiThemeOptionsUseCase();

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
      uiThemeOptions,
    }
  }

  return useViewModel;
}

export type ApplicationSettingsViewModelHook = ReturnType<typeof createApplicationSettingsViewModelHook>;
export type ApplicationSettingsViewModel = ReturnType<ApplicationSettingsViewModelHook>;
