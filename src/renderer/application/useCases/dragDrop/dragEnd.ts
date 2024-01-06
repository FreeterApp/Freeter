/*
 * Copyright: (c) 2024, Alex Kaul
 * GNU General Public License v3.0 or later (see COPYING or https://www.gnu.org/licenses/gpl-3.0.txt)
 */

import { AppStore } from '@/application/interfaces/store';
import { dragDropStateActions } from '@/base/state/actions';

type Deps = {
  appStore: AppStore;
}

export function createDragEndUseCase({
  appStore
}: Deps) {
  const dragEndUseCase = () => {
    appStore.set(dragDropStateActions.resetAll(appStore.get()));
  }

  return dragEndUseCase;
}

export type DragEndUseCase = ReturnType<typeof createDragEndUseCase>;
