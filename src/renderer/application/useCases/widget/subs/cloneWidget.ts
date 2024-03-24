/*
 * Copyright: (c) 2024, Alex Kaul
 * GNU General Public License v3.0 or later (see COPYING or https://www.gnu.org/licenses/gpl-3.0.txt)
 */

import { DataStorageRenderer } from '@/application/interfaces/dataStorage';
import { IdGenerator } from '@/application/interfaces/idGenerator';
import { Widget } from '@/base/widget';
import { ObjectManager } from '@common/base/objectManager';

type Deps = {
  widgetDataStorageManager: ObjectManager<DataStorageRenderer>;
  idGenerator: IdGenerator;
}
export function createCloneWidgetSubCase({
  widgetDataStorageManager,
  idGenerator,
}: Deps) {
  async function subCase(widget: Widget): Promise<Widget> {
    const newWidget: Widget = {
      ...widget,
      id: idGenerator()
    }
    await widgetDataStorageManager.copyObjectData(widget.id, newWidget.id);
    return newWidget;
  }

  return subCase;
}

export type CloneWidgetSubCase = ReturnType<typeof createCloneWidgetSubCase>;
