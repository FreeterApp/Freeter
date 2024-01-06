/*
 * Copyright: (c) 2024, Alex Kaul
 * GNU General Public License v3.0 or later (see COPYING or https://www.gnu.org/licenses/gpl-3.0.txt)
 */

import { render, screen } from '@testing-library/react';
import { createTopBarComponent } from '@/ui/components/topBar/topBar';

const strEditModeToggle = 'Edit Mode Toggle';
const strProjectSwitcher = 'Project Switcher';
const strManageProjectsButton = 'Manage Projects Button';
const strShelf = 'Shelf';
const mockEditModeToggle = () => <div>{strEditModeToggle}</div>;
const mockProjectSwitcher = () => <div>{strProjectSwitcher}</div>;
const mockManageProjectsButton = () => <div>{strManageProjectsButton}</div>
const mockShelf = () => <div>{strShelf}</div>;

function setup() {
  const TopBar = createTopBarComponent({
    EditModeToggle: mockEditModeToggle,
    ProjectSwitcher: mockProjectSwitcher,
    ManageProjectsButton: mockManageProjectsButton,
    Shelf: mockShelf,
  })
  const comp = render(
    <TopBar/>
  );

  return {
    comp
  }
}

describe('<TopBar />', () => {
  it('should display EditModeToggle', () => {
    setup();
    expect(screen.getByText(strEditModeToggle)).toBeInTheDocument();
  });
  it('should display ProjectSwitcher', () => {
    setup();
    expect(screen.getByText(strProjectSwitcher)).toBeInTheDocument();
  });
  it('should display ManageProjectsButton', () => {
    setup();
    expect(screen.getByText(strManageProjectsButton)).toBeInTheDocument();
  });
  it('should display Shelf', () => {
    setup();
    expect(screen.getByText(strShelf)).toBeInTheDocument();
  });
});
