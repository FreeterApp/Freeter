/*
 * Copyright: (c) 2024, Alex Kaul
 * GNU General Public License v3.0 or later (see COPYING or https://www.gnu.org/licenses/gpl-3.0.txt)
 */

import { render, screen, fireEvent } from '@testing-library/react';
import { createWidgetSettingsComponent, createWidgetSettingsViewModelHook} from '@/ui/components/widgetSettings'
import { fixtureWidgetA, fixtureWidgetCoreSettingsA, fixtureWidgetEnvAreaShelf } from '@tests/base/fixtures/widget';
import { WidgetComponent } from '@/ui/components/widget';
import { createAppStateHook } from '@/ui/hooks/appState';
import { fixtureAppState } from '@tests/base/state/fixtures/appState';
import { fixtureWidgetTypeAInColl, fixtureWidgetTypeBInColl } from '@tests/base/state/fixtures/entitiesState';
import { fixtureWidgetSettings } from '@tests/base/state/fixtures/widgetSettings';
import { fixtureAppStore } from '@tests/data/fixtures/appStore';
import { SettingsEditorReactComponent } from '@/widgets/types';
import { AppState } from '@/base/state/app';
import userEvent from '@testing-library/user-event';

const widgetId = 'WIDGET-ID';
const widgetTypeId = 'WIDGET-TYPE-ID';
const testId = 'TEST-ID';


async function setup(
  appState: AppState,
  mocks?: {
    getWidgetSettingsApiUseCase?: jest.Mock;
  }
) {
  const [appStore, appStoreForUi] = await fixtureAppStore(appState);
  const useAppState = createAppStateHook(appStoreForUi);

  const closeWidgetSettingsUseCase = jest.fn();
  const getWidgetSettingsApiUseCase = mocks?.getWidgetSettingsApiUseCase || jest.fn();
  const updateWidgetCoreSettingsUseCase = jest.fn();
  const saveWidgetSettingsUseCase = jest.fn();

  const useWidgetSettingsViewModel = createWidgetSettingsViewModelHook({
    useAppState,
    closeWidgetSettingsUseCase,
    getWidgetSettingsApiUseCase,
    updateWidgetCoreSettingsUseCase,
    saveWidgetSettingsUseCase,
  })

  const Widget: WidgetComponent = (props) => <div>{`WIDGET-PREVIEW-${props.widget.settings.prop}`}</div>
  const WidgetSettings = createWidgetSettingsComponent({
    Widget,
    useWidgetSettingsViewModel
  })
  const comp = render(
    <WidgetSettings />
  );

  return {
    comp,
    appStore,
    saveWidgetSettingsUseCase,
    closeWidgetSettingsUseCase,
    getWidgetSettingsApiUseCase,
    updateWidgetCoreSettingsUseCase,
  }
}

describe('<WidgetSettings />', () => {
  it('should not display the settings dialog, if the widget is null', async () => {
    await setup(fixtureAppState({
      entities: {
        widgetTypes: {
          ...fixtureWidgetTypeAInColl(),
          ...fixtureWidgetTypeBInColl()
        }
      },
      ui: {
        widgetSettings: fixtureWidgetSettings({
          widgetInEnv: null
        })
      }
    }));

    expect(screen.queryByText('Widget Settings')).not.toBeInTheDocument();
  })

  it('should not display the settings dialog, if the widget type does not exist', async () => {
    await setup(fixtureAppState({
      entities: {
        widgetTypes: {
          ...fixtureWidgetTypeAInColl(),
          ...fixtureWidgetTypeBInColl()
        }
      },
      ui: {
        widgetSettings: fixtureWidgetSettings({
          widgetInEnv: {
            widget: fixtureWidgetA({type: 'NO-SUCH-TYPE'}),
            env: fixtureWidgetEnvAreaShelf()
          }
        })
      }
    }));

    expect(screen.queryByText('Widget Settings')).not.toBeInTheDocument();
  })

  it('should display the settings dialog, if the widget and its type exist', async () => {
    await setup(fixtureAppState({
      entities: {
        widgetTypes: {
          ...fixtureWidgetTypeAInColl({
            id: widgetTypeId,
          }),
          ...fixtureWidgetTypeBInColl()
        }
      },
      ui: {
        widgetSettings: fixtureWidgetSettings({
          widgetInEnv: {
            widget: fixtureWidgetA({id: widgetId, type: widgetTypeId}),
            env: fixtureWidgetEnvAreaShelf()
          }
        })
      }
    }));

    expect(screen.queryByText('Widget Settings')).toBeInTheDocument();
  })

  it('should display widget core settings', async () => {
    const coreSetVal = 'Some Core Setting Value';
    await setup(fixtureAppState({
      entities: {
        widgetTypes: {
          ...fixtureWidgetTypeAInColl({
            id: widgetTypeId,
          }),
          ...fixtureWidgetTypeBInColl()
        }
      },
      ui: {
        widgetSettings: fixtureWidgetSettings({
          widgetInEnv: {
            widget: fixtureWidgetA({id: widgetId, type: widgetTypeId, coreSettings: fixtureWidgetCoreSettingsA({name: coreSetVal})}),
            env: fixtureWidgetEnvAreaShelf()
          }
        })
      }
    }));

    expect(screen.getByDisplayValue(coreSetVal)).toBeInTheDocument();
  });

  it('should render widget-specific settingsEditorComp as per its type', async () => {
    await setup(fixtureAppState({
      entities: {
        widgetTypes: {
          ...fixtureWidgetTypeAInColl({
            id: widgetTypeId,
            settingsEditorComp: {
              type: 'react',
              Comp: () => <div data-testid={testId}></div>
            } as SettingsEditorReactComponent<unknown>

          }),
          ...fixtureWidgetTypeBInColl()
        }
      },
      ui: {
        widgetSettings: fixtureWidgetSettings({
          widgetInEnv: {
            widget: fixtureWidgetA({id: widgetId, type: widgetTypeId}),
            env: fixtureWidgetEnvAreaShelf()
          }
        })
      }
    }));

    expect(screen.getByTestId(testId)).toBeInTheDocument();
  })

  it('should provide settingsEditorComp with access to the current settings state', async () => {
    const someValue = 'SOME VALUE';

    await setup(fixtureAppState({
      entities: {
        widgetTypes: {
          ...fixtureWidgetTypeAInColl({
            id: widgetTypeId,
            settingsEditorComp: {
              type: 'react',
              Comp: ({settings}) => <>{settings.prop}</>
            } as SettingsEditorReactComponent<{prop: string}>
          }),
          ...fixtureWidgetTypeBInColl()
        }
      },
      ui: {
        widgetSettings: fixtureWidgetSettings({
          widgetInEnv: {
            widget: fixtureWidgetA({
              id: widgetId,
              type: widgetTypeId,
              settings: {
                prop: someValue
              }
            }),
            env: fixtureWidgetEnvAreaShelf()
          }
        })
      }
    }));

    expect(screen.getByText(someValue)).toBeInTheDocument();
  })

  it('should display a preview with current settings', async () => {
    const someValue = 'SOME-VALUE';

    await setup(fixtureAppState({
      entities: {
        widgetTypes: {
          ...fixtureWidgetTypeAInColl({
            id: widgetTypeId,
          }),
          ...fixtureWidgetTypeBInColl()
        }
      },
      ui: {
        widgetSettings: fixtureWidgetSettings({
          widgetInEnv: {
            widget: fixtureWidgetA({
              type: widgetTypeId,
              settings: {
                prop: someValue
              }
            }),
            env: fixtureWidgetEnvAreaShelf()
          }
        })
      }
    }));

    expect(screen.queryByText(`WIDGET-PREVIEW-${someValue}`)).toBeInTheDocument();
  })

  it('should call a right usecase when clicking the close button', async () => {
    const {closeWidgetSettingsUseCase} = await setup(fixtureAppState({
      entities: {
        widgetTypes: {
          ...fixtureWidgetTypeAInColl({
            id: widgetTypeId,
          }),
          ...fixtureWidgetTypeBInColl()
        }
      },
      ui: {
        widgetSettings: fixtureWidgetSettings({
          widgetInEnv: {
            widget: fixtureWidgetA({
              id: widgetId,
              type: widgetTypeId
            }),
            env: fixtureWidgetEnvAreaShelf()
          }
        })
      }
    }));

    const elButton = screen.getByRole('button', {
      name: /cancel/i
    });

    expect(closeWidgetSettingsUseCase).toBeCalledTimes(0);

    fireEvent.click(elButton);

    expect(closeWidgetSettingsUseCase).toBeCalledTimes(1);
  })

  it('should call a right usecase with right params when clicking the save button', async () => {
    const {saveWidgetSettingsUseCase} = await setup(fixtureAppState({
      entities: {
        widgetTypes: {
          ...fixtureWidgetTypeAInColl({
            id: widgetTypeId,
          }),
          ...fixtureWidgetTypeBInColl()
        }
      },
      ui: {
        widgetSettings: fixtureWidgetSettings({
          widgetInEnv: {
            widget: fixtureWidgetA({
              id: widgetId,
              type: widgetTypeId
            }),
            env: fixtureWidgetEnvAreaShelf()
          }
        })
      }
    }));

    const elButton = screen.getByRole('button', {
      name: /ok/i
    });

    expect(saveWidgetSettingsUseCase).toBeCalledTimes(0);

    fireEvent.click(elButton);

    expect(saveWidgetSettingsUseCase).toBeCalledTimes(1);
  })

  it('should call getWidgetSettingsApiUseCase with right params and give access to the returned value as widgetSettingsApi in Comp', async () => {
    const getWidgetSettingsApiUseCaseRes = 'USECASE RES';
    const getWidgetSettingsApiUseCase = jest.fn(() => getWidgetSettingsApiUseCaseRes);

    await setup(
      fixtureAppState({
        entities: {
          widgetTypes: {
            ...fixtureWidgetTypeAInColl({
              id: widgetTypeId,
              settingsEditorComp: {
                type: 'react',
                Comp: ({settingsApi}) => <>{settingsApi}</>
              } as SettingsEditorReactComponent
            }),
          }
        },
        ui: {
          widgetSettings: fixtureWidgetSettings({
            widgetInEnv: {
              widget: fixtureWidgetA({
                id: widgetId,
                type: widgetTypeId
              }),
              env: fixtureWidgetEnvAreaShelf()
            }
          })
        }
      }),
      {
        getWidgetSettingsApiUseCase
      }
    );

    expect(getWidgetSettingsApiUseCase).toBeCalledTimes(1);
    // expect(getWidgetSettingsApiUseCase).toBeCalledWith();
    expect(screen.queryByText(getWidgetSettingsApiUseCaseRes)).toBeInTheDocument();
  })

  describe('<CoreSettings />', () => {
    it('should fill inputs with right values', async () => {
      const coreSettings = fixtureWidgetCoreSettingsA({ name: 'Some Name' });
      await setup(fixtureAppState({
        entities: {
          widgetTypes: {
            ...fixtureWidgetTypeAInColl({
              id: widgetTypeId,
            }),
            ...fixtureWidgetTypeBInColl()
          }
        },
        ui: {
          widgetSettings: fixtureWidgetSettings({
            widgetInEnv: {
              widget: fixtureWidgetA({id: widgetId, type: widgetTypeId, coreSettings}),
              env: fixtureWidgetEnvAreaShelf()
            }
          })
        }
      }));

      expect(screen.getByRole('textbox', { name: /^name$/i })).toHaveValue(coreSettings.name);
    })

    it('should call updateWidgetCoreSettingsUseCase with right args when editing the name', async () => {
      const curName = 'Widget Nam';
      const addToName = 'e';
      const coreSettings = fixtureWidgetCoreSettingsA({ name: curName });
      const {updateWidgetCoreSettingsUseCase} = await setup(fixtureAppState({
        entities: {
          widgetTypes: {
            ...fixtureWidgetTypeAInColl({
              id: widgetTypeId,
            }),
            ...fixtureWidgetTypeBInColl()
          }
        },
        ui: {
          widgetSettings: fixtureWidgetSettings({
            widgetInEnv: {
              widget: fixtureWidgetA({id: widgetId, type: widgetTypeId, coreSettings}),
              env: fixtureWidgetEnvAreaShelf()
            }
          })
        }
      }));
      const input = screen.getByRole('textbox', { name: /^name$/i })

      await userEvent.type(input, addToName);

      expect(updateWidgetCoreSettingsUseCase).toBeCalledTimes(1);
      expect(updateWidgetCoreSettingsUseCase).toBeCalledWith({
        ...coreSettings,
        name: curName+addToName
      })
    })
  })
})
