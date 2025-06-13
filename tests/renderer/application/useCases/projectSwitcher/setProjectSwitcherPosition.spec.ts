/*
 * Copyright: (c) 2024, Alex Kaul
 * GNU General Public License v3.0 or later (see COPYING or https://www.gnu.org/licenses/gpl-3.0.txt)
 */

import { createSetProjectSwitcherPositionUseCase } from '@/application/useCases/projectSwitcher/setProjectSwitcherPosition';
import { AppState } from '@/base/state/app';
import { ProjectSwitcherPos } from '@/base/state/ui';
import { fixtureAppState } from '@tests/base/state/fixtures/appState';
import { fixtureProjectSwitcher } from '@tests/base/state/fixtures/projectSwitcher';
import { fixtureAppStore } from '@tests/data/fixtures/appStore';

async function setup(initState: AppState) {
  const [appStore] = await fixtureAppStore(initState);
  const setProjectSwitcherPosition = createSetProjectSwitcherPositionUseCase({
    appStore
  });
  return {
    appStore,
    setProjectSwitcherPosition
  }
}

describe('setProjectSwitcherPositionUseCase()', () => {
  it('should set new pos state', async () => {
    const initState = fixtureAppState({
      ui: {
        projectSwitcher: fixtureProjectSwitcher({
          pos: ProjectSwitcherPos.TabBarLeft
        })
      }
    });
    const newPos = ProjectSwitcherPos.TopBar
    const expectState: AppState = {
      ...initState,
      ui: {
        ...initState.ui,
        projectSwitcher: {
          ...initState.ui.projectSwitcher,
          pos: newPos
        }
      }
    }
    const {
      appStore,
      setProjectSwitcherPosition
    } = await setup(initState)

    setProjectSwitcherPosition(newPos);

    expect(appStore.get()).toEqual(expectState);
  })
})
