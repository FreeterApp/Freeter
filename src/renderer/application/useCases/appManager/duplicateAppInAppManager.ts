/*
 * Copyright: (c) 2024, Alex Kaul
 * GNU General Public License v3.0 or later (see COPYING or https://www.gnu.org/licenses/gpl-3.0.txt)
 */

import { IdGenerator } from '@/application/interfaces/idGenerator';
import { AppStore } from '@/application/interfaces/store';
import { duplicateApp } from '@/base/app';
import { EntityId } from '@/base/entity';
import { addOneToEntityCollection, getOneFromEntityCollection } from '@/base/entityCollection';
import { modalScreensStateActions } from '@/base/state/actions';
import { getAllAppNamesFromAppIdList } from '@/base/state/actions/usedNames';
import { generateCopyName } from '@/base/utils';

type Deps = {
  appStore: AppStore;
  idGenerator: IdGenerator;
}

export function createDuplicateAppInAppManagerUseCase({
  appStore,
  idGenerator
}: Deps) {
  const useCase = (appId: EntityId) => {
    const state = appStore.get();
    const { appIds, apps } = state.ui.modalScreens.data.appManager;
    if (apps === null || appIds === null) {
      return;
    }

    const duplicateFrom = getOneFromEntityCollection(apps, appId);
    if (!duplicateFrom) {
      return;
    }

    const newItemId = idGenerator();
    const newApp = duplicateApp(duplicateFrom, newItemId, generateCopyName(duplicateFrom.settings.name, getAllAppNamesFromAppIdList(apps, appIds)))

    appStore.set(modalScreensStateActions.updateModalScreen(state, 'appManager', {
      currentAppId: newItemId,
      apps: addOneToEntityCollection(apps, newApp),
      appIds: [...appIds, newItemId],
    }));
  }

  return useCase;
}

export type DuplicateAppInAppManagerUseCase = ReturnType<typeof createDuplicateAppInAppManagerUseCase>;
