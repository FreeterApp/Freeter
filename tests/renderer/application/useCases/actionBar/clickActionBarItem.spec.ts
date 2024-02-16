/*
 * Copyright: (c) 2024, Alex Kaul
 * GNU General Public License v3.0 or later (see COPYING or https://www.gnu.org/licenses/gpl-3.0.txt)
 */

import { clickActionBarItemUseCase } from '@/application/useCases/actionBar/clickActionBarItem';
import { fixtureActionBarItemA } from '@tests/base/fixtures/actionBar';

const actionId = 'ACTION-ID';

describe('clickActionBarItemUseCase()', () => {
  it('should do nothing, if the action id does not exist', async () => {
    const doActionFn = jest.fn();
    const actionBarItems = [
      fixtureActionBarItemA({ id: actionId, doAction: () => doActionFn() })
    ]

    clickActionBarItemUseCase(actionBarItems, 'NO-SUCH-ID');

    expect(doActionFn).not.toBeCalled();
  })

  it('should exec doAction, if both a widget id and an actionBarItem id exist', async () => {
    const doActionFn = jest.fn();
    const actionBarItems = [
      fixtureActionBarItemA({ id: actionId, doAction: () => doActionFn() })
    ]

    clickActionBarItemUseCase(actionBarItems, actionId);

    expect(doActionFn).toBeCalledTimes(1);
  })
})
