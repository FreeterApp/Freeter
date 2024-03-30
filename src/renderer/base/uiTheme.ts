/*
 * Copyright: (c) 2024, Alex Kaul
 * GNU General Public License v3.0 or later (see COPYING or https://www.gnu.org/licenses/gpl-3.0.txt)
 */

const uiThemeIds = ['dark', 'light'] as const;

export type UiThemeId = typeof uiThemeIds[number];

export const defaultUiThemeId: UiThemeId = 'light';

export interface UiThemeData {
  name: string;
}

export const uiThemeDataById: Record<UiThemeId, UiThemeData> = {
  ['dark']: { name: 'Dark' },
  ['light']: { name: 'Light' }
}

export const uiThemes = uiThemeIds.map(id => ({ id, ...uiThemeDataById[id] }));

function isUiThemeId(id: string): id is UiThemeId {
  return !!(uiThemeDataById[id as UiThemeId]);
}

export function sanitizeUiThemeId(id: string): UiThemeId {
  if (isUiThemeId(id)) {
    return id;
  }
  return defaultUiThemeId;
}
