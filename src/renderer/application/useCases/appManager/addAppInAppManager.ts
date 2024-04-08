/*
 * Copyright: (c) 2024, Alex Kaul
 * GNU General Public License v3.0 or later (see COPYING or https://www.gnu.org/licenses/gpl-3.0.txt)
 */

import { IdGenerator } from '@/application/interfaces/idGenerator';
import { AppStore } from '@/application/interfaces/store';
import { createApp, generateAppName } from '@/base/app';
import { addOneToEntityCollection } from '@/base/entityCollection';
import { modalScreensStateActions } from '@/base/state/actions';
import { getAllAppNamesFromAppIdList } from '@/base/state/actions/usedNames';

type Deps = {
  appStore: AppStore;
  idGenerator: IdGenerator;
}
export function createAddAppInAppManagerUseCase({
  appStore,
  idGenerator
}: Deps) {
  const useCase = () => {
    const state = appStore.get();
    const { appIds, apps } = state.ui.modalScreens.data.appManager;
    if (apps !== null && appIds !== null) {
      const newItemId = idGenerator();
      const newApp = createApp(newItemId, generateAppName(getAllAppNamesFromAppIdList(apps, appIds)))

      appStore.set(modalScreensStateActions.updateModalScreen(state, 'appManager', {
        currentAppId: newItemId,
        apps: addOneToEntityCollection(apps, newApp),
        appIds: [...appIds, newItemId]
      }));

      return newItemId;
    }
    return undefined;
  }

  return useCase;
}

export type AddAppInAppManagerUseCase = ReturnType<typeof createAddAppInAppManagerUseCase>;
