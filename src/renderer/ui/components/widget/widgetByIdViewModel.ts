/*
 * Copyright: (c) 2024, Alex Kaul
 * GNU General Public License v3.0 or later (see COPYING or https://www.gnu.org/licenses/gpl-3.0.txt)
 */

import { EntityId } from '@/base/entity';
import { entityStateActions } from '@/base/state/actions';
import { WidgetProps } from '@/ui/components/widget/widgetViewModel';
import { UseAppState } from '@/ui/hooks/appState';

type Deps = {
  useAppState: UseAppState;
}

export interface WidgetByIdProps extends Omit<WidgetProps, 'widget'> {
  id: EntityId;
}

export function createWidgetByIdViewModelHook({
  useAppState
}: Deps) {
  function useViewModel(props: WidgetByIdProps) {
    const { id, ...widgetProps } = props;
    const widget = useAppState.useWithStrictEq(state => entityStateActions.widgets.getOne(state, id));

    return {
      widget,
      widgetProps,
    }
  }

  return useViewModel;
}

export type WidgetByIdViewModelHook = ReturnType<typeof createWidgetByIdViewModelHook>;
export type WidgetByIdViewModel = ReturnType<WidgetByIdViewModelHook>;
