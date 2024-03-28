/*
 * Copyright: (c) 2024, Alex Kaul
 * GNU General Public License v3.0 or later (see COPYING or https://www.gnu.org/licenses/gpl-3.0.txt)
 */

import { render, screen, fireEvent, act } from '@testing-library/react';
import { createApplicationSettingsComponent, createApplicationSettingsViewModelHook} from '@/ui/components/applicationSettings'
import { createAppStateHook } from '@/ui/hooks/appState';
import { fixtureAppState } from '@tests/base/state/fixtures/appState';
import { fixtureAppStore } from '@tests/data/fixtures/appStore';
import { AppState } from '@/base/state/app';
import userEvent from '@testing-library/user-event';
import { createGetMainHotkeyOptionsUseCase } from '@/application/useCases/applicationSettings/getMainHotkeyOptions';
import { ProcessProvider } from '@/application/interfaces/processProvider';
import { fixtureProcessInfoLinux } from '@testscommon/base/fixtures/process';
import { ProcessInfo } from '@common/base/process';
import { fixtureAppConfig } from '@tests/base/fixtures/appConfig';
import { fixtureApplicationSettings } from '@tests/base/state/fixtures/applicationSettings';
import { fixtureModalScreens, fixtureModalScreensData } from '@tests/base/state/fixtures/modalScreens';

async function setup(
  appState: AppState,
  opts?: {
    processInfo?: ProcessInfo
  }
) {
  const [appStore, appStoreForUi] = await fixtureAppStore(appState);
  const useAppState = createAppStateHook(appStoreForUi);
  const processProviderMock: ProcessProvider = {
    getProcessInfo: () => opts?.processInfo || fixtureProcessInfoLinux()
  }

  const getMainHotkeyOptionsUseCase = createGetMainHotkeyOptionsUseCase({
    process: processProviderMock
  })
  const closeApplicationSettingsUseCase = jest.fn();
  const updateApplicationSettingsUseCase = jest.fn();
  const saveApplicationSettingsUseCase = jest.fn();

  const useApplicationSettingsViewModel = createApplicationSettingsViewModelHook({
    useAppState,
    getMainHotkeyOptionsUseCase,
    closeApplicationSettingsUseCase,
    updateApplicationSettingsUseCase,
    saveApplicationSettingsUseCase,
  })

  const ApplicationSettings = createApplicationSettingsComponent({
    useApplicationSettingsViewModel
  })
  const comp = render(
    <ApplicationSettings />
  );

  return {
    comp,
    appStore,
    getMainHotkeyOptionsUseCase,
    saveApplicationSettingsUseCase,
    closeApplicationSettingsUseCase,
    updateApplicationSettingsUseCase,
  }
}

describe('<ApplicationSettings />', () => {
  it('should not display the settings dialog, if the appConfig is null', async () => {
    await setup(fixtureAppState({
      ui: {
        appConfig: fixtureAppConfig(),
        modalScreens: fixtureModalScreens({
          data: fixtureModalScreensData({
            applicationSettings: fixtureApplicationSettings({
              appConfig: null
            })
          })
        })
      }
    }));

    expect(screen.queryByText('Application Settings')).not.toBeInTheDocument();
  })

  it('should display the settings dialog, if the appConfig is set', async () => {
    await setup(fixtureAppState({
      ui: {
        appConfig: fixtureAppConfig(),
        modalScreens: fixtureModalScreens({
          data: fixtureModalScreensData({
            applicationSettings: fixtureApplicationSettings({
              appConfig: fixtureAppConfig(),
            })
          })
        })
      }
    }));

    expect(screen.queryByText('Application Settings')).toBeInTheDocument();
  })

  it('should call a right usecase when clicking the close button', async () => {
    const {closeApplicationSettingsUseCase} = await setup(fixtureAppState({
      ui: {
        modalScreens: fixtureModalScreens({
          data: fixtureModalScreensData({
            applicationSettings: fixtureApplicationSettings({
              appConfig: fixtureAppConfig(),
            })
          })
        })
      }
    }));

    const elButton = screen.getByRole('button', {
      name: /cancel/i
    });

    expect(closeApplicationSettingsUseCase).toBeCalledTimes(0);

    fireEvent.click(elButton);

    expect(closeApplicationSettingsUseCase).toBeCalledTimes(1);
  })

  it('should call a right usecase with right params when clicking the save button', async () => {
    const {saveApplicationSettingsUseCase} = await setup(fixtureAppState({
      ui: {
        modalScreens: fixtureModalScreens({
          data: fixtureModalScreensData({
            applicationSettings: fixtureApplicationSettings({
              appConfig: fixtureAppConfig(),
            })
          })
        })
      }
    }));

    const elButton = screen.getByRole('button', {
      name: /ok/i
    });

    expect(saveApplicationSettingsUseCase).toBeCalledTimes(0);

    fireEvent.click(elButton);

    expect(saveApplicationSettingsUseCase).toBeCalledTimes(1);
  })

  describe('Settings Controls', () => {
    it('should fill inputs with right values', async () => {
      const appConfig = fixtureAppConfig({mainHotkey: '', uiTheme: 'light'});
      const {getMainHotkeyOptionsUseCase, appStore} = await setup(fixtureAppState({
        ui: {
          modalScreens: fixtureModalScreens({
            data: fixtureModalScreensData({
              applicationSettings: fixtureApplicationSettings({
                appConfig,
              })
            })
          })
        }
      }));
      const mainHotkeyOptions= getMainHotkeyOptionsUseCase()

      expect(screen.getByRole('combobox', { name: /^Hotkey Combination$/i })).toHaveValue(appConfig.mainHotkey);
      expect(screen.getByRole('combobox', { name: /^User Interface Theme$/i })).toHaveValue(appConfig.uiTheme);

      const appConfig2 = fixtureAppConfig({mainHotkey: mainHotkeyOptions[1].value, uiTheme: 'dark'});
      act(() => appStore.set(fixtureAppState({
        ui: {
          modalScreens: fixtureModalScreens({
            data: fixtureModalScreensData({
              applicationSettings: fixtureApplicationSettings({
                appConfig: appConfig2,
              })
            })
          })
        }
      })))

      expect(screen.getByRole('combobox', { name: /^Hotkey Combination$/i })).toHaveValue(appConfig2.mainHotkey);
      expect(screen.getByRole('combobox', { name: /^User Interface Theme$/i })).toHaveValue(appConfig2.uiTheme);
    })

    it('should call updateApplicationSettingsUseCase with right args when editing the hotkey', async () => {
      const curHotkey = '';
      const appConfig = fixtureAppConfig({ mainHotkey: curHotkey });
      const {updateApplicationSettingsUseCase, getMainHotkeyOptionsUseCase} = await setup(fixtureAppState({
        ui: {
          modalScreens: fixtureModalScreens({
            data: fixtureModalScreensData({
              applicationSettings: fixtureApplicationSettings({
                appConfig,
              })
            })
          })
        }
      }));
      const hotkeyOptions = getMainHotkeyOptionsUseCase();
      const select = screen.getByRole('combobox', { name: /^Hotkey Combination$/i })

      await userEvent.selectOptions(select, hotkeyOptions[1].caption);

      expect(updateApplicationSettingsUseCase).toBeCalledTimes(1);
      expect(updateApplicationSettingsUseCase).toBeCalledWith({
        ...appConfig,
        mainHotkey: hotkeyOptions[1].value
      })
    })
  })
})
