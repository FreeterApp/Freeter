/*
 * Copyright: (c) 2024, Alex Kaul
 * GNU General Public License v3.0 or later (see COPYING or https://www.gnu.org/licenses/gpl-3.0.txt)
 */

import { AppStore } from '@/application/interfaces/store';
import { dragDropStateActions } from '@/base/state/actions';

type Deps = {
  appStore: AppStore;
}

export function createDragLeaveTargetUseCase({
  appStore
}: Deps) {
  const dragLeaveTargetUseCase = () => {
    appStore.set(dragDropStateActions.resetOver(appStore.get()))
  }

  return dragLeaveTargetUseCase;
}

export type DragLeaveTargetUseCase = ReturnType<typeof createDragLeaveTargetUseCase>;
