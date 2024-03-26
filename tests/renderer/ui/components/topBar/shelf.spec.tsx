/*
 * Copyright: (c) 2024, Alex Kaul
 * GNU General Public License v3.0 or later (see COPYING or https://www.gnu.org/licenses/gpl-3.0.txt)
 */

import { render, screen, fireEvent } from '@testing-library/react';
import { createShelfComponent } from '@/ui/components/topBar/shelf/shelf';
import { createShelfViewModelHook } from '@/ui/components/topBar/shelf/shelfViewModel';
import { WidgetComponent } from '@/ui/components/widget';
import { createShelfItemComponent } from '@/ui/components/topBar/shelf/shelfItem';
import { createAppStateHook } from '@/ui/hooks/appState';
import { fixtureAppState } from '@tests/base/state/fixtures/appState';
import { fixtureWidgetListItemA, fixtureWidgetListItemB, fixtureWidgetListItemC, fixtureWidgetListItemD } from '@tests/base/fixtures/widgetList';
import { fixtureWidgetAInColl, fixtureWidgetBInColl } from '@tests/base/state/fixtures/entitiesState';
import { fixtureWidgetTypeAInColl, fixtureWidgetTypeBInColl } from '@tests/base/state/fixtures/entitiesState';
import { fixtureDragDropFromPaletteAdd, fixtureDragDropFromTopBarList, fixtureDragDropFromWorktableLayout, fixtureDragDropNotDragging, fixtureDragDropOverTopBarList } from '@tests/base/state/fixtures/dragDropState';
import { fixtureShelf } from '@tests/base/state/fixtures/shelf';
import { fixtureAppStore } from '@tests/data/fixtures/appStore';
import { AppState } from '@/base/state/app';
import { fixtureWidgetCoreSettingsA, fixtureWidgetCoreSettingsB } from '@tests/base/fixtures/widget';
import { fixtureWorktableNotResizing, fixtureWorktableResizingItem } from '@tests/base/state/fixtures/worktable';
import { memo } from 'react';

const classIsDragging = 'is-dragging';
const classIsDropArea = 'is-drop-area';
const classIsWidget = 'is-widget';
const classDontShowWidgets = 'dont-show-widgets';
const dragItemId = 'DRAG-ITEM-ID';
const overItemId = 'OVER-ITEM-ID';
const widgetId = 'WIDGET-ID';

async function setup(
  appState: AppState
) {
  const [appStore, appStoreForUi] = await fixtureAppStore(appState);
  const useAppState = createAppStateHook(appStoreForUi);

  const dragEndUseCase = jest.fn();
  const dragWidgetFromTopBarListUseCase = jest.fn();
  const dragOverTopBarListUseCase = jest.fn();
  const dragLeaveTargetUseCase = jest.fn();
  const dropOnTopBarListUseCase = jest.fn();
  const openWidgetSettingsUseCase = jest.fn();
  const addWidgetToShelfUseCase = jest.fn();
  const pasteWidgetToShelfUseCase = jest.fn();
  const showContextMenuUseCase = jest.fn();

  const useShelfViewModel = createShelfViewModelHook({
    useAppState,
    dragEndUseCase,
    dragLeaveTargetUseCase,
    dragOverTopBarListUseCase,
    dragWidgetFromTopBarListUseCase: dragWidgetFromTopBarListUseCase,
    dropOnTopBarListUseCase,
    addWidgetToShelfUseCase,
    pasteWidgetToShelfUseCase,
    showContextMenuUseCase,
  })

  const Widget: WidgetComponent = memo(props => <div className={classIsWidget}>{`WIDGET-${props.widget.id}`}</div>);

  const ShelfItem = createShelfItemComponent({
    Widget
  })
  const Shelf = createShelfComponent({
    ShelfItem,
    useShelfViewModel
  })
  const comp = render(
    <Shelf/>
  );

  return {
    comp,
    appStore,
    dragEndUseCase,
    dragLeaveTargetUseCase,
    dragOverTopBarListUseCase,
    dragWidgetFromTopBarListUseCase,
    dropOnTopBarListUseCase,
    openWidgetSettingsUseCase
  }
}

describe('<Shelf />', () => {
  it('should display a list', async () => {
    await setup(fixtureAppState({}));
    expect(screen.getByRole('list')).toBeInTheDocument();
  });

  it('should display 0 items, when there is no widgets', async () => {
    await setup(fixtureAppState({
      ui: {
        shelf: fixtureShelf({
          widgetList: []
        })
      }
    }));
    expect(screen.queryAllByRole('listitem').length).toBe(0);
  });

  it('should display 4 items, when there are 4 widgets', async () => {
    await setup(fixtureAppState({
      ui: {
        shelf: fixtureShelf({
          widgetList: [
            fixtureWidgetListItemA(),
            fixtureWidgetListItemB(),
            fixtureWidgetListItemC(),
            fixtureWidgetListItemD(),
          ]
        })
      }
    }));
    expect(screen.getAllByRole('listitem').length).toBe(4);
  });

  it('should display the widget type name, if the widget name is not set', async () => {
    const idA = 'W-A';
    const typeIdA = 'TYPE-ID-A';
    const typeNameA = 'Type Name A';
    const idB = 'W-B';
    const typeIdB = 'TYPE-ID-B';
    const typeNameB = 'Type Name B';
    await setup(fixtureAppState({
      entities: {
        widgetTypes: {
          ...fixtureWidgetTypeAInColl({
            id: typeIdA,
            name: typeNameA
          }),
          ...fixtureWidgetTypeBInColl({
            id: typeIdB,
            name: typeNameB
          }),
        },
        widgets: {
          ...fixtureWidgetAInColl({
            id: idA,
            type: typeIdA,
            coreSettings: fixtureWidgetCoreSettingsA({name: ''})
          }),
          ...fixtureWidgetBInColl({
            id: idB,
            type: typeIdB,
            coreSettings: fixtureWidgetCoreSettingsB({name: ''})
          }),
        }
      },
      ui: {
        shelf: fixtureShelf({
          widgetList: [
            fixtureWidgetListItemA({widgetId: idA}),
            fixtureWidgetListItemB({widgetId: idB}),
          ]
        })
      }
    }));

    expect(screen.getAllByText(typeNameA).length).toBe(1);
    expect(screen.getAllByText(typeNameB).length).toBe(1);
  })

  it('should display Widget components with right id params', async () => {
    const idA = 'W-A';
    const idB = 'W-B';
    const {comp} = await setup(fixtureAppState({
      entities: {
        widgets: {
          ...fixtureWidgetAInColl({id: idA}),
          ...fixtureWidgetBInColl({id: idB}),
        }
      },
      ui: {
        shelf: fixtureShelf({
          widgetList: [
            fixtureWidgetListItemA({widgetId: idA}),
            fixtureWidgetListItemB({widgetId: idB}),
          ]
        })
      }
    }));

    expect(comp.container.getElementsByClassName(classIsWidget).length).toBe(2);
    expect(screen.getAllByText(`WIDGET-${idA}`).length).toBe(1);
    expect(screen.getAllByText(`WIDGET-${idB}`).length).toBe(1);
  })

  it('should make items draggable, when edit mode is on', async () => {
    const {comp} = await setup(fixtureAppState({
      ui: {
        editMode: true,
        shelf: fixtureShelf({
          widgetList: [
            fixtureWidgetListItemA(),
            fixtureWidgetListItemB(),
          ]
        })
      },
    }));

    expect(comp.container.querySelectorAll('li > [draggable="true"]').length).toBe(2);
  });

  it('should not make items draggable, when edit mode is off', async () => {
    const {comp} = await setup(fixtureAppState({
      ui: {
        editMode: false,
        shelf: fixtureShelf({
          widgetList: [
            fixtureWidgetListItemA(),
            fixtureWidgetListItemB(),
          ]
        })
      },
    }));
    expect(comp.container.querySelectorAll('li > [draggable="false"]').length).toBe(2);
  });

  it('should not add "dont-show-widgets" class to the list, when edit mode is off', async () => {
    await setup(fixtureAppState({
      ui: {
        editMode: false,
        dragDrop: {
          from: {}
        }
      }
    }));

    expect(screen.getByRole('list')).not.toHaveClass(classDontShowWidgets);
  });

  it('should not add "dont-show-widgets" class to the list, when "dragging from" state is undefined', async () => {
    await setup(fixtureAppState({
      ui: {
        editMode: true,
        dragDrop: {
          from: undefined
        }
      }
    }));

    expect(screen.getByRole('list')).not.toHaveClass(classDontShowWidgets);
  });

  it('should add "dont-show-widgets" class to the list, when "dragging from" state is defined', async () => {
    await setup(fixtureAppState({
      ui: {
        editMode: true,
        dragDrop: {
          from: {}
        }
      }
    }));

    expect(screen.getByRole('list')).toHaveClass(classDontShowWidgets);
  });

  it('should not add "dont-show-widgets" class to the list, when not resizing an item in the worktable', async () => {
    await setup(fixtureAppState({
      ui: {
        editMode: true,
        worktable: fixtureWorktableNotResizing()
      }
    }));

    expect(screen.getByRole('list')).not.toHaveClass(classDontShowWidgets);
  });

  it('should add "dont-show-widgets" class to the list, when resizing an item in the worktable', async () => {
    await setup(fixtureAppState({
      ui: {
        editMode: true,
        worktable: fixtureWorktableResizingItem()
      }
    }));

    expect(screen.getByRole('list')).toHaveClass(classDontShowWidgets);
  });


  describe('when not dragging item', () => {
    it('should not set "is-dragging" style to items', async () => {
      const {comp} = await setup(fixtureAppState({
        ui: {
          dragDrop: fixtureDragDropNotDragging(),
          shelf: fixtureShelf({
            widgetList: [
              fixtureWidgetListItemA(),
              fixtureWidgetListItemB(),
            ]
          })
        },
      }));

      expect(comp.container.getElementsByClassName(classIsDragging).length).toBe(0);
    });

    it('should not display Shelf as a drop target', async () => {
      await setup(fixtureAppState({
        ui: {
          dragDrop: fixtureDragDropNotDragging(),
        },
      }));

      const elOver = screen.getByRole('list');
      expect(elOver).not.toHaveClass(classIsDropArea);
    });

    it('should not display Shelf item as a drop target', async () => {
      const {comp} = await setup(fixtureAppState({
        ui: {
          dragDrop: fixtureDragDropNotDragging(),
          shelf: fixtureShelf({
            widgetList: [
              fixtureWidgetListItemA(),
              fixtureWidgetListItemB(),
            ]
          })
        },
      }));

      expect(comp.container.getElementsByClassName(classIsDropArea).length).toBe(0);
    });
  })

  describe('when dragging item from Palette', () => {
    it('should not set "is-dragging" style to items', async () => {
      const {comp} = await setup(fixtureAppState({
        ui: {
          dragDrop: {
            ...fixtureDragDropFromPaletteAdd()
          },
          shelf: fixtureShelf({
            widgetList: [
              fixtureWidgetListItemA(),
              fixtureWidgetListItemB(),
            ]
          })
        },
      }));

      expect(comp.container.getElementsByClassName(classIsDragging).length).toBe(0);
    });

    it('should set "is-drop-area" style to Shelf, when dragging over it and edit mode is on', async () => {
      await setup(fixtureAppState({
        ui: {
          editMode: true,
          dragDrop: {
            ...fixtureDragDropFromPaletteAdd(),
            ...fixtureDragDropOverTopBarList({listItemId: null})
          },
          shelf: fixtureShelf({
            widgetList: [
              fixtureWidgetListItemA(),
              fixtureWidgetListItemB(),
            ]
          })
        },
      }));

      const elOver = screen.getByRole('list');
      expect(elOver).toHaveClass(classIsDropArea);
    });

    it('should not set "is-drop-area" style to Shelf, when dragging over it and edit mode is off', async () => {
      await setup(fixtureAppState({
        ui: {
          editMode: false,
          dragDrop: {
            ...fixtureDragDropFromPaletteAdd(),
            ...fixtureDragDropOverTopBarList({listItemId: null})
          },
          shelf: fixtureShelf({
            widgetList: [
              fixtureWidgetListItemA(),
              fixtureWidgetListItemB(),
            ]
          })
        },
      }));

      const elOver = screen.getByRole('list');
      expect(elOver).not.toHaveClass(classIsDropArea);
    });

    it('should set "is-drop-area" style to a Shelf item, when dragging over it and edit mode is on', async () => {
      const {comp} = await setup(fixtureAppState({
        ui: {
          editMode: true,
          dragDrop: {
            ...fixtureDragDropFromPaletteAdd(),
            ...fixtureDragDropOverTopBarList({listItemId: overItemId})
          },
          shelf: fixtureShelf({
            widgetList: [
              fixtureWidgetListItemA(),
              fixtureWidgetListItemB({id:overItemId}),
              fixtureWidgetListItemC(),
              fixtureWidgetListItemD(),
            ]
          })
        },
      }));

      expect(comp.container.getElementsByClassName(classIsDropArea).length).toBe(1);
      const elOver = screen.getAllByRole('listitem')[1];
      expect(elOver).toHaveClass(classIsDropArea);
    });

    it('should not set "is-drop-area" style to a Shelf item, when dragging over it and edit mode is off', async () => {
      const {comp} = await setup(fixtureAppState({
        ui: {
          editMode: false,
          dragDrop: {
            ...fixtureDragDropFromPaletteAdd(),
            ...fixtureDragDropOverTopBarList({listItemId: overItemId})
          },
          shelf: fixtureShelf({
            widgetList: [
              fixtureWidgetListItemA(),
              fixtureWidgetListItemB({id:overItemId}),
              fixtureWidgetListItemC(),
              fixtureWidgetListItemD(),
            ]
          })
        },
      }));

      expect(comp.container.getElementsByClassName(classIsDropArea).length).toBe(0);
    });
  })

  describe('when dragging item from Shelf', () => {
    // it('should set "is-dragging" style to the dragged item, when edit mode is on', async () => {
    //   const {comp} = await setup(fixtureAppState({
    //     ui: {
    //       editMode: true,
    //       dragDrop: {
    //         ...fixtureDragDropFromTopBarList({listItemId: dragItemId})
    //       },
    //       shelf: fixtureShelf({
    //         widgetList: [
    //           fixtureWidgetListItemA(),
    //           fixtureWidgetListItemB({id:dragItemId}),
    //           fixtureWidgetListItemC(),
    //           fixtureWidgetListItemD(),
    //         ]
    //       })
    //     },
    //   }));

    //   const elDrag = screen.getAllByRole('listitem')[1];

    //   expect(comp.container.getElementsByClassName(classIsDragging).length).toBe(1);
    //   expect(elDrag).toHaveClass(classIsDragging);
    // });

    // it('should set "is-dragging" style to the dragged item, when edit mode is off', async () => {
    //   const {comp} = await setup(fixtureAppState({
    //     ui: {
    //       editMode: false,
    //       dragDrop: {
    //         ...fixtureDragDropFromTopBarList({listItemId: dragItemId})
    //       },
    //       shelf: fixtureShelf({
    //         widgetList: [
    //           fixtureWidgetListItemA(),
    //           fixtureWidgetListItemB({id:dragItemId}),
    //           fixtureWidgetListItemC(),
    //           fixtureWidgetListItemD(),
    //         ]
    //       })
    //     },
    //   }));

    //   const elDrag = screen.getAllByRole('listitem')[1];

    //   expect(comp.container.getElementsByClassName(classIsDragging).length).toBe(1);
    //   expect(elDrag).toHaveClass(classIsDragging);
    // });

    it('should set "is-drop-area" style to Shelf, when dragging over it and edit mode is on', async () => {
      await setup(fixtureAppState({
        ui: {
          editMode: true,
          dragDrop: {
            ...fixtureDragDropFromTopBarList(),
            ...fixtureDragDropOverTopBarList({listItemId: null})
          },
          shelf: fixtureShelf({
            widgetList: [
              fixtureWidgetListItemA(),
              fixtureWidgetListItemB(),
              fixtureWidgetListItemC(),
              fixtureWidgetListItemD(),
            ]
          })
        },
      }));

      const elOver = screen.getByRole('list');
      expect(elOver).toHaveClass(classIsDropArea);
    });

    it('should not set "is-drop-area" style to Shelf, when dragging over it and edit mode is off', async () => {
      await setup(fixtureAppState({
        ui: {
          editMode: false,
          dragDrop: {
            ...fixtureDragDropFromTopBarList(),
            ...fixtureDragDropOverTopBarList({listItemId: null})
          },
          shelf: fixtureShelf({
            widgetList: [
              fixtureWidgetListItemA(),
              fixtureWidgetListItemB(),
              fixtureWidgetListItemC(),
              fixtureWidgetListItemD(),
            ]
          })
        },
      }));

      const elOver = screen.getByRole('list');
      expect(elOver).not.toHaveClass(classIsDropArea);
    });

    it('should set "is-drop-area" style to a Shelf item, when dragging over it and edit mode is on', async () => {
      const {comp} = await setup(fixtureAppState({
        ui: {
          editMode: true,
          dragDrop: {
            ...fixtureDragDropFromTopBarList(),
            ...fixtureDragDropOverTopBarList({listItemId: overItemId})
          },
          shelf: fixtureShelf({
            widgetList: [
              fixtureWidgetListItemA(),
              fixtureWidgetListItemB({id: overItemId}),
              fixtureWidgetListItemC(),
              fixtureWidgetListItemD(),
            ]
          })
        },
      }));

      expect(comp.container.getElementsByClassName(classIsDropArea).length).toBe(1);
      const elOver = screen.getAllByRole('listitem')[1];
      expect(elOver).toHaveClass(classIsDropArea);
    });

    it('should not set "is-drop-area" style to a Shelf item, when dragging over it and edit mode is off', async () => {
      const {comp} = await setup(fixtureAppState({
        ui: {
          editMode: false,
          dragDrop: {
            ...fixtureDragDropFromTopBarList(),
            ...fixtureDragDropOverTopBarList({listItemId: overItemId})
          },
          shelf: fixtureShelf({
            widgetList: [
              fixtureWidgetListItemA(),
              fixtureWidgetListItemB({id: overItemId}),
              fixtureWidgetListItemC(),
              fixtureWidgetListItemD(),
            ]
          })
        },
      }));

      expect(comp.container.getElementsByClassName(classIsDropArea).length).toBe(0);
    });
  });

  describe('when dragging item from WidgetLayout', () => {
    it('should not set "is-dragging" style to items', async () => {
      const {comp} = await setup(fixtureAppState({
        ui: {
          dragDrop: {
            ...fixtureDragDropFromWorktableLayout()
          },
          shelf: fixtureShelf({
            widgetList: [
              fixtureWidgetListItemA(),
              fixtureWidgetListItemB(),
              fixtureWidgetListItemC(),
              fixtureWidgetListItemD(),
            ]
          })
        },
      }));

      expect(comp.container.getElementsByClassName(classIsDragging).length).toBe(0);
    });

    it('should set "is-drop-area" style to Shelf, when dragging over it and edit mode is on', async () => {
      await setup(fixtureAppState({
        ui: {
          editMode: true,
          dragDrop: {
            ...fixtureDragDropFromWorktableLayout(),
            ...fixtureDragDropOverTopBarList({ listItemId: null })
          },
          shelf: fixtureShelf({
            widgetList: [
              fixtureWidgetListItemA(),
              fixtureWidgetListItemB(),
              fixtureWidgetListItemC(),
              fixtureWidgetListItemD(),
            ]
          })
        },
      }));

      const elOver = screen.getByRole('list');
      expect(elOver).toHaveClass(classIsDropArea);
    });

    it('should not set "is-drop-area" style to Shelf, when dragging over it and edit mode is off', async () => {
      await setup(fixtureAppState({
        ui: {
          editMode: false,
          dragDrop: {
            ...fixtureDragDropFromWorktableLayout(),
            ...fixtureDragDropOverTopBarList({ listItemId: null })
          },
          shelf: fixtureShelf({
            widgetList: [
              fixtureWidgetListItemA(),
              fixtureWidgetListItemB(),
              fixtureWidgetListItemC(),
              fixtureWidgetListItemD(),
            ]
          })
        },
      }));

      const elOver = screen.getByRole('list');
      expect(elOver).not.toHaveClass(classIsDropArea);
    });

    it('should set "is-drop-area" style to a Shelf item, when dragging over it and edit mode is on', async () => {
      const {comp} = await setup(fixtureAppState({
        ui: {
          editMode: true,
          dragDrop: {
            ...fixtureDragDropFromWorktableLayout(),
            ...fixtureDragDropOverTopBarList({ listItemId: overItemId })
          },
          shelf: fixtureShelf({
            widgetList: [
              fixtureWidgetListItemA(),
              fixtureWidgetListItemB({id: overItemId}),
              fixtureWidgetListItemC(),
              fixtureWidgetListItemD(),
            ]
          })
        },
      }));

      expect(comp.container.getElementsByClassName(classIsDropArea).length).toBe(1);
      const elOver = screen.getAllByRole('listitem')[1];
      expect(elOver).toHaveClass(classIsDropArea);
    });

    it('should not set "is-drop-area" style to a Shelf item, when dragging over it and edit mode is off', async () => {
      const {comp} = await setup(fixtureAppState({
        ui: {
          editMode: false,
          dragDrop: {
            ...fixtureDragDropFromWorktableLayout(),
            ...fixtureDragDropOverTopBarList({ listItemId: overItemId })
          },
          shelf: fixtureShelf({
            widgetList: [
              fixtureWidgetListItemA(),
              fixtureWidgetListItemB({id: overItemId}),
              fixtureWidgetListItemC(),
              fixtureWidgetListItemD(),
            ]
          })
        },
      }));

      expect(comp.container.getElementsByClassName(classIsDropArea).length).toBe(0);
    });
  });

  it('should call a drag use case with right params, when start dragging item and edit mode is on', async () => {
    const {
      comp,
      dragWidgetFromTopBarListUseCase
    } = await setup(fixtureAppState({
      ui: {
        editMode: true,
        shelf: fixtureShelf({
          widgetList: [
            fixtureWidgetListItemA(),
            fixtureWidgetListItemB({id: dragItemId, widgetId}),
            fixtureWidgetListItemC(),
            fixtureWidgetListItemD(),
          ]
        })
      },
    }));
    const elDrag = comp.container.querySelectorAll('li > [draggable]')[1];

    fireEvent.dragStart(elDrag);

    expect(dragWidgetFromTopBarListUseCase).toBeCalledTimes(1);
    expect(dragWidgetFromTopBarListUseCase).toBeCalledWith(widgetId, dragItemId);
  });

  it('should not call a drag use case, when start dragging item and edit mode is off', async () => {
    const {
      comp,
      dragWidgetFromTopBarListUseCase
    } = await setup(fixtureAppState({
      ui: {
        editMode: false,
        shelf: fixtureShelf({
          widgetList: [
            fixtureWidgetListItemA(),
            fixtureWidgetListItemB({id: dragItemId, widgetId}),
            fixtureWidgetListItemC(),
            fixtureWidgetListItemD(),
          ]
        })
      },
    }));
    const elDrag = comp.container.querySelectorAll('li > [draggable]')[1];

    fireEvent.dragStart(elDrag);

    expect(dragWidgetFromTopBarListUseCase).not.toBeCalled();
  });

  it('should call a drag over/leave use case with right params, when dragging item in/over/out Shelf', async () => {
    const {
      dragOverTopBarListUseCase,
      dragLeaveTargetUseCase
    } = await setup(fixtureAppState({
      ui: {
        shelf: fixtureShelf({
          widgetList: [
            fixtureWidgetListItemA(),
            fixtureWidgetListItemB(),
            fixtureWidgetListItemC(),
            fixtureWidgetListItemD(),
          ]
        })
      },
    }));
    const elOver = screen.getByRole('list');

    fireEvent.dragEnter(elOver);
    expect(dragLeaveTargetUseCase).toBeCalledTimes(0);
    expect(dragOverTopBarListUseCase).toBeCalledTimes(1);

    fireEvent.dragOver(elOver);
    expect(dragLeaveTargetUseCase).toBeCalledTimes(0);
    expect(dragOverTopBarListUseCase).toBeCalledTimes(2);

    fireEvent.dragLeave(elOver);
    expect(dragLeaveTargetUseCase).toBeCalledTimes(1);
    expect(dragOverTopBarListUseCase).toBeCalledTimes(2);

    expect(dragLeaveTargetUseCase).toBeCalledWith();
    expect(dragOverTopBarListUseCase.mock.calls).toEqual([
      [null],
      [null]
    ]);
  });

  it('should call a drag over/leave use case with right params, when dragging item in/over/out Shelf item', async () => {
    const {
      comp,
      dragOverTopBarListUseCase,
      dragLeaveTargetUseCase
    } = await setup(fixtureAppState({
      ui: {
        shelf: fixtureShelf({
          widgetList: [
            fixtureWidgetListItemA(),
            fixtureWidgetListItemB({id: overItemId}),
            fixtureWidgetListItemC(),
            fixtureWidgetListItemD(),
          ]
        })
      },
    }));
    const elOver = comp.container.querySelectorAll('li > [draggable]')[1];

    fireEvent.dragEnter(elOver);
    expect(dragOverTopBarListUseCase).toBeCalledTimes(1);

    fireEvent.dragOver(elOver);
    expect(dragOverTopBarListUseCase).toBeCalledTimes(2);

    fireEvent.dragLeave(elOver);
    expect(dragLeaveTargetUseCase).toBeCalledTimes(1);

    expect(dragOverTopBarListUseCase.mock.calls).toEqual([
      [overItemId],
      [overItemId]
    ]);
    expect(dragLeaveTargetUseCase).toBeCalledWith();
  });

  it('should call a drag end use case with right params, when end dragging item', async () => {
    const {
      comp,
      dragEndUseCase
    } = await setup(fixtureAppState({
      ui: {
        shelf: fixtureShelf({
          widgetList: [
            fixtureWidgetListItemA(),
            fixtureWidgetListItemB(),
            fixtureWidgetListItemC(),
            fixtureWidgetListItemD(),
          ]
        })
      },
    }));
    const elDrag = comp.container.querySelectorAll('li > [draggable]')[1];

    fireEvent.dragEnd(elDrag);

    expect(dragEndUseCase).toBeCalledTimes(1);
    expect(dragEndUseCase).toBeCalledWith();
  });

  it('should call a drop use case with right params, when dropping item over Shelf', async () => {
    const {
      dropOnTopBarListUseCase
    } = await setup(fixtureAppState({
      ui: {
        shelf: fixtureShelf({
          widgetList: [
            fixtureWidgetListItemA(),
            fixtureWidgetListItemB(),
            fixtureWidgetListItemC(),
            fixtureWidgetListItemD(),
          ]
        })
      },
    }));
    const elOver = screen.getByRole('list');

    fireEvent.drop(elOver);
    expect(dropOnTopBarListUseCase).toBeCalledTimes(1);
    expect(dropOnTopBarListUseCase).toBeCalledWith(null);
  });

  it('should call a drop use case with right params, when dropping item over Shelf item', async () => {
    const {
      comp,
      dropOnTopBarListUseCase
    } = await setup(fixtureAppState({
      ui: {
        shelf: fixtureShelf({
          widgetList: [
            fixtureWidgetListItemA(),
            fixtureWidgetListItemB({id: overItemId}),
            fixtureWidgetListItemC(),
            fixtureWidgetListItemD(),
          ]
        })
      },
    }));
    const elOver = comp.container.querySelectorAll('li > [draggable]')[1];

    fireEvent.drop(elOver);
    expect(dropOnTopBarListUseCase).toBeCalledTimes(1);
    expect(dropOnTopBarListUseCase).toBeCalledWith(overItemId);
  });

})
