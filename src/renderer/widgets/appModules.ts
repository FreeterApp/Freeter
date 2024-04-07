/*
 * Copyright: (c) 2024, Alex Kaul
 * GNU General Public License v3.0 or later (see COPYING or https://www.gnu.org/licenses/gpl-3.0.txt)
 */

export type { OpenDialogResult } from '@common/base/dialog';
export type { WidgetApi, WidgetSettingsApi } from '@/base/widgetApi';
export type { WidgetType, CreateSettingsState } from '@/base/widgetType';
export type { WidgetMenuItem, WidgetMenuItemRole, WidgetMenuItems, WidgetContextMenuFactory, WidgetEnv, WidgetSettings } from '@/base/widget';
export type { ActionBarItem, ActionBarItems } from '@/base/actionBar';
export type { EntityId } from '@/base/entity';
export type { SharedState } from '@/base/state/shared';
export type {
  ReactComponent,
  SettingsEditorReactComponent,
  SettingsEditorReactComponentProps,
  WidgetReactComponent,
  WidgetReactComponentProps,
} from '@/ui/types/widgetType';
export type { ContextMenuEvent } from '@/ui/types/events';
export type { List } from '@/base/list';
export type { SettingActionsProps, SettingBlockProps, SettingRowProps } from '@/ui/components/basic/settingsScreen/setting';

export { browse14Svg, delete14Svg, manage14Svg } from '@/ui/assets/images/appIcons';

export { mapIdListToEntityList } from '@/base/entityList';
export { addItemToList, moveItemInList, removeItemFromList } from '@/base/list';
export { ActionBar } from '@/ui/components/basic/actionBar';
export { Button } from '@/ui/components/basic/button';
export { SettingActions, SettingBlock, SettingRow } from '@/ui/components/basic/settingsScreen/setting';
