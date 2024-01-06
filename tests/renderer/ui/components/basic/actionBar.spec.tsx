/*
 * Copyright: (c) 2024, Alex Kaul
 * GNU General Public License v3.0 or later (see COPYING or https://www.gnu.org/licenses/gpl-3.0.txt)
 */

import { fireEvent, render, screen } from '@testing-library/react';
import { ActionBarItems } from '@/base/actionBar';
import { fixtureActionBarItemA, fixtureActionBarItemB, fixtureActionBarItemC, fixtureActionBarItemD } from '@tests/base/fixtures/actionBar';
import { createActionBarComponent, createActionBarViewModelHook } from '@/ui/components/basic/actionBar';

type SetupProps = {
  actionBarItems: ActionBarItems;
  mocks?: {
    clickActionBarItemUseCase?: jest.Mock;
  }
}
async function setup({
  actionBarItems,
}: SetupProps) {
  const clickActionBarItemUseCase = jest.fn();

  const useActionBarViewModel = createActionBarViewModelHook({
    clickActionBarItemUseCase
  })
  const ActionBar = createActionBarComponent({
    useActionBarViewModel
  })
  const comp = render(
    <ActionBar
      actionBarItems={actionBarItems}
    ></ActionBar>
  );

  return {
    comp,
    clickActionBarItemUseCase,
  }
}


describe('<ActionBar />', () => {
  it('should not display an action bar, when there are no action bar items', async () => {
    await setup({
      actionBarItems: []
    });

    expect(screen.queryByRole('toolbar')).not.toBeInTheDocument();
  })

  it('should display an action bar, when there are action bar items', async () => {
    await setup({
      actionBarItems: [fixtureActionBarItemA()]
    });

    expect(screen.getByRole('toolbar')).toBeInTheDocument();
  })

  it('should display 1 button, when there is 1 action bar item', async () => {
    await setup({
      actionBarItems: [fixtureActionBarItemA()]
    });

    expect(screen.queryAllByRole('button').length).toBe(1);
  })

  it('should display 4 buttons, when there are 4 action bar items', async () => {
    await setup({
      actionBarItems: [
        fixtureActionBarItemA(),
        fixtureActionBarItemB(),
        fixtureActionBarItemC(),
        fixtureActionBarItemD()
      ]
    });

    expect(screen.queryAllByRole('button').length).toBe(4);
  })


  it('should display titles of widget actions', async () => {
    const testTitle = 'TEST TITLE';
    await setup({
      actionBarItems: [fixtureActionBarItemA({title: testTitle})]
    });

    expect(screen.queryAllByRole('button', {name: testTitle}).length).toBe(1);
  })

  it('should not call clickActionBarItemUseCase when clicking a disabled ActionBarItem', async () => {
    const testTitle = 'TEST TITLE';
    const {clickActionBarItemUseCase} = await setup({
      actionBarItems: [fixtureActionBarItemA({title: testTitle, enabled: false})]
    });

    const elButton = screen.getByTitle(testTitle);
    fireEvent.click(elButton);

    expect(clickActionBarItemUseCase).not.toBeCalled();
  })

  it('should call clickActionBarItemUseCase usecase with right params when clicking an ActionBarItem', async () => {
    const testTitle = 'TEST TITLE';
    const actionId = 'ACTION-ID';
    const actionBarItems: ActionBarItems = [
      fixtureActionBarItemA(),
      fixtureActionBarItemB({title: testTitle, id: actionId})
    ]
    const {clickActionBarItemUseCase} = await setup({
      actionBarItems
    });

    const elButton = screen.getByTitle(testTitle);
    fireEvent.click(elButton);

    expect(clickActionBarItemUseCase).toBeCalledTimes(1);
    expect(clickActionBarItemUseCase).toBeCalledWith(actionBarItems, actionId);
  })
})
