/*
 * Copyright: (c) 2024, Alex Kaul
 * GNU General Public License v3.0 or later (see COPYING or https://www.gnu.org/licenses/gpl-3.0.txt)
 */

import { createClickContextMenuItemUseCase } from '@/application/useCases/contextMenu/clickContextMenuItem';
import { fixtureMenuItemA } from '@testscommon/base/fixtures/menu';

function setup() {
  const useCase = createClickContextMenuItemUseCase();
  return {
    useCase
  }
}

describe('clickContextMenuItemUseCase()', () => {
  it('should call item\'s doAction()', async () => {
    const testDoAction = jest.fn();
    const testItem = fixtureMenuItemA({ doAction: () => testDoAction() })
    const { useCase } = setup()

    useCase(testItem);

    expect(testDoAction).toBeCalledTimes(1);
  });
})
