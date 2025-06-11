/*
 * Copyright: (c) 2024, Alex Kaul
 * GNU General Public License v3.0 or later (see COPYING or https://www.gnu.org/licenses/gpl-3.0.txt)
 */

import React, { memo } from 'react';
import * as styles from './topBar.module.scss';
import clsx from 'clsx';
import { TopBarViewModelHook } from '@/ui/components/topBar/topBarViewModel';
import { ProjectSwitcherProps } from '@/ui/components/projectSwitcher';

type Deps = {
  EditModeToggle: React.FC;
  ProjectSwitcher: React.FC<ProjectSwitcherProps>;
  ManageProjectsButton: React.FC;
  Palette: React.FC;
  Shelf: React.FC;
  useTopBarViewModel: TopBarViewModelHook;
}

export function createTopBarComponent({
  EditModeToggle,
  ProjectSwitcher,
  ManageProjectsButton,
  Palette,
  Shelf,
  useTopBarViewModel,
}: Deps) {
  function TopBar() {
    const {showPalette, showEditToggle, showPrjSwitcher} = useTopBarViewModel();
    return (
      <div className={styles['top-bar']}>
        {showPrjSwitcher &&
          <div className={styles['top-bar-section']}>
            <ProjectSwitcher className={styles['project-switcher']} />
            <ManageProjectsButton />
          </div>
        }
        {showPalette &&
          <div className={clsx(styles['top-bar-section'], styles['top-bar-palette-section'])}>
            <Palette />
          </div>
        }

        <div className={clsx(styles['top-bar-section'], styles['top-bar-shelf-section'])}>
          <Shelf />
        </div>

        {showEditToggle &&
          <div className={styles['top-bar-section']}>
            <EditModeToggle />
          </div>
        }
      </div>
    )
  }
  return memo(TopBar);
}
