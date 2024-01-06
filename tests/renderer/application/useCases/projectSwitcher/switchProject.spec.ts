/*
 * Copyright: (c) 2024, Alex Kaul
 * GNU General Public License v3.0 or later (see COPYING or https://www.gnu.org/licenses/gpl-3.0.txt)
 */

import { createSwitchProjectUseCase } from '@/application/useCases/projectSwitcher/switchProject';
import { AppState } from '@/base/state/app';
import { fixtureAppState } from '@tests/base/state/fixtures/appState';
import { fixtureProjectSwitcher } from '@tests/base/state/fixtures/projectSwitcher';
import { fixtureAppStore } from '@tests/data/fixtures/appStore';

async function setup(initState: AppState) {
  const [appStore] = await fixtureAppStore(initState);
  const switchProjectUseCase = createSwitchProjectUseCase({
    appStore
  });
  return {
    appStore,
    switchProjectUseCase
  }
}

describe('switchProjectUseCase()', () => {
  it('should update current project id state', async () => {
    const testId = 'TEST-ID';
    const initState = fixtureAppState({
      ui: {
        projectSwitcher: fixtureProjectSwitcher({
          currentProjectId: 'SOME-ID'
        })
      }
    })
    const expectState: AppState = {
      ...initState,
      ui: {
        ...initState.ui,
        projectSwitcher: {
          ...initState.ui.projectSwitcher,
          currentProjectId: testId
        }
      }
    }
    const {
      appStore,
      switchProjectUseCase
    } = await setup(initState)

    switchProjectUseCase(testId);

    const newState = appStore.get();
    expect(newState).toEqual(expectState);
  })
})
