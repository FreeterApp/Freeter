/*
 * Copyright: (c) 2024, Alex Kaul
 * GNU General Public License v3.0 or later (see COPYING or https://www.gnu.org/licenses/gpl-3.0.txt)
 */

import { ReactComponent, SettingsEditorReactComponentProps, WidgetApi, WidgetReactComponentProps, WidgetEnv, EntityId} from '@/widgets/types';
import { render, fireEvent, act } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { fixtureProcessInfoLinux } from '@testscommon/base/fixtures/process';
import React, { useState } from 'react';

function setupSut<T>(compFactory: (settings: T, setVal: (newVal: T) => void) => JSX.Element, initSettings: T) {
  let settings: T;
  const getSettings = () => settings;
  let setSettings: (newVal: T) => void;

  function Sut() {
    const [val, setVal] = useState(initSettings)
    settings = val;
    setSettings= (newVal) => act(()=>setVal(newVal));
    return compFactory(settings, setVal);
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
export function setupSettingsSut<T>(reactComp: ReactComponent<SettingsEditorReactComponentProps<T>>, initSettings: T) {
  const {Comp} = reactComp;
  return setupSut(
    (settings, setVal) => (
      <Comp
        settings={settings}
        settingsApi={{
          updateSettings: setVal
        }}
      ></Comp>
    ),
    initSettings
  );
}

export interface SetupWidgetSutOptional {
  widgetId?: EntityId;
  env?: WidgetEnv;
  mockWidgetApi?: {[P in keyof WidgetApi]?: WidgetApi[P] extends Record<string, unknown> ? Partial<WidgetApi[P]> : WidgetApi[P]}
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
      ...mockWidgetApi.dataStorage
    },
    process: {
      getProcessInfo: jest.fn(()=>fixtureProcessInfoLinux({browser: {name: 'Chrome', ver: '1.2.3'}, os: {name: 'linux', ver: '5.6.7'}})),
      ...mockWidgetApi.process
    },
    shell: {
      openExternalUrl: jest.fn(),
      ...mockWidgetApi.shell
    },
  };
  return {
    ...setupSut(
      (settings) => (
        <Comp
          id={widgetId}
          env={env}
          settings={settings}
          widgetApi={widgetApi}
        ></Comp>
      ),
      initSettings
    ),
    widgetApi
  }
}
