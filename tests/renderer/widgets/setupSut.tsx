/*
 * Copyright: (c) 2024, Alex Kaul
 * GNU General Public License v3.0 or later (see COPYING or https://www.gnu.org/licenses/gpl-3.0.txt)
 */

import { ReactComponent, SettingsEditorReactComponentProps, WidgetApi, WidgetReactComponentProps, WidgetEnv, EntityId, WidgetSettingsApi, WidgetSettings, SharedState} from '@/widgets/appModules';
import { render, fireEvent, act } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { fixtureProcessInfoLinux } from '@testscommon/base/fixtures/process';
import { useState } from 'react';

function setupSut<T>(
  compFactory: (settings: T, setVal: (newVal: T) => void, sharedState: SharedState) => JSX.Element,
  initSettings: T,
  sharedState?: Partial<SharedState>
) {
  let settings: T;
  const getSettings = () => settings;
  let setSettings: (newVal: T) => void;
  const emptySharedState: SharedState = {
    apps: {
      appIds: [],
      apps: {}
    }
  }

  function Sut() {
    const [val, setVal] = useState(initSettings)
    settings = val;
    setSettings= (newVal) => act(()=>setVal(newVal));
    return compFactory(settings, setVal, (sharedState || emptySharedState) as SharedState);
  }

  const comp = render(<Sut></Sut>);

  return {
    userEvent,
    fireEvent,
    getSettings,
    setSettings: setSettings!,
    comp
  }
}

export interface SetupSettingsSutOptional {
  mockSettingsApi?: {
    [P in keyof WidgetSettingsApi<WidgetSettings>]?: WidgetSettingsApi<WidgetSettings>[P] extends Record<string, unknown>
    ? Partial<WidgetSettingsApi<WidgetSettings>[P]>
    : WidgetSettingsApi<WidgetSettings>[P]
  }
  sharedState?: Partial<SharedState>
}

export function setupSettingsSut<T>(reactComp: ReactComponent<SettingsEditorReactComponentProps<T>>, initSettings: T, optional?: SetupSettingsSutOptional) {
  const mockSettingsApi = optional?.mockSettingsApi || {};
  const {Comp} = reactComp;
  return setupSut(
    (settings, setVal, sharedState) => (
      <Comp
        settings={settings}
        settingsApi={{
          updateSettings: setVal,
          dialog: {
            showOpenDirDialog: jest.fn(),
            showOpenFileDialog: jest.fn(),
            showAppManager: jest.fn(),
            ...mockSettingsApi.dialog
          }
        }}
        sharedState={sharedState}
      ></Comp>
    ),
    initSettings,
    optional?.sharedState
  );
}

export interface SetupWidgetSutOptional {
  widgetId?: EntityId;
  env?: WidgetEnv;
  mockWidgetApi?: {[P in keyof WidgetApi]?: WidgetApi[P] extends Record<string, unknown> ? Partial<WidgetApi[P]> : WidgetApi[P]}
  sharedState?: Partial<SharedState>;
}

export function setupWidgetSut<T>(reactComp: ReactComponent<WidgetReactComponentProps<T>>, initSettings: T, optional?: SetupWidgetSutOptional) {
  const env = optional?.env || {area: 'shelf'};
  const widgetId = optional?.widgetId || 'WIDGET-ID';
  const mockWidgetApi = optional?.mockWidgetApi || {};
  const {Comp} = reactComp;
  const widgetApi: WidgetApi = {
    updateActionBar: mockWidgetApi.updateActionBar || jest.fn(),
    setContextMenuFactory: mockWidgetApi.setContextMenuFactory || jest.fn(),
    clipboard: {
      writeBookmark: jest.fn(),
      writeText: jest.fn(),
      ...mockWidgetApi.clipboard
    },
    dataStorage: {
      clear: jest.fn(),
      getKeys: jest.fn(),
      getText: jest.fn(),
      remove: jest.fn(),
      setText: jest.fn(),
      getJson: jest.fn(),
      setJson: jest.fn(),
      ...mockWidgetApi.dataStorage
    },
    process: {
      getProcessInfo: jest.fn(()=>fixtureProcessInfoLinux({browser: {name: 'Chrome', ver: '1.2.3'}, os: {name: 'linux', ver: '5.6.7'}})),
      ...mockWidgetApi.process
    },
    shell: {
      openExternalUrl: jest.fn(),
      openPath: jest.fn(),
      ...mockWidgetApi.shell
    },
    terminal: {
      execCmdLines: jest.fn(),
      ...mockWidgetApi.terminal
    }
  };
  return {
    ...setupSut(
      (settings, _, sharedState) => (
        <Comp
          id={widgetId}
          env={env}
          settings={settings}
          widgetApi={widgetApi}
          sharedState={sharedState}
        ></Comp>
      ),
      initSettings,
      optional?.sharedState
    ),
    widgetApi
  }
}
