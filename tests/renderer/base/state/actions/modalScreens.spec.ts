/*
 * Copyright: (c) 2024, Alex Kaul
 * GNU General Public License v3.0 or later (see COPYING or https://www.gnu.org/licenses/gpl-3.0.txt)
 */

import { List } from '@/base/list';
import { modalScreensStateActions } from '@/base/state/actions';
import { ModalScreenData, ModalScreenId } from '@/base/state/ui';
import { fixtureAppConfig } from '@tests/base/fixtures/appConfig';
import { fixtureWidgetB, fixtureWidgetEnvAreaShelf } from '@tests/base/fixtures/widget';
import { fixtureWorkflowB } from '@tests/base/fixtures/workflow';
import { fixtureAppState } from '@tests/base/state/fixtures/appState';
import { fixtureApplicationSettings } from '@tests/base/state/fixtures/applicationSettings';
import { fixtureModalScreens, fixtureModalScreensData } from '@tests/base/state/fixtures/modalScreens';
import { fixtureProjectManager } from '@tests/base/state/fixtures/projectManager';
import { fixtureWidgetSettings } from '@tests/base/state/fixtures/widgetSettings';
import { fixtureWorkflowSettings } from '@tests/base/state/fixtures/workflowSettings';

describe('updateModalScreen', () => {
  it.each<{ [I in ModalScreenId]: [I, ModalScreenData<I>, Partial<ModalScreenData<I>>] }[ModalScreenId]>([
    ['applicationSettings', fixtureApplicationSettings({ appConfig: fixtureAppConfig() }), { appConfig: fixtureAppConfig({ mainHotkey: 'newval' }) }],
    ['projectManager', fixtureProjectManager(), { currentProjectId: 'newval' }],
    ['widgetSettings', fixtureWidgetSettings(), { widgetInEnv: { env: fixtureWidgetEnvAreaShelf(), widget: fixtureWidgetB() } }],
    ['workflowSettings', fixtureWorkflowSettings(), { workflow: fixtureWorkflowB() }]
  ])(
    'should allow to update the "%s" modalScreen state with a specified value',
    (screenId, initScreenData, updData) => {
      const initState = fixtureAppState({
        ui: {
          modalScreens: fixtureModalScreens({
            data: fixtureModalScreensData({
              [screenId]: initScreenData,
            })
          })
        }
      });

      const stateAfterUpdate = modalScreensStateActions.updateModalScreen(initState, screenId, updData);

      expect(stateAfterUpdate).toEqual({
        ...initState,
        ui: {
          ...initState.ui,
          modalScreens: {
            ...initState.ui.modalScreens,
            data: {
              ...initState.ui.modalScreens.data,
              [screenId]: {
                ...initState.ui.modalScreens.data[screenId],
                ...updData
              }
            }
          }
        }
      });
    }
  )
})

describe('openModalScreen', () => {
  it.each<{ [I in ModalScreenId]: [I, ModalScreenData<I>] }[ModalScreenId]>([
    ['applicationSettings', fixtureApplicationSettings()],
    ['projectManager', fixtureProjectManager()],
    ['widgetSettings', fixtureWidgetSettings()],
    ['workflowSettings', fixtureWorkflowSettings()]
  ])(
    'should init the "%s" modalScreen state with a specified value',
    (screenId, initScreenData) => {
      const initState = fixtureAppState({
        ui: {
          modalScreens: fixtureModalScreens({
            data: fixtureModalScreensData({
              [screenId]: initScreenData,
            })
          })
        }
      });

      const stateAfterOpen = modalScreensStateActions.openModalScreen(initState, screenId, initScreenData);

      expect(stateAfterOpen.ui.modalScreens.data[screenId]).toBe(initScreenData);
    }
  )

  it.each<{ [I in ModalScreenId]: [I, ModalScreenData<I>, List<ModalScreenId>, List<ModalScreenId>] }[ModalScreenId]>([
    ['applicationSettings', fixtureApplicationSettings(), ['about', 'projectManager'], ['about', 'projectManager', 'applicationSettings']],
    ['projectManager', fixtureProjectManager(), ['about', 'widgetSettings'], ['about', 'widgetSettings', 'projectManager']],
    ['widgetSettings', fixtureWidgetSettings(), ['projectManager', 'workflowSettings'], ['projectManager', 'workflowSettings', 'widgetSettings']],
    ['workflowSettings', fixtureWorkflowSettings(), ['projectManager', 'widgetSettings'], ['projectManager', 'widgetSettings', 'workflowSettings']]
  ])(
    'should add the "%s" modalScreen to the end of the order state, if it is not on the list',
    (screenId, initScreenData, initOrder, expectOrder) => {
      const initState = fixtureAppState({
        ui: {
          modalScreens: fixtureModalScreens({
            data: fixtureModalScreensData({
              [screenId]: initScreenData,
            }),
            order: initOrder
          })
        }
      });

      const stateAfterOpen = modalScreensStateActions.openModalScreen(initState, screenId, initScreenData);

      expect(stateAfterOpen.ui.modalScreens.order).toEqual(expectOrder)
    }
  )

  it.each<{ [I in ModalScreenId]: [I, ModalScreenData<I>, List<ModalScreenId>, List<ModalScreenId>] }[ModalScreenId]>([
    ['applicationSettings', fixtureApplicationSettings(), ['applicationSettings', 'projectManager'], ['projectManager', 'applicationSettings']],
    ['projectManager', fixtureProjectManager(), ['projectManager', 'widgetSettings'], ['widgetSettings', 'projectManager']],
    ['widgetSettings', fixtureWidgetSettings(), ['widgetSettings', 'workflowSettings'], ['workflowSettings', 'widgetSettings']],
    ['workflowSettings', fixtureWorkflowSettings(), ['workflowSettings', 'widgetSettings'], ['widgetSettings', 'workflowSettings']]
  ])(
    'should move the "%s" modalScreen to the end of the order state, if it is already on the list',
    (screenId, initScreenData, initOrder, expectOrder) => {
      const initState = fixtureAppState({
        ui: {
          modalScreens: fixtureModalScreens({
            data: fixtureModalScreensData({
              [screenId]: initScreenData,
            }),
            order: initOrder
          })
        }
      });

      const stateAfterOpen = modalScreensStateActions.openModalScreen(initState, screenId, initScreenData);

      expect(stateAfterOpen.ui.modalScreens.order).toEqual(expectOrder)
    }
  )
})

describe('closeModalScreen', () => {
  it.each<{ [I in ModalScreenId]: [I, ModalScreenData<I>, ModalScreenData<I>] }[ModalScreenId]>([
    ['applicationSettings', fixtureApplicationSettings({ appConfig: fixtureAppConfig() }), fixtureApplicationSettings({ appConfig: null })],
    ['projectManager', fixtureProjectManager({ currentProjectId: 'someval', deleteProjectIds: {}, projectIds: [], projects: {} }), fixtureProjectManager({ currentProjectId: '', deleteProjectIds: null, projectIds: null, projects: null })],
    ['widgetSettings', fixtureWidgetSettings({ widgetInEnv: { env: fixtureWidgetEnvAreaShelf(), widget: fixtureWidgetB() } }), fixtureWidgetSettings({ widgetInEnv: null })],
    ['workflowSettings', fixtureWorkflowSettings({ workflow: fixtureWorkflowB() }), fixtureWorkflowSettings({ workflow: null })]
  ])(
    'should reset the "%s" modalScreen data',
    (screenId, initScreenData, expectScreenData) => {
      const initState = fixtureAppState({
        ui: {
          modalScreens: fixtureModalScreens({
            data: fixtureModalScreensData({
              [screenId]: initScreenData,
            }),
          })
        }
      });

      const stateAfterOpen = modalScreensStateActions.closeModalScreen(initState, screenId);

      expect(stateAfterOpen.ui.modalScreens.data[screenId]).toEqual(expectScreenData)
    }
  )

  it.each<{ [I in ModalScreenId]: [I, List<ModalScreenId>, List<ModalScreenId>] }[ModalScreenId]>([
    ['applicationSettings', ['about', 'applicationSettings'], ['about']],
    ['projectManager', ['projectManager', 'widgetSettings'], ['widgetSettings']],
    ['widgetSettings', ['projectManager', 'widgetSettings'], ['projectManager']],
    ['workflowSettings', ['workflowSettings'], []]
  ])(
    'should remove the "%s" modalScreen from the order state',
    (screenId, initOrder, expectOrder) => {
      const initState = fixtureAppState({
        ui: {
          modalScreens: fixtureModalScreens({
            order: initOrder
          })
        }
      });

      const stateAfterOpen = modalScreensStateActions.closeModalScreen(initState, screenId);

      expect(stateAfterOpen.ui.modalScreens.order).toEqual(expectOrder)
    }
  )
})
