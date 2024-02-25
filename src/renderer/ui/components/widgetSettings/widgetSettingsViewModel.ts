/*
 * Copyright: (c) 2024, Alex Kaul
 * GNU General Public License v3.0 or later (see COPYING or https://www.gnu.org/licenses/gpl-3.0.txt)
 */

import { CloseWidgetSettingsUseCase } from '@/application/useCases/widgetSettings/closeWidgetSettings';
import { GetWidgetSettingsApiUseCase } from '@/application/useCases/widgetSettings/getWidgetSettingsApi';
import { SaveWidgetSettingsUseCase } from '@/application/useCases/widgetSettings/saveWidgetSettings';
import { UpdateWidgetCoreSettingsUseCase } from '@/application/useCases/widgetSettings/updateWidgetCoreSettings';
import { WidgetCoreSettings } from '@/base/widget';
import { WidgetSettingsApi } from '@/base/widgetApi';
import { WidgetSettings } from '@/base/widgetType';
import { UseAppState } from '@/ui/hooks/appState';
import { useWidgetTypeComp } from '@/ui/hooks/useWidgetTypeComp';
import { useCallback, useMemo } from 'react';

type Deps = {
  useAppState: UseAppState;
  saveWidgetSettingsUseCase: SaveWidgetSettingsUseCase;
  getWidgetSettingsApiUseCase: GetWidgetSettingsApiUseCase;
  updateWidgetCoreSettingsUseCase: UpdateWidgetCoreSettingsUseCase;
  closeWidgetSettingsUseCase: CloseWidgetSettingsUseCase;
}

export function createWidgetSettingsViewModelHook({
  useAppState,
  saveWidgetSettingsUseCase,
  getWidgetSettingsApiUseCase,
  updateWidgetCoreSettingsUseCase,
  closeWidgetSettingsUseCase,
}: Deps) {
  function useViewModel() {
    const {
      widgetInEnv,
      widgetType
    } = useAppState(state => {
      const { widgetInEnv } = state.ui.modalScreens.data.widgetSettings;
      const widgetType = widgetInEnv ? state.entities.widgetTypes[widgetInEnv.widget.type] : undefined;
      return {
        widgetInEnv,
        widgetType,
      }
    })
    const SettingsEditorComp = useWidgetTypeComp(widgetType, 'settingsEditorComp');
    const settingsApi: WidgetSettingsApi<WidgetSettings> = useMemo(() => getWidgetSettingsApiUseCase(), [])

    const updateCoreSettings = useCallback((settings: WidgetCoreSettings) => {
      updateWidgetCoreSettingsUseCase(settings);
    }, [])

    const onOkClickHandler = useCallback(() => {
      saveWidgetSettingsUseCase();
    }, []);

    const onCancelClickHandler = useCallback(() => {
      closeWidgetSettingsUseCase();
    }, []);

    return {
      widgetInEnv,
      SettingsEditorComp,
      settingsApi,
      updateCoreSettings,
      onOkClickHandler,
      onCancelClickHandler,
    }
  }

  return useViewModel;
}

export type WidgetSettingsViewModelHook = ReturnType<typeof createWidgetSettingsViewModelHook>;
export type WidgetSettingsViewModel = ReturnType<WidgetSettingsViewModelHook>;
