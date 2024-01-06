/*
 * Copyright: (c) 2024, Alex Kaul
 * GNU General Public License v3.0 or later (see COPYING or https://www.gnu.org/licenses/gpl-3.0.txt)
 */

import { DragDropFromPaletteState, DragDropFromTopBarListState, DragDropFromWorkflowSwitcherState, DragDropFromWorktableLayoutState, DragDropOverTopBarListState, DragDropOverWorkflowSwitcherState, DragDropOverWorktableLayoutState, DragDropState } from '@/base/state/ui'
import { deepFreeze } from '@common/helpers/deepFreeze'

const dragDropFromPalette: DragDropFromPaletteState = {
  widgetTypeId: 'SOME-WIDGET-TYPE'
}
const dragDropFromTopBarList: DragDropFromTopBarListState = {
  listItemId: 'SOME-LIST-ITEM', widgetId: 'SOME-WIDGET'
}
const dragDropFromWorkflowSwitcher: DragDropFromWorkflowSwitcherState = {
  projectId: 'SOME-PROJECT', workflowId: 'SOME-WORKFLOW'
}
const dragDropFromWorktableLayout: DragDropFromWorktableLayoutState = {
  layoutItemId: 'SOME-LAYOUT-ITEM', layoutItemWH: { w: 1, h: 1 }, widgetId: 'SOME-WIDGET', workflowId: 'SOME-WORKFLOW'
}
const dragDropOverTopBarList: DragDropOverTopBarListState = {
  listItemId: 'SOME-LIST-ITEM'
}
const dragDropOverWorkflowSwitcher: DragDropOverWorkflowSwitcherState = {
  workflowId: 'SOME-WORKFLOW-ID'
}
const dragDropOverWorktableLayout: DragDropOverWorktableLayoutState = {
  layoutItemId: 'SOME-LAYOUT-ITEM', layoutItemXY: { x: 1, y: 1 }
}

export const fixtureDragDropNotDragging = (): DragDropState => deepFreeze({});
export const fixtureDragDropFromPalette = (testData?: Partial<DragDropFromPaletteState>): DragDropState => deepFreeze({
  from: {
    palette: {
      ...dragDropFromPalette,
      ...testData
    }
  }
})
export const fixtureDragDropFromTopBarList = (testData?: Partial<DragDropFromTopBarListState>): DragDropState => deepFreeze({
  from: {
    topBarList: {
      ...dragDropFromTopBarList,
      ...testData
    }
  }
})
export const fixtureDragDropFromWorkflowSwitcher = (testData?: Partial<DragDropFromWorkflowSwitcherState>): DragDropState => deepFreeze({
  from: {
    workflowSwitcher: {
      ...dragDropFromWorkflowSwitcher,
      ...testData
    }
  }
})

interface DragDropFromWorktableLayoutStateTestData extends Partial<Omit<DragDropFromWorktableLayoutState, 'layoutItemWH'>> {
  layoutItemWH?: Partial<DragDropFromWorktableLayoutState['layoutItemWH']>;
}
export const fixtureDragDropFromWorktableLayout = (testData?: DragDropFromWorktableLayoutStateTestData): DragDropState => deepFreeze({
  from: {
    worktableLayout: {
      ...dragDropFromWorktableLayout,
      ...testData,
      layoutItemWH: {
        ...dragDropFromWorktableLayout.layoutItemWH,
        ...testData?.layoutItemWH
      }
    }
  }
})
export const fixtureDragDropOverTopBarList = (testData?: Partial<DragDropOverTopBarListState>): DragDropState => deepFreeze({
  over: {
    topBarList: {
      ...dragDropOverTopBarList,
      ...testData,
    }
  }
})
export const fixtureDragDropOverWorkflowSwitcher = (testData?: Partial<DragDropOverWorkflowSwitcherState>): DragDropState => deepFreeze({
  over: {
    workflowSwitcher: {
      ...dragDropOverWorkflowSwitcher,
      ...testData,
    }
  }
})

interface DragDropOverWorktableLayoutStateTestData extends Partial<Omit<DragDropOverWorktableLayoutState, 'layoutItemXY'>> {
  layoutItemXY?: Partial<DragDropOverWorktableLayoutState['layoutItemXY']>;
}
export const fixtureDragDropOverWorktableLayout = (testData?: DragDropOverWorktableLayoutStateTestData): DragDropState => deepFreeze({
  over: {
    worktableLayout: {
      ...dragDropOverWorktableLayout,
      ...testData,
      layoutItemXY: {
        ...dragDropOverWorktableLayout.layoutItemXY,
        ...testData?.layoutItemXY
      }
    }
  }
})
