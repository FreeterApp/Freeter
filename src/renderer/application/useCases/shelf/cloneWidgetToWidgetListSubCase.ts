/*
 * Copyright: (c) 2024, Alex Kaul
 * GNU General Public License v3.0 or later (see COPYING or https://www.gnu.org/licenses/gpl-3.0.txt)
 */

import { AddItemToWidgetListSubCase } from '@/application/useCases/shelf/addItemToWidgetListSubCase';
import { CloneWidgetSubCase } from '@/application/useCases/widget/cloneWidgetSubCase';
import { EntityId } from '@/base/entity';
import { generateCopyName } from '@/base/utils';
import { Widget, updateWidgetCoreSettings } from '@/base/widget';
import { WidgetList } from '@/base/widgetList';

type Deps = {
  cloneWidgetSubCase: CloneWidgetSubCase;
  addItemToWidgetListSubCase: AddItemToWidgetListSubCase;
}
export function createCloneWidgetToWidgetListSubCase({
  addItemToWidgetListSubCase,
  cloneWidgetSubCase
}: Deps) {
  async function subCase(
    widget: Widget,
    list: WidgetList,
    usedWidgetNames: string[],
    atPosListItemId: EntityId | null
  ): Promise<[newWidget: Widget, newList: WidgetList]> {
    const widgetClone = await cloneWidgetSubCase(widget)
    const newWidget = updateWidgetCoreSettings(widgetClone, {
      name: generateCopyName(widget.coreSettings.name, usedWidgetNames)
    })

    const newList = addItemToWidgetListSubCase(
      newWidget.id,
      list,
      atPosListItemId,
    )

    return [newWidget, newList];
  }

  return subCase;
}

export type CloneWidgetToWidgetListSubCase = ReturnType<typeof createCloneWidgetToWidgetListSubCase>;
