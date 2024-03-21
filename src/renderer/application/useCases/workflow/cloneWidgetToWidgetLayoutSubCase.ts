/*
 * Copyright: (c) 2024, Alex Kaul
 * GNU General Public License v3.0 or later (see COPYING or https://www.gnu.org/licenses/gpl-3.0.txt)
 */

import { CloneWidgetSubCase } from '@/application/useCases/widget/cloneWidgetSubCase';
import { AddItemToWidgetLayoutSubCase } from '@/application/useCases/workflow/addItemToWidgetLayoutSubCase';
import { generateCopyName } from '@/base/utils';
import { Widget, updateWidgetCoreSettings } from '@/base/widget';
import { WidgetLayout, WidgetLayoutItemWH, WidgetLayoutItemXY } from '@/base/widgetLayout';

type Deps = {
  cloneWidgetSubCase: CloneWidgetSubCase;
  addItemToWidgetLayoutSubCase: AddItemToWidgetLayoutSubCase;
}
export function createCloneWidgetToWidgetLayoutSubCase({
  cloneWidgetSubCase,
  addItemToWidgetLayoutSubCase,
}: Deps) {
  async function subCase(
    widget: Widget,
    layout: WidgetLayout,
    usedWidgetNames: string[],
    newLayoutItemWH: WidgetLayoutItemWH,
    newLayoutItemXY?: WidgetLayoutItemXY,
  ): Promise<[newWidget: Widget, newLayout: WidgetLayout]> {
    const widgetClone = await cloneWidgetSubCase(widget)
    const newWidget = updateWidgetCoreSettings(widgetClone, {
      name: generateCopyName(widget.coreSettings.name, usedWidgetNames)
    })

    const newLayout = addItemToWidgetLayoutSubCase(
      newWidget.id,
      layout,
      newLayoutItemWH,
      newLayoutItemXY
    )

    return [newWidget, newLayout];
  }

  return subCase;
}

export type CloneWidgetToWidgetLayoutSubCase = ReturnType<typeof createCloneWidgetToWidgetLayoutSubCase>;
