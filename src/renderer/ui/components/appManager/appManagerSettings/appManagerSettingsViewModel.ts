/*
 * Copyright: (c) 2024, Alex Kaul
 * GNU General Public License v3.0 or later (see COPYING or https://www.gnu.org/licenses/gpl-3.0.txt)
 */

import { ShowOpenFileDialogUseCase } from '@/application/useCases/dialog/showOpenFileDialog';
import { AppSettings } from '@/base/app';
import { useCallback, useEffect, useRef } from 'react';
export interface AppManagerSettingsProps {
  appAddedTrigger: boolean;
  settings: AppSettings | null;
  updateSettings: (updSettings: AppSettings) => void;
  showOpenFileDialogUseCase: ShowOpenFileDialogUseCase;
}

export function useAppManagerSettingsViewModel(props: AppManagerSettingsProps) {
  const {
    appAddedTrigger,
    settings,
    updateSettings,
    showOpenFileDialogUseCase
  } = props;

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
  }, [appAddedTrigger])

  const pickExecPath = useCallback(async (curPath: string) => {
    const { canceled, filePaths } = await showOpenFileDialogUseCase({ defaultPath: curPath, multiSelect: false })
    if (canceled) {
      return null;
    } else {
      return filePaths[0];
    }
  }, [showOpenFileDialogUseCase])

  return {
    refNameInput,
    settings,
    updateSettings,
    pickExecPath
  };
}
