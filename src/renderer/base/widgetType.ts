/*
 * Copyright: (c) 2024, Alex Kaul
 * GNU General Public License v3.0 or later (see COPYING or https://www.gnu.org/licenses/gpl-3.0.txt)
 */

import { Entity } from '@/base/entity';
import { SharedStateSliceName } from '@/base/state/shared';
import { WidgetSettings } from '@/base/widget';
import { WidgetApiModuleName } from '@/base/widgetApi';

export interface WidgetTypeComponent {
  /** Component type. Only 'react' supported now.
   *  TODO Add support for 'vanilla' if there will be need in vanilla components.*/
  readonly type: string;
}

export type CreateSettingsState<TSettings> = (curSettings: Partial<TSettings> & WidgetSettings) => TSettings;

export interface WidgetType<TSettings = WidgetSettings> extends Entity {
  readonly name: string;
  readonly icon: string;
  readonly minSize: {
    readonly w: number;
    readonly h: number;
  }
  readonly description: string;
  readonly maximizable?: boolean;
  readonly widgetComp: WidgetTypeComponent;
  readonly settingsEditorComp: WidgetTypeComponent;
  readonly createSettingsState: CreateSettingsState<TSettings>;
  readonly requiresApi?: WidgetApiModuleName[]; // specifies WidgetAPI modules it requires access to
  readonly requiresState?: SharedStateSliceName[];
}
