/*
 * Copyright: (c) 2024, Alex Kaul
 * GNU General Public License v3.0 or later (see COPYING or https://www.gnu.org/licenses/gpl-3.0.txt)
 */

import { render, screen, fireEvent } from '@testing-library/react';
import { createPaletteComponent } from '@/ui/components/palette/palette';
import { createPaletteViewModelHook } from '@/ui/components/palette/paletteViewModel';
import { createDragEndUseCase } from '@/application/useCases/dragDrop/dragEnd';
import { createDragWidgetFromPaletteUseCase } from '@/application/useCases/dragDrop/dragWidgetFromPalette';
import { createAppStateHook } from '@/ui/hooks/appState';
import { fixtureAppState } from '@tests/base/state/fixtures/appState';
import { fixtureWidgetTypeAInColl, fixtureWidgetTypeBInColl, fixtureWidgetTypeCInColl, fixtureWidgetTypeDInColl, fixtureProjectAInColl } from '@tests/base/state/fixtures/entitiesState';
import { fixtureDragDropNotDragging } from '@tests/base/state/fixtures/dragDropState';
import { fixturePalette } from '@tests/base/state/fixtures/palette';
import { fixtureAppStore } from '@tests/data/fixtures/appStore';
import { AppState } from '@/base/state/app';
import { fixtureProjectSwitcher } from '@tests/base/state/fixtures/projectSwitcher';
import { fixtureWorktableNotResizing, fixtureWorktableResizingItem } from '@tests/base/state/fixtures/worktable';

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
  const usePaletteViewModel = createPaletteViewModelHook({
    useAppState,
    dragEndUseCase,
    dragWidgetFromPaletteUseCase,
    addWidgetToWorkflowWithPaletteUseCase
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
    addWidgetToWorkflowWithPaletteUseCase
  }
}

const classIsDragging = 'is-dragging';
const classIsHidden = 'is-hidden';
const dragItemId = 'DRAG-ITEM-ID';

describe('<Palette />', () => {
  it('should display a list', async () => {
    await setup(fixtureAppState({}));
    expect(screen.getByRole('list')).toBeInTheDocument();
  });

  it('should not add "is-hidden" class to the list, when "dragging from" state is undefined', async () => {
    await setup(fixtureAppState({
      ui: {
        dragDrop: {
          from: undefined
        }
      }
    }));

    expect(screen.getByRole('list')).not.toHaveClass(classIsHidden);
  });

  it('should add "is-hidden" class to the list, when "dragging from" state is defined', async () => {
    await setup(fixtureAppState({
      ui: {
        dragDrop: {
          from: {}
        }
      }
    }));

    expect(screen.getByRole('list')).toHaveClass(classIsHidden);
  });

  it('should not add "is-hidden" class to the list, when not resizing an item in the worktable', async () => {
    await setup(fixtureAppState({
      ui: {
        worktable: fixtureWorktableNotResizing()
      }
    }));

    expect(screen.getByRole('list')).not.toHaveClass(classIsHidden);
  });

  it('should add "is-hidden" class to the list, when resizing an item in the worktable', async () => {
    await setup(fixtureAppState({
      ui: {
        worktable: fixtureWorktableResizingItem()
      }
    }));

    expect(screen.getByRole('list')).toHaveClass(classIsHidden);
  });

  it('should display 0 items, when there is no widget types', async () => {
    await setup(fixtureAppState({
      ui: {
        palette: {
          widgetTypeIds: []
        }
      }
    }))
    expect(screen.queryAllByRole('listitem').length).toBe(0);
  });

  it('should display 4 items, when there are 4 widget types', async () => {
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
    expect(screen.getAllByRole('listitem').length).toBe(4);
  });

  it('should display items without "is-dragging" style, when not dragging', async () => {
    const {comp} = await setup(fixtureAppState({
      entities: {
        widgetTypes: {
          ...fixtureWidgetTypeAInColl({id: 'WT-A'}),
          ...fixtureWidgetTypeBInColl({id: 'WT-B'}),
          ...fixtureWidgetTypeCInColl({id: 'WT-C'}),
          ...fixtureWidgetTypeDInColl({id: 'WT-D'}),
        }
      },
      ui: {
        dragDrop: fixtureDragDropNotDragging(),
        palette: fixturePalette({
          widgetTypeIds: ['WT-A', 'WT-B', 'WT-C', 'WT-D']
        })
      }
    }))
    expect(comp.container.getElementsByClassName(classIsDragging).length).toBe(0);
  });

  // it('should display a dragged item with "is-dragging" style', async () => {
  //   const {comp} = await setup(fixtureAppState({
  //     entities: {
  //       widgetTypes: {
  //         ...fixtureWidgetTypeAInColl({id: 'WT-A'}),
  //         ...fixtureWidgetTypeBInColl({id: dragItemId}),
  //         ...fixtureWidgetTypeCInColl({id: 'WT-C'}),
  //         ...fixtureWidgetTypeDInColl({id: 'WT-D'}),
  //       }
  //     },
  //     ui: {
  //       dragDrop: {
  //         ...fixtureDragDropFromPalette({widgetTypeId: dragItemId})
  //       },
  //       palette: fixturePalette({
  //         widgetTypeIds: ['WT-A', dragItemId, 'WT-C', 'WT-D']
  //       })
  //     }
  //   }))

  //   const elDrag = screen.getAllByRole('listitem')[1];

  //   expect(comp.container.getElementsByClassName(classIsDragging).length).toBe(1);
  //   expect(elDrag).toHaveClass(classIsDragging);
  // });

  it('should call right use cases with right params, when start/end dragging item', async () => {
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
    const elDrag = screen.getAllByRole('listitem')[1];

    fireEvent.dragStart(elDrag);

    expect(dragWidgetFromPaletteUseCase).toBeCalledTimes(1);
    expect(dragWidgetFromPaletteUseCase).toBeCalledWith(dragItemId);
    expect(dragEndUseCase).toBeCalledTimes(0);

    fireEvent.dragEnd(elDrag);

    expect(dragWidgetFromPaletteUseCase).toBeCalledTimes(1);
    expect(dragEndUseCase).toBeCalledTimes(1);
  });

  it('should call right use case with right params, when clicking item', async () => {
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
    const elClick = screen.getAllByRole('listitem')[1];

    expect(addWidgetToWorkflowWithPaletteUseCase).toBeCalledTimes(0);

    fireEvent.click(elClick);

    expect(addWidgetToWorkflowWithPaletteUseCase).toBeCalledTimes(1);
    expect(addWidgetToWorkflowWithPaletteUseCase).toBeCalledWith(widgetTypeId, workflowId);
  });

})
