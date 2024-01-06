/*
 * Copyright: (c) 2024, Alex Kaul
 * GNU General Public License v3.0 or later (see COPYING or https://www.gnu.org/licenses/gpl-3.0.txt)
 */

import { MenuItem } from '@common/base/menu';
import { AppMenuProvider } from '@/application/interfaces/appMenuProvider';
import { ProcessProvider } from '@/application/interfaces/processProvider';
import { AppStore } from '@/application/interfaces/store';
import { ToggleEditModeUseCase } from '@/application/useCases/toggleEditMode';
import { ToggleMenuBarUseCase } from '@/application/useCases/toggleMenuBar';
import { OpenApplicationSettingsUseCase } from '@/application/useCases/applicationSettings/openApplicationSettings';
import { OpenAboutUseCase } from '@/application/useCases/about/openAbout';

type Deps = {
  appStore: AppStore;
  appMenu: AppMenuProvider;
  processProvider: ProcessProvider;
  toggleEditModeUseCase: ToggleEditModeUseCase;
  toggleMenuBarUseCase: ToggleMenuBarUseCase;
  openApplicationSettingsUseCase: OpenApplicationSettingsUseCase;
  openAboutUseCase: OpenAboutUseCase;
}


export function createInitAppMenuUseCase({
  appStore,
  appMenu,
  processProvider,
  toggleEditModeUseCase,
  toggleMenuBarUseCase,
  openApplicationSettingsUseCase,
  openAboutUseCase,
}: Deps) {
  const { isMac, isDevMode } = processProvider.getProcessInfo();

  const itemSeparator: MenuItem = {
    type: 'separator'
  }

  const itemSettings: MenuItem = {
    accelerator: 'CmdOrCtrl+,',
    doAction: async () => openApplicationSettingsUseCase(),
    label: 'Settings'
  };

  const itemAbout: MenuItem = {
    label: 'About Freeter',
    doAction: async () => openAboutUseCase()
  }

  const itemQuit: MenuItem = {
    role: 'quit'
  }

  const menuApp: MenuItem = {
    label: 'Freeter',
    submenu: [
      itemAbout,
      itemSeparator,
      itemSettings,
      itemSeparator,
      { role: 'hide' },
      { role: 'hideOthers' },
      { role: 'unhide' },
      itemSeparator,
      itemQuit
    ]
  }

  const menuFile: MenuItem = {
    label: '&File',
    submenu: [
      itemSettings,
      itemSeparator,
      itemQuit
    ]
  }

  const menuEdit: MenuItem = {
    label: '&Edit',
    submenu: [
      {
        role: 'undo'
      }, {
        role: 'redo'
      }, itemSeparator, {
        role: 'cut'
      }, {
        role: 'copy'
      }, {
        role: 'paste'
      }, {
        role: 'selectAll'
      }
    ]
  }

  const createMenuView: (editMode: boolean, menuBar: boolean) => MenuItem = (editMode, menuBar) => ({
    label: '&View',
    submenu: [
      { role: 'togglefullscreen' },
      ...(!isMac
        ? [{
          label: menuBar ? 'Hide Menu Bar (ALT to restore)' : 'Show Menu Bar',
          doAction: async () => toggleMenuBarUseCase()
        }]
        : []
      ),
      itemSeparator,
      {
        accelerator: 'CmdOrCtrl+E',
        label: `${editMode ? 'Disable' : 'Enable'} Edit Mode`,
        doAction: async () => toggleEditModeUseCase()
      }
    ]
  })

  const menuHelp: MenuItem = {
    label: '&Help',
    submenu: [
      ...(isMac
        ? []
        : [
          itemAbout
        ]
      )
    ]
  }
  const menuDev: MenuItem = {
    label: 'Dev',
    submenu: [
      { role: 'reload' },
      { role: 'forceReload' },
      itemSeparator,
      { role: 'toggleDevTools' }
    ]
  }


  const initAppMenuUseCase = () => {
    appStore.subscribe(state => ({
      isLoading: state.isLoading,
      menuBar: state.ui.menuBar,
    }), ({
      isLoading,
      menuBar,
    }) => {
      if (!isLoading) {
        appMenu.setAutoHide(!menuBar)
      }
    }, { fireImmediately: true });

    appStore.subscribe(state => ({
      isLoading: state.isLoading,
      editMode: state.ui.editMode,
      menuBar: state.ui.menuBar,
    }), ({
      isLoading,
      editMode,
      menuBar
    }) => {
      if (!isLoading) {
        appMenu.setMenu([
          (isMac ? menuApp : menuFile),
          menuEdit,
          createMenuView(editMode, menuBar),
          menuHelp,
          ...(isDevMode
            ? [menuDev]
            : []
          )
        ])
      }
    }, { fireImmediately: true });
  }

  return initAppMenuUseCase;
}

export type InitAppMenuUseCase = ReturnType<typeof createInitAppMenuUseCase>;
