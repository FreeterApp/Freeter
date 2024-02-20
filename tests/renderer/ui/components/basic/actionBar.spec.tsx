/*
 * Copyright: (c) 2024, Alex Kaul
 * GNU General Public License v3.0 or later (see COPYING or https://www.gnu.org/licenses/gpl-3.0.txt)
 */

import { render, screen } from '@testing-library/react';
import { ActionBarItems } from '@/base/actionBar';
import { fixtureActionBarItemA, fixtureActionBarItemB, fixtureActionBarItemC, fixtureActionBarItemD } from '@tests/base/fixtures/actionBar';
import { ActionBar } from '@/ui/components/basic/actionBar';
import userEvent from '@testing-library/user-event';

type SetupProps = {
  actionBarItems: ActionBarItems;
}
async function setup({
  actionBarItems,
}: SetupProps) {
  const comp = render(
    <ActionBar
      actionBarItems={actionBarItems}
    ></ActionBar>
  );

  return {
    comp,
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

  it('should not exec the doAction when clicking a disabled ActionBarItem', async () => {
    const testTitle = 'TEST TITLE';
    const action = jest.fn();
    await setup({
      actionBarItems: [fixtureActionBarItemA({title: testTitle, enabled: false, doAction: () => action()})]
    });

    const elButton = screen.getByTitle(testTitle);
    await userEvent.click(elButton);

    expect(action).not.toBeCalled();
  })

  it('should exec the doAction when clicking an ActionBarItem', async () => {
    const testTitle = 'TEST TITLE';
    const actionId = 'ACTION-ID';
    const action = jest.fn();
    const actionBarItems: ActionBarItems = [
      fixtureActionBarItemA(),
      fixtureActionBarItemB({title: testTitle, id: actionId, doAction: () => action()})
    ]
    await setup({
      actionBarItems
    });

    const elButton = screen.getByTitle(testTitle);
    await userEvent.click(elButton);

    expect(action).toBeCalledTimes(1);
  })
})
