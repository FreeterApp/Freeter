/*
 * Copyright: (c) 2024, Alex Kaul
 * GNU General Public License v3.0 or later (see COPYING or https://www.gnu.org/licenses/gpl-3.0.txt)
 */

import { Entity, EntityId } from '@/base/entity';
import { generateUniqueName } from '@/base/utils';

export interface AppSettings {
  readonly name: string;
  readonly execPath: string;
  readonly cmdArgs: string;
}
export interface App extends Entity {
  readonly settings: AppSettings;
}

export function createApp(id: EntityId, appName: string): App {
  return {
    id,
    settings: {
      name: appName,
      execPath: '',
      cmdArgs: '',
    }
  };
}

export function duplicateApp(app: App, newId: EntityId, newName: string): App {
  return {
    ...app,
    id: newId,
    settings: {
      ...app.settings,
      name: newName,
    }
  };
}

export function generateAppName(usedNames: string[]): string {
  return generateUniqueName('App', usedNames);
}

export function updateAppSettings(app: App, settings: AppSettings): App {
  return {
    ...app,
    settings
  }
}
