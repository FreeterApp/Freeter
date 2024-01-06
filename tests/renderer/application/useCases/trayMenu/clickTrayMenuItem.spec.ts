/*
 * Copyright: (c) 2024, Alex Kaul
 * GNU General Public License v3.0 or later (see COPYING or https://www.gnu.org/licenses/gpl-3.0.txt)
 */

import { createClickTrayMenuItemUseCase } from '@/application/useCases/trayMenu/clickTrayMenuItem';
import { fixtureMenuItemA } from '@testscommon/base/fixtures/menu';

function setup() {
  const useCase = createClickTrayMenuItemUseCase();
  return {
    useCase
  }
}

describe('clickTrayMenuItemUseCase()', () => {
  it('should call item\'s doAction()', async () => {
    const testDoAction = jest.fn();
    const testItem = fixtureMenuItemA({ doAction: () => testDoAction() })
    const { useCase } = setup()

    useCase(testItem);

    expect(testDoAction).toBeCalledTimes(1);
  });
})
