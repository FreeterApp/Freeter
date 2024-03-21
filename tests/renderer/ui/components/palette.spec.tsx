/*
 * Copyright: (c) 2024, Alex Kaul
 * GNU General Public License v3.0 or later (see COPYING or https://www.gnu.org/licenses/gpl-3.0.txt)
 */

import { render, screen, fireEvent, within } from '@testing-library/react';
import { createPaletteComponent } from '@/ui/components/palette/palette';
import { createPaletteViewModelHook } from '@/ui/components/palette/paletteViewModel';
import { createDragEndUseCase } from '@/application/useCases/dragDrop/dragEnd';
import { createDragWidgetFromPaletteUseCase } from '@/application/useCases/dragDrop/dragWidgetFromPalette';
import { createAppStateHook } from '@/ui/hooks/appState';
import { fixtureAppState } from '@tests/base/state/fixtures/appState';
import { fixtureWidgetTypeAInColl, fixtureWidgetTypeBInColl, fixtureWidgetTypeCInColl, fixtureWidgetTypeDInColl, fixtureProjectAInColl } from '@tests/base/state/fixtures/entitiesState';
import { fixturePalette } from '@tests/base/state/fixtures/palette';
import { fixtureAppStore } from '@tests/data/fixtures/appStore';
import { AppState } from '@/base/state/app';
import { fixtureProjectSwitcher } from '@tests/base/state/fixtures/projectSwitcher';
import { fixtureWorktableNotResizing, fixtureWorktableResizingItem } from '@tests/base/state/fixtures/worktable';
import { fixtureCopyState } from '@tests/base/state/fixtures/copy';
import { fixtureWidgetA, fixtureWidgetB, fixtureWidgetC, fixtureWidgetD } from '@tests/base/fixtures/widget';
import { fixtureWidgetTypeA } from '@tests/base/fixtures/widgetType';

async function setup(
  appState: AppState
) {
  const [appStore, appStoreForUi] = await fixtureAppStore(appState);
  const useAppState = createAppStateHook(appStoreForUi);
  const dragEndUseCase = jest.fn(createDragEndUseCase({
    appStore,
  }));
  const dragWidgetFromPaletteUseCase = jest.fn(createDragWidgetFromPaletteUseCase({
    appStore,
  }));
  const addWidgetToWorkflowWithPaletteUseCase = jest.fn();
  const pasteWidgetToWorkflowUseCase = jest.fn();
  const usePaletteViewModel = createPaletteViewModelHook({
    useAppState,
    addWidgetToWorkflowWithPaletteUseCase,
    dragEndUseCase,
    dragWidgetFromPaletteUseCase,
    pasteWidgetToWorkflowUseCase
  })
  const Palette = createPaletteComponent({
    usePaletteViewModel
  })
  const comp = render(
    <Palette/>
  );

  return {
    comp,
    appStore,
    dragEndUseCase,
    dragWidgetFromPaletteUseCase,
    addWidgetToWorkflowWithPaletteUseCase,
    pasteWidgetToWorkflowUseCase
  }
}

const classIsHidden = 'is-hidden';
const dragItemId = 'DRAG-ITEM-ID';

describe('<Palette />', () => {
  it('should display the "Add Widget" list', async () => {
    await setup(fixtureAppState({}));
    expect(screen.getByTestId('palette-add')).toBeInTheDocument();
  });

  it('should display 0 items in the Add Widget list, when there are no widget types', async () => {
    await setup(fixtureAppState({
      ui: {
        palette: {
          widgetTypeIds: []
        }
      }
    }))
    const palAdd = screen.getByTestId('palette-add');
    expect(within(palAdd).queryAllByRole('listitem').length).toBe(0);
  });

  it('should display 4 items in the Add Widget list, when there are 4 widget types', async () => {
    await setup(fixtureAppState({
      entities: {
        widgetTypes: {
          ...fixtureWidgetTypeAInColl({id: 'WT-A'}),
          ...fixtureWidgetTypeBInColl({id: 'WT-B'}),
          ...fixtureWidgetTypeCInColl({id: 'WT-C'}),
          ...fixtureWidgetTypeDInColl({id: 'WT-D'}),
        }
      },
      ui: {
        palette: fixturePalette({
          widgetTypeIds: ['WT-A', 'WT-B', 'WT-C', 'WT-D']
        })
      }
    }))
    const palAdd = screen.getByTestId('palette-add');
    expect(within(palAdd).queryAllByRole('listitem').length).toBe(4);
  });

  it('should display "No widgets to paste" instead of the "Paste Widget" list, when there are no copied widgets', async () => {
    const widgetTypeA = fixtureWidgetTypeA();
    await setup(fixtureAppState({
      entities: {
        widgetTypes: {
          [widgetTypeA.id]: widgetTypeA
        }
      },
      ui: {
        copy: fixtureCopyState({
          widgets: {
            entities: {},
            list: []
          }
        })
      }
    }));
    expect(screen.queryByTestId('palette-paste')).not.toBeInTheDocument();
    expect(screen.getByText(/no widgets to paste/i)).toBeInTheDocument();
  });

  it('should display the "Paste Widget" list instead of "No widgets to paste", when there are copied widgets', async () => {
    const widgetTypeA = fixtureWidgetTypeA();
    const widgetA = fixtureWidgetA({type: widgetTypeA.id});
    await setup(fixtureAppState({
      entities: {
        widgetTypes: {
          [widgetTypeA.id]: widgetTypeA
        }
      },
      ui: {
        copy: fixtureCopyState({
          widgets: {
            entities: {
              [widgetA.id]: {
                id: widgetA.id,
                deps: {},
                entity: widgetA
              }
            },
            list: [widgetA.id]
          }
        })
      }
    }));
    expect(screen.getByTestId('palette-paste')).toBeInTheDocument();
    expect(screen.queryByText(/no widgets to paste/i)).not.toBeInTheDocument();
  });

  it('should display 1 item in the Paste Widget list, when there is 1 copied widget', async () => {
    const widgetTypeA = fixtureWidgetTypeA();
    const widgetA = fixtureWidgetA({type: widgetTypeA.id});
    await setup(fixtureAppState({
      entities: {
        widgetTypes: {
          [widgetTypeA.id]: widgetTypeA
        }
      },
      ui: {
        copy: fixtureCopyState({
          widgets: {
            entities: {
              [widgetA.id]: {
                id: widgetA.id,
                deps: {},
                entity: widgetA
              }
            },
            list: [widgetA.id]
          }
        })
      }
    }))
    const palPaste = screen.getByTestId('palette-paste');
    expect(within(palPaste).queryAllByRole('listitem').length).toBe(1);
  });

  it('should display 4 items in the Paste Widget list, when there are 4 copied widgets', async () => {
    const widgetTypeA = fixtureWidgetTypeA();
    const widgetA = fixtureWidgetA({type: widgetTypeA.id});
    const widgetB = fixtureWidgetB({type: widgetTypeA.id});
    const widgetC = fixtureWidgetC({type: widgetTypeA.id});
    const widgetD = fixtureWidgetD({type: widgetTypeA.id});
    await setup(fixtureAppState({
      entities: {
        widgetTypes: {
          [widgetTypeA.id]: widgetTypeA
        }
      },
      ui: {
        copy: fixtureCopyState({
          widgets: {
            entities: {
              [widgetA.id]: { id: widgetA.id, deps: {}, entity: widgetA },
              [widgetB.id]: { id: widgetB.id, deps: {}, entity: widgetB },
              [widgetC.id]: { id: widgetC.id, deps: {}, entity: widgetC },
              [widgetD.id]: { id: widgetD.id, deps: {}, entity: widgetD },
            },
            list: [widgetA.id, widgetB.id, widgetC.id, widgetD.id]
          }
        })
      }
    }))
    const palPaste = screen.getByTestId('palette-paste');
    expect(within(palPaste).queryAllByRole('listitem').length).toBe(4);
  });

  it('should not add "is-hidden" class to the palette, when "dragging from" state is undefined', async () => {
    const {comp} = await setup(fixtureAppState({
      ui: {
        dragDrop: {
          from: undefined
        }
      }
    }));

    expect(comp.container.firstChild).not.toHaveClass(classIsHidden);
  });

  it('should add "is-hidden" class to the palette, when "dragging from" state is defined', async () => {
    const {comp} = await setup(fixtureAppState({
      ui: {
        dragDrop: {
          from: {}
        }
      }
    }));

    expect(comp.container.firstChild).toHaveClass(classIsHidden);
  });

  it('should not add "is-hidden" class to the palette, when not resizing an item in the worktable', async () => {
    const {comp} = await setup(fixtureAppState({
      ui: {
        worktable: fixtureWorktableNotResizing()
      }
    }));

    expect(comp.container.firstChild).not.toHaveClass(classIsHidden);
  });

  it('should add "is-hidden" class to the palette, when resizing an item in the worktable', async () => {
    const {comp} = await setup(fixtureAppState({
      ui: {
        worktable: fixtureWorktableResizingItem()
      }
    }));

    expect(comp.container.firstChild).toHaveClass(classIsHidden);
  });

  it('should call right use cases with right params, when start/end dragging item from the Add Widget list', async () => {
    const {
      dragWidgetFromPaletteUseCase,
      dragEndUseCase
    } = await setup(fixtureAppState({
      entities: {
        widgetTypes: {
          ...fixtureWidgetTypeAInColl({id: 'WT-A'}),
          ...fixtureWidgetTypeBInColl({id: dragItemId}),
          ...fixtureWidgetTypeCInColl({id: 'WT-C'}),
          ...fixtureWidgetTypeDInColl({id: 'WT-D'}),
        }
      },
      ui: {
        palette: fixturePalette({
          widgetTypeIds: ['WT-A', dragItemId, 'WT-C', 'WT-D']
        })
      }
    }))

    const palAdd = screen.getByTestId('palette-add');
    const elDrag = within(palAdd).queryAllByRole('listitem')[1];

    fireEvent.dragStart(elDrag);

    expect(dragWidgetFromPaletteUseCase).toBeCalledTimes(1);
    expect(dragWidgetFromPaletteUseCase).toBeCalledWith({'widgetTypeId': dragItemId});
    expect(dragEndUseCase).toBeCalledTimes(0);

    fireEvent.dragEnd(elDrag);

    expect(dragWidgetFromPaletteUseCase).toBeCalledTimes(1);
    expect(dragEndUseCase).toBeCalledTimes(1);
  });

  it('should call right use case with right params, when clicking item on the Add Widget list', async () => {
    const widgetTypeId = 'WIDGET-TYPE-ID';
    const workflowId = 'WORKFLOW-ID';
    const projectId = 'PROJECT-ID';

    const {
      addWidgetToWorkflowWithPaletteUseCase
    } = await setup(fixtureAppState({
      entities: {
        projects: {
          ...fixtureProjectAInColl({id: projectId, currentWorkflowId: workflowId})
        },
        widgetTypes: {
          ...fixtureWidgetTypeAInColl({id: 'WT-A'}),
          ...fixtureWidgetTypeBInColl({id: widgetTypeId}),
          ...fixtureWidgetTypeCInColl({id: 'WT-C'}),
          ...fixtureWidgetTypeDInColl({id: 'WT-D'}),
        }
      },
      ui: {
        palette: fixturePalette({
          widgetTypeIds: ['WT-A', widgetTypeId, 'WT-C', 'WT-D']
        }),
        projectSwitcher: fixtureProjectSwitcher({
          currentProjectId: projectId
        })
      }
    }))
    const palAdd = screen.getByTestId('palette-add');
    const elClick = within(palAdd).queryAllByRole('listitem')[1];

    expect(addWidgetToWorkflowWithPaletteUseCase).toBeCalledTimes(0);

    fireEvent.click(elClick);

    expect(addWidgetToWorkflowWithPaletteUseCase).toBeCalledTimes(1);
    expect(addWidgetToWorkflowWithPaletteUseCase).toBeCalledWith(widgetTypeId, workflowId);
  });

  it('should call right use cases with right params, when start/end dragging item from the Paste Widget list', async () => {
    const widgetTypeA = fixtureWidgetTypeA();
    const widgetA = fixtureWidgetA({type: widgetTypeA.id});
    const widgetB = fixtureWidgetB({type: widgetTypeA.id});
    const widgetC = fixtureWidgetC({type: widgetTypeA.id});
    const widgetD = fixtureWidgetD({type: widgetTypeA.id});
    const {
      dragWidgetFromPaletteUseCase,
      dragEndUseCase
    } = await setup(fixtureAppState({
      entities: {
        widgetTypes: {
          [widgetTypeA.id]: widgetTypeA
        }
      },
      ui: {
        copy: fixtureCopyState({
          widgets: {
            entities: {
              [widgetA.id]: { id: widgetA.id, deps: {}, entity: widgetA },
              [widgetB.id]: { id: widgetB.id, deps: {}, entity: widgetB },
              [widgetC.id]: { id: widgetC.id, deps: {}, entity: widgetC },
              [widgetD.id]: { id: widgetD.id, deps: {}, entity: widgetD },
            },
            list: [widgetA.id, widgetB.id, widgetC.id, widgetD.id]
          }
        })
      }
    }))

    const palPaste = screen.getByTestId('palette-paste');
    const elDrag = within(palPaste).queryAllByRole('listitem')[1];

    fireEvent.dragStart(elDrag);

    expect(dragWidgetFromPaletteUseCase).toBeCalledTimes(1);
    expect(dragWidgetFromPaletteUseCase).toBeCalledWith({'widgetCopyId': widgetB.id});
    expect(dragEndUseCase).toBeCalledTimes(0);

    fireEvent.dragEnd(elDrag);

    expect(dragWidgetFromPaletteUseCase).toBeCalledTimes(1);
    expect(dragEndUseCase).toBeCalledTimes(1);
  });

  it('should call right use case with right params, when clicking item on the Paste Widget list', async () => {
    const workflowId = 'WORKFLOW-ID';
    const projectId = 'PROJECT-ID';
    const widgetTypeA = fixtureWidgetTypeA();
    const widgetA = fixtureWidgetA({type: widgetTypeA.id});
    const widgetB = fixtureWidgetB({type: widgetTypeA.id});
    const widgetC = fixtureWidgetC({type: widgetTypeA.id});
    const widgetD = fixtureWidgetD({type: widgetTypeA.id});

    const {
      pasteWidgetToWorkflowUseCase
    } = await setup(fixtureAppState({
      entities: {
        projects: {
          ...fixtureProjectAInColl({id: projectId, currentWorkflowId: workflowId})
        },
        widgetTypes: {
          [widgetTypeA.id]: widgetTypeA
        }
      },
      ui: {
        copy: fixtureCopyState({
          widgets: {
            entities: {
              [widgetA.id]: { id: widgetA.id, deps: {}, entity: widgetA },
              [widgetB.id]: { id: widgetB.id, deps: {}, entity: widgetB },
              [widgetC.id]: { id: widgetC.id, deps: {}, entity: widgetC },
              [widgetD.id]: { id: widgetD.id, deps: {}, entity: widgetD },
            },
            list: [widgetA.id, widgetB.id, widgetC.id, widgetD.id]
          }
        }),
        projectSwitcher: fixtureProjectSwitcher({
          currentProjectId: projectId
        })
      }
    }))
    const palPaste = screen.getByTestId('palette-paste');
    const elClick = within(palPaste).queryAllByRole('listitem')[1];

    expect(pasteWidgetToWorkflowUseCase).toBeCalledTimes(0);

    fireEvent.click(elClick);

    expect(pasteWidgetToWorkflowUseCase).toBeCalledTimes(1);
    expect(pasteWidgetToWorkflowUseCase).toBeCalledWith(widgetB.id, workflowId);
  });

})
