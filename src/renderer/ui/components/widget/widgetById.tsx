/*
 * Copyright: (c) 2024, Alex Kaul
 * GNU General Public License v3.0 or later (see COPYING or https://www.gnu.org/licenses/gpl-3.0.txt)
 */

import { WidgetComponent } from '@/ui/components/widget';
import { WidgetByIdProps, WidgetByIdViewModelHook } from '@/ui/components/widget/widgetByIdViewModel';

type Deps = {
  Widget: WidgetComponent;
  useWidgetByIdViewModel: WidgetByIdViewModelHook;
}

export function createWidgetByIdComponent({
  Widget,
  useWidgetByIdViewModel
}: Deps) {
  function Component(props: WidgetByIdProps) {

    const {
      widget,
      widgetProps
    } = useWidgetByIdViewModel(props);

    if (!widget) {
      return <div>Widget instance does not exist</div>
    }

    return <Widget widget={widget} {...widgetProps}></Widget>;
  }

  return Component;
}

export type WidgetByIdComponent = ReturnType<typeof createWidgetByIdComponent>;
