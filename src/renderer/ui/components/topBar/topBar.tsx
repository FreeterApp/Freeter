/*
 * Copyright: (c) 2024, Alex Kaul
 * GNU General Public License v3.0 or later (see COPYING or https://www.gnu.org/licenses/gpl-3.0.txt)
 */

import React, { memo } from 'react';
import styles from './topBar.module.scss';
import clsx from 'clsx';

type Deps = {
  EditModeToggle: React.FC;
  ProjectSwitcher: React.FC;
  ManageProjectsButton: React.FC;
  Shelf: React.FC;
}

export function createTopBarComponent({
  EditModeToggle,
  ProjectSwitcher,
  ManageProjectsButton,
  Shelf,
}: Deps) {
  function TopBar() {
    return (
      <div className={styles['top-bar']}>
        <div className={styles['top-bar-section']}>
          <EditModeToggle />
        </div>
        <div className={styles['top-bar-section']}>
          <ProjectSwitcher />
          <ManageProjectsButton />
        </div>
        <div className={clsx(styles['top-bar-section'], styles['top-bar-shelf-section'])}>
          <Shelf />
        </div>
      </div>
    )
  }
  return memo(TopBar);
}
