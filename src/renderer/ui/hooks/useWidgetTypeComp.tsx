/*
 * Copyright: (c) 2024, Alex Kaul
 * GNU General Public License v3.0 or later (see COPYING or https://www.gnu.org/licenses/gpl-3.0.txt)
 */

import { WidgetType } from '@/base/widgetType';
import { ReactComponent, SettingsEditorReactComponentProps, WidgetReactComponentProps } from '@/widgets/types';
import { FC, useMemo } from 'react';

export function useWidgetTypeComp(widgetType?: WidgetType, comp?: keyof Pick<WidgetType, 'settingsEditorComp'>): FC<SettingsEditorReactComponentProps>;
export function useWidgetTypeComp(widgetType?: WidgetType, comp?: keyof Pick<WidgetType, 'widgetComp'>): FC<WidgetReactComponentProps>;
export function useWidgetTypeComp(widgetType?: WidgetType, comp?: keyof Pick<WidgetType, 'settingsEditorComp' | 'widgetComp'>): FC<SettingsEditorReactComponentProps> | FC<WidgetReactComponentProps> | undefined {
  return useMemo(() => {
    if (widgetType && comp) {
      if (widgetType[comp].type === 'react') {
        return (widgetType[comp] as ReactComponent<unknown>).Comp
      } else {
        return undefined;
      }
    } else {
      return undefined;
    }
  }, [comp, widgetType])
}
