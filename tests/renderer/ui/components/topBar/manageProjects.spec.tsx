/*
 * Copyright: (c) 2024, Alex Kaul
 * GNU General Public License v3.0 or later (see COPYING or https://www.gnu.org/licenses/gpl-3.0.txt)
 */

import { render, screen } from '@testing-library/react';
import { createManageProjectsButtonViewModelHook, createManageProjectsButtonComponent } from '@/ui/components/topBar/ManageProjectsButton'
import userEvent from '@testing-library/user-event';

async function setup() {
  const openProjectManagerUseCase = jest.fn();
  const useManageProjectsButtonViewModel = createManageProjectsButtonViewModelHook({
    openProjectManagerUseCase,
  })
  const ManageProjectsButton = createManageProjectsButtonComponent({
    useManageProjectsButtonViewModel
  })
  const comp = render(
    <ManageProjectsButton/>
  );

  return {
    comp,
    openProjectManagerUseCase,
  }
}

describe('<ManageProjectsButton />', () => {
  it('should display a button', async () => {
    await setup();
    expect(screen.getByRole('button', {name: /manage projects/i})).toBeInTheDocument();
  });

  it('should call a right usecase, on click', async () => {
    const {openProjectManagerUseCase} = await setup();

    await userEvent.click(screen.getByRole('button', {name: /manage projects/i}));

    expect(openProjectManagerUseCase).toBeCalledTimes(1);
  })
})
