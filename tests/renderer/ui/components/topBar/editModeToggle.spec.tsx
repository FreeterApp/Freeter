/*
 * Copyright: (c) 2024, Alex Kaul
 * GNU General Public License v3.0 or later (see COPYING or https://www.gnu.org/licenses/gpl-3.0.txt)
 */

import { render, screen } from '@testing-library/react';
import { createEditModeToggleViewModelHook, createEditModeToggleComponent } from '@/ui/components/topBar/editModeToggle'
import userEvent from '@testing-library/user-event';
import { createAppStateHook } from '@/ui/hooks/appState';
import { fixtureAppState } from '@tests/base/state/fixtures/appState';
import { fixtureAppStore } from '@tests/data/fixtures/appStore';
import { AppState } from '@/base/state/app';

async function setup(
  appState: AppState
) {
  const [appStore, appStoreForUi] = await fixtureAppStore(appState);
  const useAppState = createAppStateHook(appStoreForUi);
  const toggleEditModeUseCase = jest.fn();
  const useEditModeToggleViewModel = createEditModeToggleViewModelHook({
    useAppState,
    toggleEditModeUseCase,
  })
  const EditModeToggle = createEditModeToggleComponent({
    useEditModeToggleViewModel
  })
  const comp = render(
    <EditModeToggle/>
  );

  return {
    comp,
    appStore,
    toggleEditModeUseCase,
  }
}

describe('<EditModeToggle />', () => {
  it('should display a button', async () => {
    await setup(fixtureAppState({}));
    expect(screen.getByRole('button', {name: /edit mode/i})).toBeInTheDocument();
  });

  it('should be not pressed, when edit mode is off', async () => {
    await setup(fixtureAppState({
      ui: {
        editMode: false
      }
    }));
    expect(screen.getByRole('button', {name: /edit mode/i})).toHaveAttribute('aria-pressed', 'false');
  });

  it('should be pressed, when edit mode is on', async () => {
    await setup(fixtureAppState({
      ui: {
        editMode: true
      }
    }));
    expect(screen.getByRole('button', {name: /edit mode/i})).toHaveAttribute('aria-pressed', 'true');
  });

  it('should call a right usecase, on click', async () => {
    const {toggleEditModeUseCase} = await setup(fixtureAppState({}));

    await userEvent.click(screen.getByRole('button', {name: /edit mode/i}));

    expect(toggleEditModeUseCase).toBeCalledTimes(1);
  })
})
