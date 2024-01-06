/*
 * Copyright: (c) 2024, Alex Kaul
 * GNU General Public License v3.0 or later (see COPYING or https://www.gnu.org/licenses/gpl-3.0.txt)
 */

import { MigrateVersionedObject } from '@common/base/versionedObject';

export const currentWindowStateVersion = 1;

export interface WindowState {
  x: number;
  y: number;
  w: number;
  h: number;
  isMaxi: boolean;
  isMini: boolean;
  isFull: boolean;
}

export function prepareWindowState(windowState: WindowState): WindowState {
  return windowState;
}

export function createPersistentWindowState(windowState: WindowState): WindowState {
  return windowState;
}

export type PersistentWindowState = ReturnType<typeof createPersistentWindowState>;

export function mergeWindowStateWithPersistentWindowState(
  windowState: WindowState,
  persistentWindowState: PersistentWindowState
): WindowState {
  return {
    ...windowState,
    ...persistentWindowState
  }
}

export const migrateWindowState: MigrateVersionedObject<object, PersistentWindowState> = (data) => data as PersistentWindowState;
