/*
 * Copyright: (c) 2024, Alex Kaul
 * GNU General Public License v3.0 or later (see COPYING or https://www.gnu.org/licenses/gpl-3.0.txt)
 */

import { EntityId } from '@/base/entity';
import { WidgetEnv } from '@/base/widget';
import { WidgetApi, WidgetSettingsApi } from '@/base/widgetApi';
import { WidgetSettings, WidgetTypeComponent } from '@/base/widgetType';
import { FC } from 'react';

/** React Component */

export interface ReactComponent<TProps> extends WidgetTypeComponent {
  readonly type: 'react';
  readonly Comp: FC<TProps>;
}
export interface WidgetReactComponentProps<TSettings = WidgetSettings> {
  id: EntityId;
  env: WidgetEnv;
  settings: TSettings;
  widgetApi: WidgetApi;
}
export type WidgetReactComponent<TSettings = WidgetSettings> = ReactComponent<WidgetReactComponentProps<TSettings>>;
export interface SettingsEditorReactComponentProps<TSettings = WidgetSettings> {
  settings: TSettings;
  settingsApi: WidgetSettingsApi<TSettings>;
}
export type SettingsEditorReactComponent<TSettings = WidgetSettings> = ReactComponent<SettingsEditorReactComponentProps<TSettings>>;
