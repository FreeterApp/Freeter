/*
 * Copyright: (c) 2024, Alex Kaul
 * GNU General Public License v3.0 or later (see COPYING or https://www.gnu.org/licenses/gpl-3.0.txt)
 */

import { DialogProvider } from '@/application/interfaces/dialogProvider';
import { createGetWidgetSettingsApiUseCase } from '@/application/useCases/widgetSettings/getWidgetSettingsApi';
import { AppState } from '@/base/state/app';
import { OpenDialogResult, OpenDirDialogConfig, OpenFileDialogConfig } from '@common/base/dialog';
import { fixtureWidgetA, fixtureWidgetEnvAreaShelf } from '@tests/base/fixtures/widget';
import { fixtureAppState } from '@tests/base/state/fixtures/appState';
import { fixtureWidgetSettings } from '@tests/base/state/fixtures/widgetSettings';
import { fixtureAppStore } from '@tests/data/fixtures/appStore';

async function setup(initState: AppState) {
  const [appStore] = await fixtureAppStore(initState);

  const dialogProvider: jest.MockedObject<DialogProvider> = {
    showMessageBox: jest.fn(),
    showOpenDirDialog: jest.fn(),
    showOpenFileDialog: jest.fn(),
    showSaveFileDialog: jest.fn(),
  }

  const getWidgetSettingsApiUseCase = createGetWidgetSettingsApiUseCase({
    appStore,
    dialogProvider
  });
  return {
    appStore,
    dialogProvider,
    getWidgetSettingsApiUseCase
  }
}

describe('getWidgetSettingsApiUseCase()', () => {
  describe('updateSettings', () => {
    it('should do nothing, if widgetInEnv is null', async () => {
      const newSettings = {
        newProp: 'NEW-VALUE'
      }
      const initState = fixtureAppState({
        ui: {
          widgetSettings: fixtureWidgetSettings({
            widgetInEnv: null
          })
        }
      })
      const {
        appStore,
        getWidgetSettingsApiUseCase
      } = await setup(initState)
      const expectState = appStore.get();
      const settingsApi = getWidgetSettingsApiUseCase();

      settingsApi.updateSettings(newSettings);

      expect(appStore.get()).toBe(expectState);
    })

    it('should update the settings state', async () => {
      const newSettings = {
        newProp: 'NEW-VALUE'
      }
      const widget = fixtureWidgetA()
      const initState = fixtureAppState({
        ui: {
          widgetSettings: fixtureWidgetSettings({
            widgetInEnv: {
              widget,
              env: fixtureWidgetEnvAreaShelf(),
            }
          })
        }
      })
      const expectState: typeof initState = {
        ...initState,
        ui: {
          ...initState.ui,
          widgetSettings: {
            ...initState.ui.widgetSettings,
            widgetInEnv: {
              ...initState.ui.widgetSettings.widgetInEnv!,
              widget: {
                ...widget,
                settings: {
                  ...widget.settings,
                  ...newSettings
                }
              }
            }
          }
        }
      }
      const {
        appStore,
        getWidgetSettingsApiUseCase
      } = await setup(initState)
      const settingsApi = getWidgetSettingsApiUseCase();

      settingsApi.updateSettings(newSettings);

      const newState = appStore.get();
      expect(newState).toEqual(expectState);
    })
  })

  it('should correctly setup the dialog module', async () => {
    const {
      getWidgetSettingsApiUseCase,
      dialogProvider
    } = await setup(fixtureAppState({}))

    const settingsApi = getWidgetSettingsApiUseCase();

    const ofCfg = { ofCfg: 'ofCfg' } as unknown as OpenFileDialogConfig;
    const ofRes = { ofRes: 'ofRes' } as unknown as OpenDialogResult;
    dialogProvider.showOpenFileDialog.mockResolvedValue(ofRes)
    expect(await settingsApi.dialog.showOpenFileDialog(ofCfg)).toBe(ofRes);
    expect(dialogProvider.showOpenFileDialog).toBeCalledTimes(1);
    expect(dialogProvider.showOpenFileDialog).toBeCalledWith(ofCfg);

    const odCfg = { odCfg: 'odCfg' } as unknown as OpenDirDialogConfig;
    const odRes = { odRes: 'odRes' } as unknown as OpenDialogResult;
    dialogProvider.showOpenDirDialog.mockResolvedValue(odRes)
    expect(await settingsApi.dialog.showOpenDirDialog(odCfg)).toBe(odRes);
    expect(dialogProvider.showOpenDirDialog).toBeCalledTimes(1);
    expect(dialogProvider.showOpenDirDialog).toBeCalledWith(odCfg);
  })
})
