/*
 * Copyright: (c) 2024, Alex Kaul
 * GNU General Public License v3.0 or later (see COPYING or https://www.gnu.org/licenses/gpl-3.0.txt)
 */

import { AppState } from '@/base/state/app';
import { EntitiesState } from '@/base/state/entities';
import { UiState } from '@/base/state/ui';

export interface SharedState {
  readonly apps: {
    apps: EntitiesState['apps'];
    appIds: UiState['apps']['appIds'];
  };
}

export type SharedStateSliceName = keyof SharedState;

type SharedStateSliceFactory<N extends SharedStateSliceName> = (appState: AppState) => SharedState[N];
type SharedStateSliceFactories = {
  [N in SharedStateSliceName]: SharedStateSliceFactory<N>;
};

const sharedStateSliceFactories: SharedStateSliceFactories = {
  apps: appState => ({
    appIds: appState.ui.apps.appIds,
    apps: appState.entities.apps
  })
}

export function createSharedState(appState: AppState, availableSlices: SharedStateSliceName[]): SharedState {
  return Object.fromEntries(availableSlices.map(name => ([name, sharedStateSliceFactories[name](appState)]))) as unknown as SharedState
}
