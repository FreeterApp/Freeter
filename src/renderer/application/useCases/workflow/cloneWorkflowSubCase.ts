/*
 * Copyright: (c) 2024, Alex Kaul
 * GNU General Public License v3.0 or later (see COPYING or https://www.gnu.org/licenses/gpl-3.0.txt)
 */

import { IdGenerator } from '@/application/interfaces/idGenerator';
import { CloneWidgetLayoutItemSubCase } from '@/application/useCases/widgetLayout/cloneWidgetLayoutItemSubCase';
import { WorkflowEntityDeps } from '@/base/state/entities';
import { Widget } from '@/base/widget';
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
    workflow: Workflow,
    deps: WorkflowEntityDeps
  ): Promise<[newWorkflow: Workflow, newWidgets: Widget[]]> {
    const newWidgets: Widget[] = [];
    const newWgtLayout: WidgetLayoutItem[] = [];
    for (const wgtLayoutItem of workflow.layout) {
      const [newLayoutItem, newWgt] = await cloneWidgetLayoutItemSubCase(wgtLayoutItem, deps);
      if (newLayoutItem !== null && newWgt !== null) {
        newWidgets.push(newWgt);
        newWgtLayout.push(newLayoutItem)
      }
    }
    const newWorkflow: Workflow = {
      ...workflow,
      id: idGenerator(),
      layout: newWgtLayout
    }

    return [newWorkflow, newWidgets];
  }

  return subCase;
}

export type CloneWorkflowSubCase = ReturnType<typeof createCloneWorkflowSubCase>;
