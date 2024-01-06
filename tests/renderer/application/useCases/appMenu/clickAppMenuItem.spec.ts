/*
 * Copyright: (c) 2024, Alex Kaul
 * GNU General Public License v3.0 or later (see COPYING or https://www.gnu.org/licenses/gpl-3.0.txt)
 */

import { createClickAppMenuItemUseCase } from '@/application/useCases/appMenu/clickAppMenuItem';
import { fixtureMenuItemA } from '@testscommon/base/fixtures/menu';

function setup() {
  const useCase = createClickAppMenuItemUseCase();
  return {
    useCase
  }
}

describe('clickAppMenuItemUseCase()', () => {
  it('should call item\'s doAction()', async () => {
    const testDoAction = jest.fn();
    const testItem = fixtureMenuItemA({ doAction: () => testDoAction() })
    const { useCase } = setup()

    useCase(testItem);

    expect(testDoAction).toBeCalledTimes(1);
  });
})
