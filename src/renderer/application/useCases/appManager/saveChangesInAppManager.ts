/*
 * Copyright: (c) 2024, Alex Kaul
 * GNU General Public License v3.0 or later (see COPYING or https://www.gnu.org/licenses/gpl-3.0.txt)
 */

import { AppStore } from '@/application/interfaces/store';
import { EntityId } from '@/base/entity';
import { removeManyFromEntityCollection } from '@/base/entityCollection';
import { EntityIdList, findIdIndexOnList, removeIdFromListAtIndex } from '@/base/entityList';
import { modalScreensStateActions } from '@/base/state/actions';

type Deps = {
  appStore: AppStore;
}
export function createSaveChangesInAppManagerUseCase({
  appStore,
}: Deps) {
  const useCase = async () => {
    let state = appStore.get();
    const { deleteAppIds, appIds, apps } = state.ui.modalScreens.data.appManager;

    if (apps !== null && appIds !== null && deleteAppIds !== null) {
      state = {
        ...state,
        entities: {
          ...state.entities,
          apps
        },
        ui: {
          ...state.ui,
          apps: {
            ...state.ui.apps,
            appIds
          },
        }
      };
      state = modalScreensStateActions.closeModalScreen(state, 'appManager');

      const appIdsToDel = Object.entries(deleteAppIds).filter(item => item[1]).map(item => item[0]);
      if (appIdsToDel.length > 0) {
        const delAppIds: EntityId[] = [];
        let newAppIdsList: EntityIdList = state.ui.apps.appIds;
        for (const appId of appIdsToDel) {
          const appIdx = findIdIndexOnList(newAppIdsList, appId);
          if (appIdx > -1) {
            delAppIds.push(appId);
            newAppIdsList = removeIdFromListAtIndex(newAppIdsList, appIdx);
          }
        }

        state = {
          ...state,
          ui: {
            ...state.ui,
            apps: {
              appIds: newAppIdsList
            }
          },
          entities: {
            ...state.entities,
            apps: removeManyFromEntityCollection(state.entities.apps, delAppIds),
          },
        };
      }

      appStore.set(state);
    }
  }

  return useCase;
}

export type SaveChangesInAppManagerUseCase = ReturnType<typeof createSaveChangesInAppManagerUseCase>;
