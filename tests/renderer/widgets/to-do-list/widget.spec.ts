/*
 * Copyright: (c) 2024, Alex Kaul
 * GNU General Public License v3.0 or later (see COPYING or https://www.gnu.org/licenses/gpl-3.0.txt)
 */

import { Settings } from '@/widgets/to-do-list/settings';
import { widgetComp } from '@/widgets/to-do-list/widget'
import { act, screen, waitFor, within } from '@testing-library/react';
import { fixtureSettings } from '@tests/widgets/to-do-list/fixtures';
import { SetupWidgetSutOptional, setupWidgetSut } from '@tests/widgets/setupSut'
import { ToDoListState } from '@/widgets/to-do-list/state';

jest.useFakeTimers();

function setupToDoListWidgetSut(settings: Settings, optional?: SetupWidgetSutOptional) {
  return setupWidgetSut(widgetComp, settings, optional);
}


describe('To-Do List Widget', () => {
  it('should show the loading status and hide the list on start', async () => {
    setupToDoListWidgetSut(fixtureSettings({}));

    await waitFor(() => {
      expect(screen.getByText('Loading To-Do List...')).toBeInTheDocument();
      expect(screen.queryByRole('list')).not.toBeInTheDocument();
    })
  })

  it('should hide the loading status and show the list after loading data', async () => {
    setupToDoListWidgetSut(fixtureSettings({}));

    await waitFor(() => {
      expect(screen.getByText('Loading To-Do List...')).toBeInTheDocument();
      expect(screen.queryByRole('list')).not.toBeInTheDocument();
    })

    await waitFor(() => {
      expect(screen.queryByText('Loading To-Do List...')).not.toBeInTheDocument();
      expect(screen.getByRole('list')).toBeInTheDocument();
    })
  })

  it('should get the state stored in DataStorage on start', async () => {
    const testState: ToDoListState = {
      items: [
        { id: 1, isDone: false, text: 'Task 1' },
        { id: 2, isDone: true, text: 'Task 2' },
        { id: 3, isDone: false, text: 'Task 3' },
      ],
      nextItemId: 99
    };
    const getJson = jest.fn().mockResolvedValue(testState);
    setupToDoListWidgetSut(fixtureSettings({}), {
      mockWidgetApi: {
        dataStorage: {
          getJson
        }
      }
    });

    await waitFor(() => {
      expect(screen.getByRole('list')).toBeInTheDocument();
    })

    expect(getJson).toBeCalledWith('todo');
    expect(screen.getAllByRole('listitem')).toHaveLength(3);
  })

  it('should have an empty list when DataStorage does not have the state data', async () => {
    const getJson = jest.fn().mockResolvedValue(undefined);
    setupToDoListWidgetSut(fixtureSettings({}), {
      mockWidgetApi: {
        dataStorage: {
          getJson
        }
      }
    });

    await waitFor(() => {
      expect(screen.getByRole('list')).toBeInTheDocument();
    })

    expect(getJson).toBeCalledWith('todo');
    expect(screen.queryAllByRole('listitem')).toHaveLength(0);
  })

  it('should correctly render list items', async () => {
    const testState: ToDoListState = {
      items: [
        { id: 1, isDone: false, text: 'Task 1' },
        { id: 2, isDone: true, text: 'Task 2' },
        { id: 3, isDone: false, text: 'Task 3' },
      ],
      nextItemId: 99
    };
    const getJson = jest.fn().mockResolvedValue(testState);
    setupToDoListWidgetSut(fixtureSettings({}), {
      mockWidgetApi: {
        dataStorage: {
          getJson
        }
      }
    });

    await waitFor(() => {
      expect(screen.getByRole('list')).toBeInTheDocument();
    })

    const items = screen.getAllByRole('listitem');
    expect(items).toHaveLength(3);
    expect(within(items[0]).getByRole('checkbox', { name: 'Task 1' })).not.toBeChecked();
    expect(within(items[1]).getByRole('checkbox', { name: 'Task 2' })).toBeChecked();
    expect(within(items[2]).getByRole('checkbox', { name: 'Task 3' })).not.toBeChecked();
  })

  it('should move completed tasks to bottom, when doneToBottom=true', async () => {
    const testState: ToDoListState = {
      items: [
        { id: 1, isDone: false, text: 'Task 1' },
        { id: 2, isDone: true, text: 'Task 2' },
        { id: 3, isDone: false, text: 'Task 3' },
      ],
      nextItemId: 99
    };
    const getJson = jest.fn().mockResolvedValue(testState);
    const { userEvent } = setupToDoListWidgetSut(fixtureSettings({}), {
      mockWidgetApi: {
        dataStorage: {
          getJson
        }
      }
    });
    const user = userEvent.setup({ delay: null });

    await waitFor(() => {
      expect(screen.getByRole('list')).toBeInTheDocument();
    })

    const checkBox1 = screen.getByRole('checkbox', { name: 'Task 1' });
    await user.click(checkBox1);

    const checkBox3 = screen.getByRole('checkbox', { name: 'Task 3' });
    await user.click(checkBox3);

    const itemsAfterUpd = screen.getAllByRole('listitem');
    expect(within(itemsAfterUpd[0]).getByRole('checkbox', { name: 'Task 2' })).toBeChecked();
    expect(within(itemsAfterUpd[1]).getByRole('checkbox', { name: 'Task 1' })).toBeChecked();
    expect(within(itemsAfterUpd[2]).getByRole('checkbox', { name: 'Task 3' })).toBeChecked();
  })

  it('should update the state in DataStorage when there are changes, after a 3 sec delay', async () => {
    const testState: ToDoListState = {
      items: [
        { id: 1, isDone: false, text: 'Task 1' },
        { id: 2, isDone: true, text: 'Task 2' },
        { id: 3, isDone: false, text: 'Task 3' },
      ],
      nextItemId: 99
    };
    const getJson = jest.fn().mockResolvedValue(testState);
    const setJson = jest.fn();
    const { userEvent } = setupToDoListWidgetSut(fixtureSettings({ doneToBottom: false }), {
      mockWidgetApi: {
        dataStorage: {
          getJson,
          setJson
        }
      }
    });
    const user = userEvent.setup({ delay: null });

    await waitFor(() => {
      expect(screen.getByRole('list')).toBeInTheDocument();
    })

    const checkboxes = screen.getAllByRole('checkbox');

    await user.click(checkboxes[0]);

    act(() => jest.advanceTimersByTime(1000));
    expect(setJson).toBeCalledTimes(0);

    await user.click(checkboxes[1]);

    act(() => jest.advanceTimersByTime(2000));
    expect(setJson).toBeCalledTimes(0);

    await user.click(checkboxes[2]);

    act(() => jest.advanceTimersByTime(3000));
    expect(setJson).toBeCalledTimes(1);
    expect(setJson).toBeCalledWith('todo', {
      ...testState,
      items: [
        { ...testState.items[0], isDone: true },
        { ...testState.items[1], isDone: false },
        { ...testState.items[2], isDone: true },
      ]
    });
  })

  // TODO: more tests needed for the rest features
})

