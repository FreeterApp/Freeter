/*
 * Copyright: (c) 2024, Alex Kaul
 * GNU General Public License v3.0 or later (see COPYING or https://www.gnu.org/licenses/gpl-3.0.txt)
 */

import { DataStorageRenderer } from '@/application/interfaces/dataStorage';
import { IdGenerator } from '@/application/interfaces/idGenerator';
import { EntityId } from '@/base/entity';
import { addOneToEntityCollection } from '@/base/entityCollection';
import { EntitiesState } from '@/base/state/entities';
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
  const subCase: (widgetId: EntityId, entitiesState: EntitiesState) => Promise<[EntityId | null, EntitiesState]> = async (widgetId, entitiesState) => {
    const { widgets } = entitiesState;
    const widget = widgets[widgetId];
    if (!widget) {
      return [null, entitiesState];
    }

    const newWidget: Widget = {
      ...widget,
      id: idGenerator()
    }
    const newEntitiesState: EntitiesState = {
      ...entitiesState,
      widgets: addOneToEntityCollection(entitiesState.widgets, newWidget)
    }
    await widgetDataStorageManager.copyObjectData(widget.id, newWidget.id);
    return [newWidget.id, newEntitiesState];
  }

  return subCase;
}

export type CloneWidgetSubCase = ReturnType<typeof createCloneWidgetSubCase>;
