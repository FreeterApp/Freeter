/*
 * Copyright: (c) 2024, Alex Kaul
 * GNU General Public License v3.0 or later (see COPYING or https://www.gnu.org/licenses/gpl-3.0.txt)
 */

// import styles from './app.module.scss';
import { AppViewModelHook } from './appViewModel';
import './globals.scss';
import React from 'react';
import styles from './app.module.scss';
import {SvgIcon} from '@/ui/components/basic/svgIcon';
import { manage24Svg } from '@/ui/assets/images/appIcons';
import { InAppNote } from '@/ui/components/basic/inAppNote';
import { UITheme } from '@/ui/components/app/uiTheme/uiTheme';

type Deps = {
  TopBar: React.FC;
  Palette: React.FC;
  WorkflowSwitcher: React.FC;
  Worktable: React.FC;
  useAppViewModel: AppViewModelHook;
}

export function createAppComponent({
  TopBar,
  Palette,
  WorkflowSwitcher,
  Worktable,
  useAppViewModel
}: Deps) {
  function App() {
    const {showPalette, modalScreens, hasModalScreens, hasProjects, contextMenuHandler, uiTheme} = useAppViewModel();
    return (
      <div onContextMenu={contextMenuHandler}>
        <UITheme themeId={uiTheme} />
        <div data-testid="main-screen" {...{ inert: hasModalScreens ? '' : undefined }}>
          <TopBar />
          {
            hasProjects
            ? <>
                <WorkflowSwitcher />
                <Worktable />
              </>
            : <InAppNote className={styles['no-projects']}>
                {'You don\'t have any projects. Use the Manage Projects '} <SvgIcon svg={manage24Svg} className={styles['manage-icon']} /> {' button at the Top Bar to create a first one.'}
              </InAppNote>
          }
          {showPalette && <Palette />}
        </div>
        {
          modalScreens.map(scr => (
            scr && <div key={scr.id} data-testid="modal-screen" {...{ inert: !scr.isLast ? '' : undefined }}>
              {scr.comp}
            </div>
          ))
        }
      </div>
    )
  }
  return App;
}
