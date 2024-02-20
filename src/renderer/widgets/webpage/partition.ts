/*
 * Copyright: (c) 2024, Alex Kaul
 * GNU General Public License v3.0 or later (see COPYING or https://www.gnu.org/licenses/gpl-3.0.txt)
 */

import { EntityId, WidgetEnv } from '@/widgets/appModules';
import { SettingsSessionPersist, SettingsSessionScope } from '@/widgets/webpage/settings';

export function createPartition(sessionPersist: SettingsSessionPersist, sessionScope: SettingsSessionScope, env: WidgetEnv, widgetId: EntityId) {
  const p: string[] = [];
  if (sessionPersist === 'persist') {
    p.push('persist');
  }
  switch (env.area) {
    case 'shelf': {
      switch (sessionScope) {
        case 'app': {
          p.push('app');
          break;
        }
        case 'prj':
        case 'wfl': {
          p.push('shlf');
          break;
        }
        case 'wgt': {
          p.push('wgt');
          p.push(widgetId);
          break;
        }
      }
      break;
    }
    default: {
      p.push(sessionScope);
      switch (sessionScope) {
        case 'prj': {
          p.push(env.projectId);
          break;
        }
        case 'wfl': {
          p.push(env.workflowId);
          break;
        }
        case 'wgt': {
          p.push(widgetId);
          break;
        }
      }
      break;
    }
  }
  return p.join(':');
}
