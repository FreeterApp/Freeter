/*
 * Copyright: (c) 2024, Alex Kaul
 * GNU General Public License v3.0 or later (see COPYING or https://www.gnu.org/licenses/gpl-3.0.txt)
 */

import { act, fireEvent, render, screen, waitFor } from '@testing-library/react';
import { createWidgetViewModelHook } from '@/ui/components/widget/widgetViewModel';
import { createWidgetComponent } from '@/ui/components/widget/widget';
import { Widget, WidgetContextMenuFactory, WidgetEnv, WidgetEnvAreaShelf, WidgetEnvAreaWorkflow } from '@/base/widget';
import { fixtureWidgetA, fixtureWidgetCoreSettingsA, fixtureWidgetEnvAreaShelf, fixtureWidgetEnvAreaWorkflow } from '@tests/base/fixtures/widget';
import { createAppStateHook } from '@/ui/hooks/appState';
import { fixtureAppState } from '@tests/base/state/fixtures/appState';
import { fixtureWidgetTypeAInColl, fixtureWidgetTypeBInColl } from '@tests/base/state/fixtures/entitiesState';
import { fixtureAppStore } from '@tests/data/fixtures/appStore';
import { ActionBarItems, ContextMenuEvent, WidgetReactComponent } from '@/widgets/types';
import { AppState } from '@/base/state/app';
import { WidgetApi, WidgetApiModuleName } from '@/base/widgetApi';
import { useEffect } from 'react';
import { fixtureActionBarItemA, fixtureActionBarItemB, fixtureActionBarItemC, fixtureActionBarItemD } from '@tests/base/fixtures/actionBar';
import { fixtureDragDropNotDragging } from '@tests/base/state/fixtures/dragDropState';
import { fixtureWorktableNotResizing, fixtureWorktableResizingItem } from '@tests/base/state/fixtures/worktable';

type SetupProps = {
  widget: Widget;
  env?: WidgetEnv;
  appState: AppState;
  mocks?: {
    getWidgetApiUseCase?: jest.Mock;
  }
}
async function setup({
  widget,
  env,
  appState,
  mocks,
}: SetupProps) {
  const [appStore, appStoreForUi] = await fixtureAppStore(appState);
  const useAppState = createAppStateHook(appStoreForUi);

  const openWidgetSettingsUseCase = jest.fn();
  const deleteWidgetUseCase = jest.fn();
  const showWidgetContextMenuUseCase = jest.fn();
  const getWidgetApiUseCase = mocks?.getWidgetApiUseCase || (
    (
      _widgetId: string,
      _previewMode: boolean,
      updateActionBarHandler: (actionBarItems: ActionBarItems)=>void,
      setContextMenuFactoryHandler: (contextMenuFactory: WidgetContextMenuFactory)=>void
    ) => {
      const widgetApi: Partial<WidgetApi> = {
        updateActionBar: (actionBarItems) => act(() => updateActionBarHandler(actionBarItems)),
        setContextMenuFactory: (factory) => act(() => setContextMenuFactoryHandler(factory))
      }
      return widgetApi as WidgetApi;
    }
  );

  const useWidgetViewModel = createWidgetViewModelHook({
    useAppState,
    openWidgetSettingsUseCase,
    deleteWidgetUseCase,
    showWidgetContextMenuUseCase,
    getWidgetApiUseCase
  })
  const Widget = createWidgetComponent({
    useWidgetViewModel
  })
  const comp = await waitFor(() => render(
    <Widget widget={ widget } env={env || fixtureWidgetEnvAreaShelf()} />
  ));

  return {
    comp,
    appStore,
    openWidgetSettingsUseCase,
    deleteWidgetUseCase,
    showWidgetContextMenuUseCase,
    getWidgetApiUseCase,
  }
}

const widgetId = 'WIDGET-ID';
const widgetTypeId1 = 'WIDGET-TYPE-1';
const widgetTypeId2 = 'WIDGET-TYPE-2';
const testId1 = 'TEST-1';
const testId2 = 'TEST-2';

describe('<Widget />', () => {
  it('should display a widget comp as per its type', async () => {
    await setup({
      appState: fixtureAppState({
        entities: {
          widgetTypes: {
            ...fixtureWidgetTypeAInColl({
              id: widgetTypeId1,
              widgetComp: {
                type: 'react',
                Comp: () => <div data-testid={testId1}></div>
              } as WidgetReactComponent<{prop: string}>
            }),
            ...fixtureWidgetTypeBInColl({
              id: widgetTypeId2,
              widgetComp: {
                type: 'react',
                Comp: () => <div data-testid={testId2}></div>
              } as WidgetReactComponent<{prop: string}>
            }),
          }
        }
      }),
      widget: fixtureWidgetA({
        type: widgetTypeId1
      }),
    });

    expect(screen.getByTestId(testId1)).toBeInTheDocument();
    expect(screen.queryByTestId(testId2)).not.toBeInTheDocument();
  })

  it('should display a widget name, if it is set', async () => {
    const widgetName = 'Widget Name';
    await setup({
      appState: fixtureAppState({
        entities: {
          widgetTypes: {
            ...fixtureWidgetTypeAInColl({
              id: widgetTypeId1,
            }),
          }
        }
      }),
      widget: fixtureWidgetA({
        type: widgetTypeId1,
        coreSettings: fixtureWidgetCoreSettingsA({
          name: widgetName
        })
      }),
    });

    expect(screen.queryAllByText(widgetName).length).toBe(1);
  })

  it('should display a widget type name, if the widget name is not set', async () => {
    const widgetTypeName = 'Widget Type Name';
    await setup({
      appState: fixtureAppState({
        entities: {
          widgetTypes: {
            ...fixtureWidgetTypeAInColl({
              id: widgetTypeId1,
              name: widgetTypeName
            }),
          }
        }
      }),
      widget: fixtureWidgetA({
        type: widgetTypeId1,
        coreSettings: fixtureWidgetCoreSettingsA({
          name: ''
        })
      }),
    });

    expect(screen.queryAllByText(widgetTypeName).length).toBe(1);
  })

  it('should not display an action bar, when a widget instance does not have actions', async () => {
    await setup({
      appState: fixtureAppState({
        entities: {
          widgetTypes: {
            ...fixtureWidgetTypeAInColl({
              id: widgetTypeId1,
              widgetComp: {
                type: 'react',
                Comp: ({widgetApi}) => {
                  useEffect(() => {
                    widgetApi.updateActionBar([
                    ]);
                  }, [])
                  return <></>;
                }
              } as WidgetReactComponent
            }),
          }
        }
      }),
      widget: fixtureWidgetA({
        type: widgetTypeId1
      }),
    });

    expect(screen.queryByRole('toolbar')).not.toBeInTheDocument();
  })

  it('should display an action bar, when a widget instance has actions', async () => {
    await setup({
      appState: fixtureAppState({
        entities: {
          widgetTypes: {
            ...fixtureWidgetTypeAInColl({
              id: widgetTypeId1,
              widgetComp: {
                type: 'react',
                Comp: ({widgetApi}) => {
                  useEffect(() => {
                    widgetApi.updateActionBar([
                      fixtureActionBarItemA(),
                    ]);
                  }, [])
                  return <></>;
                }
              } as WidgetReactComponent
            }),
          }
        }
      }),
      widget: fixtureWidgetA({
        type: widgetTypeId1
      }),
    });

    expect(screen.getByRole('toolbar')).toBeInTheDocument();
  })

  it('should not add "dont-show-action-bar" class name to the widget, when not dragging nor resizing', async () => {
    const {comp} = await setup({
      appState: fixtureAppState({
        entities: {
          widgetTypes: {
            ...fixtureWidgetTypeAInColl({
              id: widgetTypeId1,
            }),
          }
        },
        ui: {
          dragDrop: fixtureDragDropNotDragging(),
          worktable: fixtureWorktableNotResizing()
        }
      }),
      widget: fixtureWidgetA({
        type: widgetTypeId1
      }),
    });
    expect(comp.container.firstChild).not.toHaveClass('dont-show-action-bar');
  })

  it('should add "dont-show-action-bar" class name to the widget, when dragging', async () => {
    const {comp} = await setup({
      appState: fixtureAppState({
        entities: {
          widgetTypes: {
            ...fixtureWidgetTypeAInColl({
              id: widgetTypeId1,
            }),
          }
        },
        ui: {
          dragDrop: {
            from: {}
          },
          worktable: fixtureWorktableNotResizing()
        }
      }),
      widget: fixtureWidgetA({
        type: widgetTypeId1
      }),
    });
    expect(comp.container.firstChild).toHaveClass('dont-show-action-bar');
  })

  it('should add "dont-show-action-bar" class name to the widget, when resizing item in the worktable', async () => {
    const {comp} = await setup({
      appState: fixtureAppState({
        entities: {
          widgetTypes: {
            ...fixtureWidgetTypeAInColl({
              id: widgetTypeId1,
            }),
          }
        },
        ui: {
          dragDrop: fixtureDragDropNotDragging(),
          worktable: fixtureWorktableResizingItem()
        }
      }),
      widget: fixtureWidgetA({
        type: widgetTypeId1
      }),
    });
    expect(comp.container.firstChild).toHaveClass('dont-show-action-bar');
  })


  it('should display 1 widget action, when a widget instance has 1 action1', async () => {
    await setup({
      appState: fixtureAppState({
        entities: {
          widgetTypes: {
            ...fixtureWidgetTypeAInColl({
              id: widgetTypeId1,
              widgetComp: {
                type: 'react',
                Comp: ({widgetApi}) => {
                  useEffect(() => {
                    widgetApi.updateActionBar([
                      fixtureActionBarItemA()
                    ]);
                  }, [])
                  return <></>;
                }
              } as WidgetReactComponent
            }),
          }
        }
      }),
      widget: fixtureWidgetA({
        type: widgetTypeId1,
      }),
    });

    expect(screen.queryAllByRole('button').length).toBe(1);
  })

  it('should display 4 widget actions, if a widget instance has 4 actions', async () => {
    await setup({
      appState: fixtureAppState({
        entities: {
          widgetTypes: {
            ...fixtureWidgetTypeAInColl({
              id: widgetTypeId1,
              widgetComp: {
                type: 'react',
                Comp: ({widgetApi}) => {
                  useEffect(() => {
                    widgetApi.updateActionBar([
                      fixtureActionBarItemA(),
                      fixtureActionBarItemB(),
                      fixtureActionBarItemC(),
                      fixtureActionBarItemD()
                    ]);
                  }, [])
                  return <></>;
                }
              } as WidgetReactComponent
            }),
          }
        }
      }),
      widget: fixtureWidgetA({
        type: widgetTypeId1,
      }),
    });

    expect(screen.queryAllByRole('button').length).toBe(4);
  })

  it('should display titles of widget actions', async () => {
    const testTitle = 'TEST TITLE';
    await setup({
      appState: fixtureAppState({
        entities: {
          widgetTypes: {
            ...fixtureWidgetTypeAInColl({
              id: widgetTypeId1,
              widgetComp: {
                type: 'react',
                Comp: ({widgetApi}) => {
                  useEffect(()=>{
                    widgetApi.updateActionBar([
                      fixtureActionBarItemA({title: testTitle}),
                    ]);
                  }, [])
                  return <></>;
                }
              } as WidgetReactComponent
            }),
          }
        }
      }),
      widget: fixtureWidgetA({
        type: widgetTypeId1,
      }),
    });

    expect(screen.queryAllByRole('button', {name: testTitle}).length).toBe(1);
  })

  it('should not display actions set by widget, when edit mode is on', async () => {
    const testTitle = 'TEST TITLE';
    await setup({
      appState: fixtureAppState({
        entities: {
          widgetTypes: {
            ...fixtureWidgetTypeAInColl({
              id: widgetTypeId1,
              widgetComp: {
                type: 'react',
                Comp: ({widgetApi}) => {
                  useEffect(()=>{
                    widgetApi.updateActionBar([
                      fixtureActionBarItemA({title: testTitle}),
                    ]);
                  }, [])
                  return <></>;
                }
              } as WidgetReactComponent
            }),
          }
        },
        ui: {
          editMode: true
        }
      }),
      widget: fixtureWidgetA({
        type: widgetTypeId1,
      }),
    });

    expect(screen.queryAllByRole('button', {name: testTitle}).length).toBe(0);
  })

  it('should display edit-mode widget actions, when edit mode is on', async () => {
    await setup({
      appState: fixtureAppState({
        entities: {
          widgetTypes: {
            ...fixtureWidgetTypeAInColl({
              id: widgetTypeId1,
            }),
          }
        },
        ui: {
          editMode: true
        }
      }),
      widget: fixtureWidgetA({
        type: widgetTypeId1,
      }),
    });

    expect(screen.queryAllByRole('button', {name: /widget settings/i}).length).toBe(1);
    expect(screen.queryAllByRole('button', {name: /delete widget/i}).length).toBe(1);
  })

  it('should not display edit-mode widget actions, when edit mode is off', async () => {
    await setup({
      appState: fixtureAppState({
        entities: {
          widgetTypes: {
            ...fixtureWidgetTypeAInColl({
              id: widgetTypeId1,
            }),
          }
        },
        ui: {
          editMode: false
        }
      }),
      widget: fixtureWidgetA({
        type: widgetTypeId1,
      }),
    });

    expect(screen.queryAllByRole('button', {name: /widget settings/i}).length).toBe(0);
    expect(screen.queryAllByRole('button', {name: /delete widget/i}).length).toBe(0);
  })

  it('should call the open widget settings usecase with right params, when clicking the Widget Settings button', async () => {
    const {openWidgetSettingsUseCase} = await setup({
      appState: fixtureAppState({
        entities: {
          widgetTypes: {
            ...fixtureWidgetTypeAInColl({
              id: widgetTypeId1,
            }),
          }
        },
        ui: {
          editMode: true
        }
      }),
      widget: fixtureWidgetA({
        id: widgetId,
        type: widgetTypeId1,
      }),
      env: fixtureWidgetEnvAreaShelf()
    });

    const elButton = screen.getByRole('button', {name: /widget settings/i});
    fireEvent.click(elButton);

    expect(openWidgetSettingsUseCase).toBeCalledTimes(1);
    expect(openWidgetSettingsUseCase).toBeCalledWith(widgetId, expect.objectContaining<WidgetEnvAreaShelf>({
      area: 'shelf'
    }))
  })

  it('should call the delete widget usecase with right params, when clicking the Delete Widget button', async () => {
    const env = fixtureWidgetEnvAreaShelf();
    const {deleteWidgetUseCase} = await setup({
      appState: fixtureAppState({
        entities: {
          widgetTypes: {
            ...fixtureWidgetTypeAInColl({
              id: widgetTypeId1,
            }),
          }
        },
        ui: {
          editMode: true
        }
      }),
      widget: fixtureWidgetA({
        id: widgetId,
        type: widgetTypeId1,
      }),
      env
    });

    const elButton = screen.getByRole('button', {name: /delete widget/i});
    fireEvent.click(elButton);

    expect(deleteWidgetUseCase).toBeCalledTimes(1);
    expect(deleteWidgetUseCase).toBeCalledWith(widgetId, env);
  })

  it('should display a warning and nothing else, if the widget has an unexisting type', async () => {
    await setup({
      appState: fixtureAppState({
        entities: {
          widgetTypes: {
            ...fixtureWidgetTypeAInColl({
              id: widgetTypeId1,
              widgetComp: {
                type: 'react',
                Comp: () => <div data-testid={testId1}></div>
              } as WidgetReactComponent<{prop: string}>
            }),
          }
        }
      }),
      widget: fixtureWidgetA({
        type: 'UNKNOWN-TYPE'
      }),
    });

    expect(screen.getByText('Unknown widget type')).toBeInTheDocument()

    expect(screen.queryByTestId(testId1)).not.toBeInTheDocument();
    expect(screen.queryByRole('list')).not.toBeInTheDocument();
  })

  it('should have access to own id', async () => {
    const testWidgetId = 'TEST-WIDGET-ID';
    await setup({
      appState: fixtureAppState({
        entities: {
          widgetTypes: {
            ...fixtureWidgetTypeAInColl({
              id: widgetTypeId1,
              widgetComp: {
                type: 'react',
                Comp: ({id}) => <>{id}</>
              } as WidgetReactComponent
            }),
          }
        }
      }),

      widget: fixtureWidgetA({
        id: testWidgetId,
        type: widgetTypeId1,
      }),
    });

    expect(screen.getByText(testWidgetId)).toBeInTheDocument();
  })

  it('should have access to the widget environment data', async () => {
    const testEnvProjectId = 'TEST-ENV-PROJECT-ID';
    await setup({
      appState: fixtureAppState({
        entities: {
          widgetTypes: {
            ...fixtureWidgetTypeAInColl({
              id: widgetTypeId1,
              widgetComp: {
                type: 'react',
                Comp: ({env}) => <>{(env as WidgetEnvAreaWorkflow).projectId}</>
              } as WidgetReactComponent<{prop: string}>
            }),
          }
        }
      }),
      env: fixtureWidgetEnvAreaWorkflow({
        projectId: testEnvProjectId
      }),
      widget: fixtureWidgetA({
        type: widgetTypeId1,
      }),
    });

    expect(screen.getByText(testEnvProjectId)).toBeInTheDocument();
  })

  it('should have access to the current settings state', async () => {
    const someValue = 'SOME VALUE';

    await setup({
      appState: fixtureAppState({
        entities: {
          widgetTypes: {
            ...fixtureWidgetTypeAInColl({
              id: widgetTypeId1,
              widgetComp: {
                type: 'react',
                Comp: ({settings}) => <>{settings.prop}</>
              } as WidgetReactComponent<{prop: string}>
            }),
          }
        }
      }),
      widget: fixtureWidgetA({
        id: widgetId,
        type: widgetTypeId1,
        settings: {
          prop: someValue
        }
      }),
    });

    expect(screen.getByText(someValue)).toBeInTheDocument();
  })

  it('should call getWidgetApiUseCase with right params and give access to the returned value as widgetApi in Comp', async () => {
    const testRequiresApi: WidgetApiModuleName[] = ['clipboard'];
    const getWidgetApiUseCaseRes = 'USECASE RES';
    const getWidgetApiUseCase = jest.fn(() => getWidgetApiUseCaseRes);

    await setup({
      appState: fixtureAppState({
        entities: {
          widgetTypes: {
            ...fixtureWidgetTypeAInColl({
              id: widgetTypeId1,
              widgetComp: {
                type: 'react',
                Comp: ({widgetApi}) => <>{widgetApi}</>
              } as WidgetReactComponent,
              requiresApi: testRequiresApi
            }),
          }
        }
      }),
      widget: fixtureWidgetA({
        id: widgetId,
        type: widgetTypeId1
      }),
      mocks: {
        getWidgetApiUseCase
      }
    });

    expect(getWidgetApiUseCase).toBeCalledTimes(1);
    expect(getWidgetApiUseCase).toBeCalledWith(widgetId, false, expect.any(Function), expect.any(Function), testRequiresApi);
    expect(screen.queryByText(getWidgetApiUseCaseRes)).toBeInTheDocument();
  })

  it('should call showWidgetContextMenuUseCase with undefined contextMenuFactory, when the widget did not set the factory and a context menu is called', async () => {
    const {showWidgetContextMenuUseCase} = await setup({
      appState: fixtureAppState({
        entities: {
          widgetTypes: {
            ...fixtureWidgetTypeAInColl({
              id: widgetTypeId1,
              widgetComp: {
                type: 'react',
                Comp: () => <div data-testid={testId1}></div>
              } as WidgetReactComponent<{prop: string}>
            }),
          }
        }
      }),
      widget: fixtureWidgetA({
        id: widgetId,
        type: widgetTypeId1
      }),
    });

    fireEvent.contextMenu(screen.getByTestId(testId1));

    expect(showWidgetContextMenuUseCase).toBeCalledTimes(1);
    expect(showWidgetContextMenuUseCase).toBeCalledWith(widgetId, undefined, '', undefined);
  })

  it('should call showWidgetContextMenuUseCase with a contextMenuFactory set by the widget, when a context menu is called', async () => {
    const contextMenuFactory = () => [];
    const {showWidgetContextMenuUseCase} = await setup({
      appState: fixtureAppState({
        entities: {
          widgetTypes: {
            ...fixtureWidgetTypeAInColl({
              id: widgetTypeId1,
              widgetComp: {
                type: 'react',
                Comp: ({widgetApi}) => {
                  useEffect(()=>{
                    widgetApi.setContextMenuFactory(contextMenuFactory)
                  }, [])
                  return <div data-testid={testId1}></div>
                }
              } as WidgetReactComponent<{prop: string}>
            }),
          }
        }
      }),
      widget: fixtureWidgetA({
        id: widgetId,
        type: widgetTypeId1
      }),
    });

    fireEvent.contextMenu(screen.getByTestId(testId1));

    expect(showWidgetContextMenuUseCase).toBeCalledTimes(1);
    expect(showWidgetContextMenuUseCase).toBeCalledWith(widgetId, contextMenuFactory, '', undefined);
  })

  it('should call showWidgetContextMenuUseCase with contextId==="", when a context menu is called and no Comp elements have a data-widget-context attribute', async () => {
    const {showWidgetContextMenuUseCase} = await setup({
      appState: fixtureAppState({
        entities: {
          widgetTypes: {
            ...fixtureWidgetTypeAInColl({
              id: widgetTypeId1,
              widgetComp: {
                type: 'react',
                Comp: () => <div data-testid={testId1}></div>
              } as WidgetReactComponent<{prop: string}>
            }),
          }
        }
      }),
      widget: fixtureWidgetA({
        id: widgetId,
        type: widgetTypeId1
      }),
    });

    fireEvent.contextMenu(screen.getByTestId(testId1));

    expect(showWidgetContextMenuUseCase).toBeCalledTimes(1);
    expect(showWidgetContextMenuUseCase).toBeCalledWith(widgetId, undefined, '', undefined);
  })

  it('should call showWidgetContextMenuUseCase with contextId specified by "data-widget-context" attribute of an element where a context menu is called', async () => {
    const contextId = 'context-id';
    const {showWidgetContextMenuUseCase} = await setup({
      appState: fixtureAppState({
        entities: {
          widgetTypes: {
            ...fixtureWidgetTypeAInColl({
              id: widgetTypeId1,
              widgetComp: {
                type: 'react',
                Comp: () => <div data-testid={testId1} data-widget-context={contextId}></div>
              } as WidgetReactComponent<{prop: string}>
            }),
          }
        }
      }),
      widget: fixtureWidgetA({
        id: widgetId,
        type: widgetTypeId1
      }),
    });

    fireEvent.contextMenu(screen.getByTestId(testId1));

    expect(showWidgetContextMenuUseCase).toBeCalledTimes(1);
    expect(showWidgetContextMenuUseCase).toBeCalledWith(widgetId, undefined, contextId, undefined);
  })

  it('should call showWidgetContextMenuUseCase with contextId specified by "data-widget-context" attribute of a parent element, if an element where a context menu is called does not have it', async () => {
    const contextId = 'context-id';
    const {showWidgetContextMenuUseCase} = await setup({
      appState: fixtureAppState({
        entities: {
          widgetTypes: {
            ...fixtureWidgetTypeAInColl({
              id: widgetTypeId1,
              widgetComp: {
                type: 'react',
                Comp: () => <div data-widget-context={contextId}><div><div data-testid={testId1}></div></div></div>
              } as WidgetReactComponent<{prop: string}>
            }),
          }
        }
      }),
      widget: fixtureWidgetA({
        id: widgetId,
        type: widgetTypeId1
      }),
    });

    fireEvent.contextMenu(screen.getByTestId(testId1));

    expect(showWidgetContextMenuUseCase).toBeCalledTimes(1);
    expect(showWidgetContextMenuUseCase).toBeCalledWith(widgetId, undefined, contextId, undefined);
  })

  it('should call showWidgetContextMenuUseCase with contextData specified in Event object, when the widget fires a custom contextmenu event with `contextData` property', async () => {
    const testContextData = { data: 'test'};
    const {showWidgetContextMenuUseCase} = await setup({
      appState: fixtureAppState({
        entities: {
          widgetTypes: {
            ...fixtureWidgetTypeAInColl({
              id: widgetTypeId1,
              widgetComp: {
                type: 'react',
                Comp: () => <div data-testid={testId1}></div>
              } as WidgetReactComponent<{prop: string}>
            }),
          }
        }
      }),
      widget: fixtureWidgetA({
        id: widgetId,
        type: widgetTypeId1
      }),
    });

    const evt = new MouseEvent('contextmenu', {bubbles: true}) as ContextMenuEvent;
    evt.contextData = testContextData;
    fireEvent(screen.getByTestId(testId1), evt);

    expect(showWidgetContextMenuUseCase).toBeCalledTimes(1);
    expect(showWidgetContextMenuUseCase).toBeCalledWith(widgetId, undefined, '', testContextData);
  })

})
