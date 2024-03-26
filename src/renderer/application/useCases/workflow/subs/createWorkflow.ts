/*
 * Copyright: (c) 2024, Alex Kaul
 * GNU General Public License v3.0 or later (see COPYING or https://www.gnu.org/licenses/gpl-3.0.txt)
 */

import { IdGenerator } from '@/application/interfaces/idGenerator';
import { Workflow, createWorkflow } from '@/base/workflow';

type Deps = {
  idGenerator: IdGenerator;
}
export function createCreateWorkflowSubCase({
  idGenerator,
}: Deps) {
  function subCase(name: string): Workflow {
    return createWorkflow(idGenerator(), name);
  }

  return subCase;
}

export type CreateWorkflowSubCase = ReturnType<typeof createCreateWorkflowSubCase>;
