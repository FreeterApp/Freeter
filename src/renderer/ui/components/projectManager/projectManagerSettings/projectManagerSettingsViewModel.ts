/*
 * Copyright: (c) 2024, Alex Kaul
 * GNU General Public License v3.0 or later (see COPYING or https://www.gnu.org/licenses/gpl-3.0.txt)
 */

import { memSaverConfigPrjActivateOnProjectSwitchOptions, memSaverConfigPrjInactiveAfterOptions } from '@/base/memSaver';
import { ProjectSettings } from '@/base/project';
import { useEffect, useRef } from 'react';
export interface ProjectManagerSettingsProps {
  projectAddedTrigger: boolean;
  settings: ProjectSettings | null;
  updateSettings: (updSettings: ProjectSettings) => void;
}

export function useProjectManagerSettingsViewModel(props: ProjectManagerSettingsProps) {
  const {
    projectAddedTrigger,
    settings,
    updateSettings
  } = props;

  const inactiveAfterOptions = memSaverConfigPrjInactiveAfterOptions;
  const activateOnProjectSwitchOptions = memSaverConfigPrjActivateOnProjectSwitchOptions;

  const isFirstRun = useRef(true);
  const refNameInput = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (isFirstRun.current) {
      isFirstRun.current = false;
      return;
    }
    if (refNameInput && refNameInput.current) {
      refNameInput.current.focus();
      refNameInput.current.select();
    }
  }, [projectAddedTrigger])

  return {
    refNameInput,
    settings,
    updateSettings,
    inactiveAfterOptions,
    activateOnProjectSwitchOptions
  };
}
