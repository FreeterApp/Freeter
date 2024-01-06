/*
 * Copyright: (c) 2024, Alex Kaul
 * GNU General Public License v3.0 or later (see COPYING or https://www.gnu.org/licenses/gpl-3.0.txt)
 */

import { render, screen } from '@testing-library/react';
import { createWidgetLayoutComponent } from '@/ui/components/worktable/widgetLayout/widgetLayout';
import { WidgetLayoutProps, createWidgetLayoutViewModelHook } from '@/ui/components/worktable/widgetLayout/widgetLayoutViewModel';
import { createWidgetLayoutItemComponent } from '@/ui/components/worktable/widgetLayout/widgetLayoutItem';
import { WidgetByIdComponent } from '@/ui/components/widget/widgetById';
import { fixtureWidgetLayoutItemA, fixtureWidgetLayoutItemB, fixtureWidgetLayoutItemC, fixtureWidgetLayoutItemD } from '@tests/base/fixtures/widgetLayout';
import { fixtureDragDropFromPalette, fixtureDragDropFromTopBarList, fixtureDragDropFromWorktableLayout, fixtureDragDropOverWorktableLayout } from '@tests/base/state/fixtures/dragDropState';
import { fixtureWidgetTypeA } from '@tests/base/fixtures/widgetType';

const widgetLayoutTestId = 'widget-layout';
const widgetLayoutItemTestId = 'widget-layout-item';
const widgetLayoutItemGhostTestId = 'widget-layout-item-ghost';
const widgetLayoutItemResizeHandleTestId = 'widget-layout-item-resize-handle';
const classIsVisible = 'is-visible';
const classIsDragging = 'is-dragging';
const classIsWidget = 'is-widget';
// const classIsResizing = 'is-resizing';
const dragItemId = 'DRAG-ITEM-ID';
// const resizeItemId = 'RESIZE-ITEM-ID';
const wgtTypeId = 'WGT-TYPE-ID';

async function setup(
  props: Partial<WidgetLayoutProps>
) {
  const compProps: WidgetLayoutProps = {
    dndDraggingFrom: undefined,
    dndDraggingWidgetType: undefined,
    dndOverWorktableLayout: undefined,
    isEditMode: false,
    isVisible: true,
    layoutItems: [],
    projectId: 'P-ID',
    resizingItem: undefined,
    workflowId: 'W-ID',
    ...props
  }
  const dragEndUseCase = jest.fn();
  const dragLeaveTargetUseCase = jest.fn();
  const dragOverWorktableLayoutUseCase = jest.fn();
  const dragWidgetFromWorktableLayoutUseCase = jest.fn();
  const dropOnWorktableLayoutUseCase = jest.fn();
  const resizeLayoutItemEndUseCase = jest.fn();
  const resizeLayoutItemStartUseCase = jest.fn();
  const resizeLayoutItemUseCase = jest.fn();

  const useWidgetLayoutViewModel = createWidgetLayoutViewModelHook({
    dragEndUseCase,
    dragLeaveTargetUseCase,
    dragOverWorktableLayoutUseCase,
    dragWidgetFromWorktableLayoutUseCase,
    dropOnWorktableLayoutUseCase,
    resizeLayoutItemEndUseCase,
    resizeLayoutItemStartUseCase,
    resizeLayoutItemUseCase,
  })

  const WidgetById: WidgetByIdComponent = props => <div className='is-widget'>{`WIDGET-${props.id}`}</div>;

  const WidgetLayoutItem = createWidgetLayoutItemComponent({
    WidgetById
  })

  const WidgetLayout = createWidgetLayoutComponent({
    WidgetLayoutItem,
    useWidgetLayoutViewModel
  })
  const comp = render(
    <WidgetLayout {...compProps}/>
  );

  return {
    comp,
    dragEndUseCase,
    dragLeaveTargetUseCase,
    dragOverWorktableLayoutUseCase,
    dragWidgetFromWorktableLayoutUseCase,
    dropOnWorktableLayoutUseCase,
    resizeLayoutItemEndUseCase,
    resizeLayoutItemStartUseCase,
    resizeLayoutItemUseCase,
  }
}

describe('<WidgetLayout />', () => {
  describe('when isVisible is true', () => {
    it('should be rendered with "is-visible" style', async () => {
      await setup({
        isVisible: true,
        layoutItems: [
          fixtureWidgetLayoutItemA(),
        ]
      })

      expect(screen.getByTestId(widgetLayoutTestId)).toHaveClass(classIsVisible);
    });

    it('should not have the inert attr', async () => {
      await setup({
        isVisible: true,
        layoutItems: [
          fixtureWidgetLayoutItemA(),
        ]
      })

      expect(screen.getByTestId(widgetLayoutTestId)).not.toHaveAttribute('inert');
    })
  })

  describe('when isVisible is false', () => {
    it('should be rendered without "is-visible" style', async () => {
      await setup({
        isVisible: false,
        layoutItems: [
          fixtureWidgetLayoutItemA(),
        ]
      })

      expect(screen.getByTestId(widgetLayoutTestId)).not.toHaveClass(classIsVisible);
    });

    it('should have the inert attr', async () => {
      await setup({
        isVisible: false,
        layoutItems: [
          fixtureWidgetLayoutItemA(),
        ]
      })

      expect(screen.getByTestId(widgetLayoutTestId)).toHaveAttribute('inert');
    })

    it('should not display "No Widgets" text', async () => {
      await setup({
        isVisible: false,
        layoutItems: [],
        isEditMode: false
      })

      expect(screen.queryByText(/The workflow is empty/i)).not.toBeInTheDocument();
    });
  })

  describe('when there are no items on layout', () => {
    it('should display "No Widgets" text, when edit mode is off', async () => {
      await setup({layoutItems:[], isEditMode: false})
      expect(screen.getByText(/The workflow is empty/i)).toBeInTheDocument();
      expect(screen.queryByText(/Click or drag a widget/i)).not.toBeInTheDocument();
    });

    it('should replace "No Widgets" with "Click or drag" text, when edit mode is on', async () => {
      await setup({layoutItems:[], isEditMode: true})
      expect(screen.queryByText(/The workflow is empty/i)).not.toBeInTheDocument();
      expect(screen.getByText(/Click or drag a widget/i)).toBeInTheDocument();
    });

    it('should display 0 items', async () => {
      await setup({layoutItems:[]})
      expect(screen.queryAllByTestId(widgetLayoutItemTestId).length).toBe(0);
    });
  })

  describe('when there are items on layout', () => {
    it('should not display "No Widgets" text', async () => {
      await setup({
        layoutItems: [
          fixtureWidgetLayoutItemA(),
          fixtureWidgetLayoutItemB(),
          fixtureWidgetLayoutItemC(),
          fixtureWidgetLayoutItemD(),
        ],
        isEditMode: false
      })

      expect(screen.queryByText(/The workflow is empty/i)).not.toBeInTheDocument();
    });

    it('should display all of them', async () => {
      await setup({
        layoutItems: [
          fixtureWidgetLayoutItemA(),
          fixtureWidgetLayoutItemB(),
          fixtureWidgetLayoutItemC(),
          fixtureWidgetLayoutItemD(),
        ]
      })
      expect(screen.getAllByTestId(widgetLayoutItemTestId).length).toBe(4);
    });

    it('should display Widget components with right id params', async () => {
      const layoutItems = [
        fixtureWidgetLayoutItemA(),
        fixtureWidgetLayoutItemB(),
        fixtureWidgetLayoutItemC(),
        fixtureWidgetLayoutItemD(),
      ];
      const {comp} = await setup({layoutItems})

      expect(comp.container.getElementsByClassName(classIsWidget).length).toBe(4);
      expect(screen.getAllByText(`WIDGET-${layoutItems[0].widgetId}`).length).toBe(1);
      expect(screen.getAllByText(`WIDGET-${layoutItems[1].widgetId}`).length).toBe(1);
      expect(screen.getAllByText(`WIDGET-${layoutItems[2].widgetId}`).length).toBe(1);
      expect(screen.getAllByText(`WIDGET-${layoutItems[3].widgetId}`).length).toBe(1);
    })

    it('should make items draggable, when edit mode is on', async () => {
      const {comp} = await setup({
        isEditMode: true,
        layoutItems: [
          fixtureWidgetLayoutItemA(),
          fixtureWidgetLayoutItemB(),
        ]
      })

      expect(comp.container.querySelectorAll('[draggable="true"]').length).toBe(2);
      const items = screen.getAllByTestId(widgetLayoutItemTestId);
      expect(items[0]).toHaveAttribute('draggable', 'true');
      expect(items[1]).toHaveAttribute('draggable', 'true');
    });

    it('should not make items draggable, when edit mode is off', async () => {
      const {comp} = await setup({
        isEditMode: false,
        layoutItems: [
          fixtureWidgetLayoutItemA(),
          fixtureWidgetLayoutItemB(),
        ]
      })

      expect(comp.container.querySelectorAll('[draggable="false"]').length).toBe(2);
      const items = screen.getAllByTestId(widgetLayoutItemTestId);
      expect(items[0]).toHaveAttribute('draggable', 'false');
      expect(items[1]).toHaveAttribute('draggable', 'false');
    });

    it('should display resize handles, when edit mode is on', async () => {
      await setup({
        isEditMode: true,
        layoutItems: [
          fixtureWidgetLayoutItemA(),
          fixtureWidgetLayoutItemB(),
        ]
      })

      expect(screen.queryAllByTestId(widgetLayoutItemResizeHandleTestId).length).toBe(2 * 8);
    });

    it('should not display resize handles, when edit mode is off', async () => {
      await setup({
        isEditMode: false,
        layoutItems: [
          fixtureWidgetLayoutItemA(),
          fixtureWidgetLayoutItemB(),
        ]
      })

      expect(screen.queryAllByTestId(widgetLayoutItemResizeHandleTestId).length).toBe(2 * 0);
    });
  })

  describe('when not dragging item', () => {
    it('should display items without "is-dragging" style', async () => {
      const {comp} = await setup({
        isEditMode: true,
        layoutItems: [
          fixtureWidgetLayoutItemA(),
          fixtureWidgetLayoutItemB(),
        ],
        dndDraggingFrom: undefined,
        dndDraggingWidgetType: undefined,
        dndOverWorktableLayout: undefined
      })

      expect(comp.container.getElementsByClassName(classIsDragging).length).toBe(0);
    });

    it('should not display an item ghost', async () => {
      await setup({
        isEditMode: true,
        layoutItems: [
          fixtureWidgetLayoutItemA(),
          fixtureWidgetLayoutItemB(),
        ],
        dndDraggingFrom: undefined,
        dndDraggingWidgetType: undefined,
        dndOverWorktableLayout: undefined
      })

      expect(screen.queryAllByTestId(widgetLayoutItemGhostTestId).length).toBe(0);
    });
  })

  describe('when dragging item from Palette', () => {
    it('should not set "is-dragging" style to items', async () => {
      const {comp} = await setup({
        isEditMode: true,
        layoutItems: [
          fixtureWidgetLayoutItemA(),
          fixtureWidgetLayoutItemB(),
        ],
        dndDraggingWidgetType: fixtureWidgetTypeA({id: wgtTypeId}),
        dndDraggingFrom: fixtureDragDropFromPalette().from,
        dndOverWorktableLayout: undefined
      })

      expect(comp.container.getElementsByClassName(classIsDragging).length).toBe(0);
    });

    describe('when dragging over Widget Layout', () => {
      it('should display an item ghost, when dragging over Widget Layout and edit mode is on', async () => {
        await setup({
          isEditMode: true,
          layoutItems: [
            fixtureWidgetLayoutItemA(),
            fixtureWidgetLayoutItemB(),
          ],
          dndDraggingWidgetType: fixtureWidgetTypeA({id: wgtTypeId}),
          dndDraggingFrom: fixtureDragDropFromPalette().from,
          dndOverWorktableLayout: fixtureDragDropOverWorktableLayout().over?.worktableLayout
        })

        expect(screen.queryAllByTestId(widgetLayoutItemGhostTestId).length).toBe(1);
      });

      it('should not display an item ghost, when dragging over Widget Layout and edit mode is off', async () => {
        await setup({
          isEditMode: false,
          layoutItems: [
            fixtureWidgetLayoutItemA(),
            fixtureWidgetLayoutItemB(),
          ],
          dndDraggingWidgetType: fixtureWidgetTypeA({id: wgtTypeId}),
          dndDraggingFrom: fixtureDragDropFromPalette().from,
          dndOverWorktableLayout: fixtureDragDropOverWorktableLayout().over?.worktableLayout
        })

        expect(screen.queryAllByTestId(widgetLayoutItemGhostTestId).length).toBe(0);
      });

      it('should add an item with "is-dragging" style, when edit mode is on', async () => {
        const {comp} = await setup({
          isEditMode: true,
          layoutItems: [
            fixtureWidgetLayoutItemA(),
            fixtureWidgetLayoutItemB(),
          ],
          dndDraggingWidgetType: fixtureWidgetTypeA({id: wgtTypeId}),
          dndDraggingFrom: fixtureDragDropFromPalette().from,
          dndOverWorktableLayout: fixtureDragDropOverWorktableLayout().over?.worktableLayout
        })

        expect(screen.getAllByTestId(widgetLayoutItemTestId).length).toBe(2 + 1);
        expect(comp.container.getElementsByClassName(classIsDragging).length).toBe(1);
      });

      it('should not add an item with "is-dragging" style, when edit mode is off', async () => {
        const {comp} = await setup({
          isEditMode: false,
          layoutItems: [
            fixtureWidgetLayoutItemA(),
            fixtureWidgetLayoutItemB(),
          ],
          dndDraggingWidgetType: fixtureWidgetTypeA({id: wgtTypeId}),
          dndDraggingFrom: fixtureDragDropFromPalette().from,
          dndOverWorktableLayout: fixtureDragDropOverWorktableLayout().over?.worktableLayout
        })

        expect(screen.getAllByTestId(widgetLayoutItemTestId).length).toBe(2 + 0);
        expect(comp.container.getElementsByClassName(classIsDragging).length).toBe(0);
      });
    })
  })

  describe('when dragging item from Shelf', () => {
    it('should not set "is-dragging" style to items', async () => {
      const {comp} = await setup({
        layoutItems: [
          fixtureWidgetLayoutItemA(),
          fixtureWidgetLayoutItemB(),
        ],
        dndDraggingWidgetType: fixtureWidgetTypeA({id: wgtTypeId}),
        dndDraggingFrom: fixtureDragDropFromTopBarList().from
      })

      expect(comp.container.getElementsByClassName(classIsDragging).length).toBe(0);
    });

    describe('when dragging over Widget Layout', () => {
      it('should display an item ghost, if dragging over Widget Layout and edit mode is on', async () => {
        await setup({
          isEditMode: true,
          layoutItems: [
            fixtureWidgetLayoutItemA(),
            fixtureWidgetLayoutItemB(),
          ],
          dndDraggingWidgetType: fixtureWidgetTypeA({id: wgtTypeId}),
          dndDraggingFrom: fixtureDragDropFromTopBarList().from,
          dndOverWorktableLayout: fixtureDragDropOverWorktableLayout().over?.worktableLayout
        })

        expect(screen.queryAllByTestId(widgetLayoutItemGhostTestId).length).toBe(1);
      });

      it('should not display an item ghost, if dragging over Widget Layout and edit mode is off', async () => {
        await setup({
          isEditMode: false,
          layoutItems: [
            fixtureWidgetLayoutItemA(),
            fixtureWidgetLayoutItemB(),
          ],
          dndDraggingWidgetType: fixtureWidgetTypeA({id: wgtTypeId}),
          dndDraggingFrom: fixtureDragDropFromTopBarList().from,
          dndOverWorktableLayout: fixtureDragDropOverWorktableLayout().over?.worktableLayout
        })

        expect(screen.queryAllByTestId(widgetLayoutItemGhostTestId).length).toBe(0);
      });

      it('should add an item with "is-dragging" style, when edit mode is on', async () => {
        const {comp} = await setup({
          isEditMode: true,
          layoutItems: [
            fixtureWidgetLayoutItemA(),
            fixtureWidgetLayoutItemB(),
          ],
          dndDraggingWidgetType: fixtureWidgetTypeA({id: wgtTypeId}),
          dndDraggingFrom: fixtureDragDropFromTopBarList().from,
          dndOverWorktableLayout: fixtureDragDropOverWorktableLayout().over?.worktableLayout
        })

        expect(screen.getAllByTestId(widgetLayoutItemTestId).length).toBe(2 + 1);
        expect(comp.container.getElementsByClassName(classIsDragging).length).toBe(1);
      });

      it('should not add an item with "is-dragging" style, when edit mode is off', async () => {
        const {comp} = await setup({
          isEditMode: false,
          layoutItems: [
            fixtureWidgetLayoutItemA(),
            fixtureWidgetLayoutItemB(),
          ],
          dndDraggingWidgetType: fixtureWidgetTypeA({id: wgtTypeId}),
          dndDraggingFrom: fixtureDragDropFromTopBarList().from,
          dndOverWorktableLayout: fixtureDragDropOverWorktableLayout().over?.worktableLayout
        })

        expect(screen.getAllByTestId(widgetLayoutItemTestId).length).toBe(2 + 0);
        expect(comp.container.getElementsByClassName(classIsDragging).length).toBe(0);
      });
    })
  });

  describe('when dragging item from WidgetLayout', () => {
    it('should set "is-dragging" style to a dragged item, when edit mode is on', async () => {
      const {comp} = await setup({
        isEditMode: true,
        layoutItems: [
          fixtureWidgetLayoutItemA(),
          fixtureWidgetLayoutItemB({ id: dragItemId}),
          fixtureWidgetLayoutItemC(),
        ],
        dndDraggingWidgetType: fixtureWidgetTypeA({id: wgtTypeId}),
        dndDraggingFrom: fixtureDragDropFromWorktableLayout({layoutItemId: dragItemId}).from
      })
      const elDrag = screen.getAllByTestId(widgetLayoutItemTestId)[1];

      expect(comp.container.getElementsByClassName(classIsDragging).length).toBe(1);
      expect(elDrag).toHaveClass(classIsDragging);
    });

    it('should set "is-dragging" style to a dragged item, when edit mode is off', async () => {
      const {comp} = await setup({
        isEditMode: false,
        layoutItems: [
          fixtureWidgetLayoutItemA(),
          fixtureWidgetLayoutItemB({ id: dragItemId}),
          fixtureWidgetLayoutItemC(),
        ],
        dndDraggingWidgetType: fixtureWidgetTypeA({id: wgtTypeId}),
        dndDraggingFrom: fixtureDragDropFromWorktableLayout({layoutItemId: dragItemId}).from
      })
      const elDrag = screen.getAllByTestId(widgetLayoutItemTestId)[1];

      expect(comp.container.getElementsByClassName(classIsDragging).length).toBe(1);
      expect(elDrag).toHaveClass(classIsDragging);
    });

    it('should display an item ghost, when dragging over Widget Layout and edit mode is on', async () => {
      await setup({
        isEditMode: true,
        layoutItems: [
          fixtureWidgetLayoutItemA(),
          fixtureWidgetLayoutItemB({ id: dragItemId}),
          fixtureWidgetLayoutItemC(),
        ],
        dndDraggingWidgetType: fixtureWidgetTypeA({id: wgtTypeId}),
        dndDraggingFrom: fixtureDragDropFromWorktableLayout().from,
        dndOverWorktableLayout: fixtureDragDropOverWorktableLayout({layoutItemId: dragItemId}).over?.worktableLayout
      })

      expect(screen.queryAllByTestId(widgetLayoutItemGhostTestId).length).toBe(1);
    });

    it('should not display an item ghost, when dragging over Widget Layout and edit mode is off', async () => {
      await setup({
        isEditMode: false,
        layoutItems: [
          fixtureWidgetLayoutItemA(),
          fixtureWidgetLayoutItemB({ id: dragItemId}),
          fixtureWidgetLayoutItemC(),
        ],
        dndDraggingWidgetType: fixtureWidgetTypeA({id: wgtTypeId}),
        dndDraggingFrom: fixtureDragDropFromWorktableLayout().from,
        dndOverWorktableLayout: fixtureDragDropOverWorktableLayout({layoutItemId: dragItemId}).over?.worktableLayout
      })

      expect(screen.queryAllByTestId(widgetLayoutItemGhostTestId).length).toBe(0);
    });
  });

  /*
  TODO:

  describe('when resizing item', () => {
    it('should display the item with "is-resizing" style', () => {
      //
    });

    it('should display an item ghost, if dragging over Widget Layout', () => {
      //
    });
  });
  */

  /*
  TODO: tests for usecase calls on drag/resize events
  */


});
