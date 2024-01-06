/*
 * Copyright: (c) 2024, Alex Kaul
 * GNU General Public License v3.0 or later (see COPYING or https://www.gnu.org/licenses/gpl-3.0.txt)
 */

import { createClickActionBarItemUseCase } from '@/application/useCases/actionBar/clickActionBarItem';
import { AppState } from '@/base/state/app';
import { fixtureActionBarItemA } from '@tests/base/fixtures/actionBar';
import { fixtureAppState } from '@tests/base/state/fixtures/appState';
import { fixtureAppStore } from '@tests/data/fixtures/appStore';

const actionId = 'ACTION-ID';

async function setup(initState: AppState) {
  const [appStore] = await fixtureAppStore(initState);
  const clickWidgetActionBarItemUseCase = createClickActionBarItemUseCase({
    appStore
  });
  return {
    appStore,
    clickWidgetActionBarItemUseCase
  }
}

describe('createClickActionBarItemUseCase()', () => {
  it('should do nothing, if the action id does not exist', async () => {
    const doActionFn = jest.fn();
    const actionBarItems = [
      fixtureActionBarItemA({ id: actionId, doAction: () => doActionFn() })
    ]
    const initState = fixtureAppState({})
    const {
      clickWidgetActionBarItemUseCase
    } = await setup(initState)

    clickWidgetActionBarItemUseCase(actionBarItems, 'NO-SUCH-ID');

    expect(doActionFn).not.toBeCalled();
  })

  it('should exec doAction, if both a widget id and an actionBarItem id exist', async () => {
    const doActionFn = jest.fn();
    const actionBarItems = [
      fixtureActionBarItemA({ id: actionId, doAction: () => doActionFn() })
    ]
    const initState = fixtureAppState({})
    const {
      clickWidgetActionBarItemUseCase
    } = await setup(initState)

    clickWidgetActionBarItemUseCase(actionBarItems, actionId);

    expect(doActionFn).toBeCalledTimes(1);
  })
})
