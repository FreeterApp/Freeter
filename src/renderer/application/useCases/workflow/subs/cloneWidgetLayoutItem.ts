/*
 * Copyright: (c) 2024, Alex Kaul
 * GNU General Public License v3.0 or later (see COPYING or https://www.gnu.org/licenses/gpl-3.0.txt)
 */

import { IdGenerator } from '@/application/interfaces/idGenerator';
import { CloneWidgetSubCase } from '@/application/useCases/widget/subs/cloneWidget';
import { WorkflowEntityDeps } from '@/base/state/entities';
import { Widget } from '@/base/widget';
import { WidgetLayoutItem } from '@/base/widgetLayout';

type Deps = {
  idGenerator: IdGenerator;
  cloneWidgetSubCase: CloneWidgetSubCase;
}
export function createCloneWidgetLayoutItemSubCase({
  idGenerator,
  cloneWidgetSubCase,
}: Deps) {
  async function subCase(
    item: WidgetLayoutItem,
    deps: WorkflowEntityDeps
  ): Promise<[newLayoutItem: WidgetLayoutItem | null, newWidget: Widget | null]> {
    const wgt = deps.widgets[item.widgetId];
    if (!wgt) {
      return [null, null]
    }
    const newWgt = await cloneWidgetSubCase(wgt);

    const newItem: WidgetLayoutItem = {
      ...item,
      id: idGenerator(),
      widgetId: newWgt.id
    }
    return [newItem, newWgt];
  }

  return subCase;
}

export type CloneWidgetLayoutItemSubCase = ReturnType<typeof createCloneWidgetLayoutItemSubCase>;
