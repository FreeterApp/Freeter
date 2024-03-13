/*
 * Copyright: (c) 2024, Alex Kaul
 * GNU General Public License v3.0 or later (see COPYING or https://www.gnu.org/licenses/gpl-3.0.txt)
 */

import { IdGenerator } from '@/application/interfaces/idGenerator';
import { CloneWidgetLayoutItemSubCase } from '@/application/useCases/widgetLayout/cloneWidgetLayoutItemSubCase';
import { EntityId } from '@/base/entity';
import { addOneToEntityCollection } from '@/base/entityCollection';
import { EntitiesState } from '@/base/state/entities';
import { WidgetLayoutItem } from '@/base/widgetLayout';
import { Workflow } from '@/base/workflow';

type Deps = {
  cloneWidgetLayoutItemSubCase: CloneWidgetLayoutItemSubCase;
  idGenerator: IdGenerator;
}
export function createCloneWorkflowSubCase({
  cloneWidgetLayoutItemSubCase,
  idGenerator,
}: Deps) {
  async function subCase(
    workflowId: EntityId,
    entitiesState: EntitiesState
  ): Promise<[newWorkflowId: EntityId | null, newEntitiesState: EntitiesState]> {
    const { workflows } = entitiesState;
    const workflow = workflows[workflowId];
    if (!workflow) {
      return [null, entitiesState];
    }

    let newEntitiesState = entitiesState;
    const newWgtLayout: WidgetLayoutItem[] = [];
    for (const wgtLayoutItem of workflow.layout) {
      const [newWgtLayoutItem, newEntities] = await cloneWidgetLayoutItemSubCase(wgtLayoutItem, newEntitiesState);
      if (newWgtLayoutItem !== null) {
        newEntitiesState = newEntities;
        newWgtLayout.push(newWgtLayoutItem)
      }
    }
    const newWorkflow: Workflow = {
      ...workflow,
      id: idGenerator(),
      layout: newWgtLayout
    }
    newEntitiesState = {
      ...newEntitiesState,
      workflows: addOneToEntityCollection(newEntitiesState.workflows, newWorkflow)
    }

    return [newWorkflow.id, newEntitiesState];
  }

  return subCase;
}

export type CloneWorkflowSubCase = ReturnType<typeof createCloneWorkflowSubCase>;
