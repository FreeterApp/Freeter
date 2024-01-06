/*
 * Copyright: (c) 2024, Alex Kaul
 * GNU General Public License v3.0 or later (see COPYING or https://www.gnu.org/licenses/gpl-3.0.txt)
 */

import { createRenameWorkflowUseCase } from '@/application/useCases/workflowSwitcher/renameWorkflow';
import { AppState } from '@/base/state/app';
import { fixtureWorkflowA } from '@tests/base/fixtures/workflow';
import { fixtureAppState } from '@tests/base/state/fixtures/appState';
import { fixtureWorkflowAInColl } from '@tests/base/state/fixtures/entitiesState';
import { fixtureAppStore } from '@tests/data/fixtures/appStore';

async function setup(initState: AppState) {
  const [appStore] = await fixtureAppStore(initState);
  const renameWorkflowUseCase = createRenameWorkflowUseCase({
    appStore
  });
  return {
    appStore,
    renameWorkflowUseCase
  }
}

describe('renameWorkflowUseCase()', () => {
  it('should do nothing, if the specified workflow does not exist', async () => {
    const initState = fixtureAppState({
      entities: {
        workflows: fixtureWorkflowAInColl()
      },
    })
    const {
      appStore,
      renameWorkflowUseCase
    } = await setup(initState)
    const expectState = appStore.get();

    renameWorkflowUseCase('NO-SUCH-ID', 'SOME NAME');

    expect(appStore.get()).toBe(expectState);
  })

  it('should update the name in the settings state', async () => {
    const newName = 'New Name';
    const workflow = fixtureWorkflowA()
    const initState = fixtureAppState({
      entities: {
        workflows: {
          [workflow.id]: workflow
        }
      }
    })
    const expectState: typeof initState = {
      ...initState,
      entities: {
        ...initState.entities,
        workflows: {
          ...initState.entities.workflows,
          [workflow.id]: {
            ...workflow,
            settings: {
              ...workflow.settings,
              name: newName
            }
          }
        }
      }
    }
    const {
      appStore,
      renameWorkflowUseCase
    } = await setup(initState)

    renameWorkflowUseCase(workflow.id, newName);

    const newState = appStore.get();
    expect(newState).toEqual(expectState);
  })
})
