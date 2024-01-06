/*
 * Copyright: (c) 2024, Alex Kaul
 * GNU General Public License v3.0 or later (see COPYING or https://www.gnu.org/licenses/gpl-3.0.txt)
 */

import { WorktableStateResizingItemEdgeX, WorktableStateResizingItemEdgeY } from '@/base/state/ui';
import { resizeLayoutItemCalc } from '@/application/useCases/worktable/resizeLayoutItem/calc';
import { fixtureWidgetLayoutItemA } from '@tests/base/fixtures/widgetLayout';

describe('resizeLayoutItemCalc()', () => {
  it('should return the original layout if deltas are both undefined', () => {
    const id = 'TEST-ID';
    const widgetLayout = [fixtureWidgetLayoutItemA({ id })];

    const newWidgetLayout = resizeLayoutItemCalc(widgetLayout, id, {}, { w: 1, h: 1 }, { x: WorktableStateResizingItemEdgeX.Left });

    expect(newWidgetLayout).toBe(widgetLayout);
  })

  it('should return the original layout if no item with the provided id exists', () => {
    const widgetLayout = [fixtureWidgetLayoutItemA()];

    const newWidgetLayout = resizeLayoutItemCalc(widgetLayout, 'NO-SUCH-ID', {}, { w: 1, h: 1 }, { x: WorktableStateResizingItemEdgeX.Left });

    expect(newWidgetLayout).toBe(widgetLayout);
  })

  it('should resize item with the provided positive deltas and edges', () => {
    const id = 'TEST-ID';
    const rect = { x: 1, w: 2, y: 1, h: 2 };
    const deltasX = { x: 1 };
    const deltasY = { y: 1 };
    const deltasXY = { x: 1, y: 1 };
    const edgesLeft = { x: WorktableStateResizingItemEdgeX.Left };
    const expectRectLeft = { ...rect, x: 0, w: 3 }
    const edgesRight = { x: WorktableStateResizingItemEdgeX.Right };
    const expectRectRight = { ...rect, w: 3 }
    const edgesTop = { y: WorktableStateResizingItemEdgeY.Top };
    const expectRectTop = { ...rect, y: 0, h: 3 }
    const edgesBottom = { y: WorktableStateResizingItemEdgeY.Bottom };
    const expectRectBottom = { ...rect, h: 3 }
    const edgesLeftTop = { x: WorktableStateResizingItemEdgeX.Left, y: WorktableStateResizingItemEdgeY.Top }
    const expectRectLeftTop = { ...rect, x: 0, y: 0, w: 3, h: 3 }
    const widgetLayout = [fixtureWidgetLayoutItemA({ id, rect })];
    const expectWidgetLayoutLeft = [fixtureWidgetLayoutItemA({ id, rect: expectRectLeft })];
    const expectWidgetLayoutRight = [fixtureWidgetLayoutItemA({ id, rect: expectRectRight })];
    const expectWidgetLayoutTop = [fixtureWidgetLayoutItemA({ id, rect: expectRectTop })];
    const expectWidgetLayoutBottom = [fixtureWidgetLayoutItemA({ id, rect: expectRectBottom })];
    const expectWidgetLayoutLeftTop = [fixtureWidgetLayoutItemA({ id, rect: expectRectLeftTop })];

    const newWidgetLayoutLeft = resizeLayoutItemCalc(widgetLayout, id, deltasX, { w: 1, h: 1 }, edgesLeft);
    const newWidgetLayoutRight = resizeLayoutItemCalc(widgetLayout, id, deltasX, { w: 1, h: 1 }, edgesRight);
    const newWidgetLayoutTop = resizeLayoutItemCalc(widgetLayout, id, deltasY, { w: 1, h: 1 }, edgesTop);
    const newWidgetLayoutBottom = resizeLayoutItemCalc(widgetLayout, id, deltasY, { w: 1, h: 1 }, edgesBottom);
    const newWidgetLayoutLeftTop = resizeLayoutItemCalc(widgetLayout, id, deltasXY, { w: 1, h: 1 }, edgesLeftTop);

    expect(newWidgetLayoutLeft).toEqual(expectWidgetLayoutLeft);
    expect(newWidgetLayoutRight).toEqual(expectWidgetLayoutRight);
    expect(newWidgetLayoutTop).toEqual(expectWidgetLayoutTop);
    expect(newWidgetLayoutBottom).toEqual(expectWidgetLayoutBottom);
    expect(newWidgetLayoutLeftTop).toEqual(expectWidgetLayoutLeftTop);
  })

  it('should resize item with the provided negative deltas and edges', () => {
    const id = 'TEST-ID';
    const rect = { x: 1, w: 3, y: 1, h: 3 };
    const deltasX = { x: -1 };
    const deltasY = { y: -1 };
    const deltasXY = { x: -1, y: -1 };
    const edgesLeft = { x: WorktableStateResizingItemEdgeX.Left };
    const expectRectLeft = { ...rect, x: 2, w: 2 }
    const edgesRight = { x: WorktableStateResizingItemEdgeX.Right };
    const expectRectRight = { ...rect, w: 2 }
    const edgesTop = { y: WorktableStateResizingItemEdgeY.Top };
    const expectRectTop = { ...rect, y: 2, h: 2 }
    const edgesBottom = { y: WorktableStateResizingItemEdgeY.Bottom };
    const expectRectBottom = { ...rect, h: 2 }
    const edgesLeftTop = { x: WorktableStateResizingItemEdgeX.Left, y: WorktableStateResizingItemEdgeY.Top }
    const expectRectLeftTop = { ...rect, x: 2, y: 2, w: 2, h: 2 }
    const widgetLayout = [fixtureWidgetLayoutItemA({ id, rect })];
    const expectWidgetLayoutLeft = [fixtureWidgetLayoutItemA({ id, rect: expectRectLeft })];
    const expectWidgetLayoutRight = [fixtureWidgetLayoutItemA({ id, rect: expectRectRight })];
    const expectWidgetLayoutTop = [fixtureWidgetLayoutItemA({ id, rect: expectRectTop })];
    const expectWidgetLayoutBottom = [fixtureWidgetLayoutItemA({ id, rect: expectRectBottom })];
    const expectWidgetLayoutLeftTop = [fixtureWidgetLayoutItemA({ id, rect: expectRectLeftTop })];

    const newWidgetLayoutLeft = resizeLayoutItemCalc(widgetLayout, id, deltasX, { w: 1, h: 1 }, edgesLeft);
    const newWidgetLayoutRight = resizeLayoutItemCalc(widgetLayout, id, deltasX, { w: 1, h: 1 }, edgesRight);
    const newWidgetLayoutTop = resizeLayoutItemCalc(widgetLayout, id, deltasY, { w: 1, h: 1 }, edgesTop);
    const newWidgetLayoutBottom = resizeLayoutItemCalc(widgetLayout, id, deltasY, { w: 1, h: 1 }, edgesBottom);
    const newWidgetLayoutLeftTop = resizeLayoutItemCalc(widgetLayout, id, deltasXY, { w: 1, h: 1 }, edgesLeftTop);

    expect(newWidgetLayoutLeft).toEqual(expectWidgetLayoutLeft);
    expect(newWidgetLayoutRight).toEqual(expectWidgetLayoutRight);
    expect(newWidgetLayoutTop).toEqual(expectWidgetLayoutTop);
    expect(newWidgetLayoutBottom).toEqual(expectWidgetLayoutBottom);
    expect(newWidgetLayoutLeftTop).toEqual(expectWidgetLayoutLeftTop);
  })

  it('should not allow to make the size smaller than the min allowed one', () => {
    const id = 'TEST-ID';
    const minAllowedSize = { w: 3, h: 3 };
    const rect = { x: 1, w: 4, y: 1, h: 4 };
    const deltasX = { x: -2 };
    const deltasY = { y: -2 };
    const deltasXY = { x: -2, y: -2 };
    const edgesLeft = { x: WorktableStateResizingItemEdgeX.Left };
    const expectRectLeft = { ...rect, x: 2, w: 3 }
    const edgesRight = { x: WorktableStateResizingItemEdgeX.Right };
    const expectRectRight = { ...rect, w: 3 }
    const edgesTop = { y: WorktableStateResizingItemEdgeY.Top };
    const expectRectTop = { ...rect, y: 2, h: 3 }
    const edgesBottom = { y: WorktableStateResizingItemEdgeY.Bottom };
    const expectRectBottom = { ...rect, h: 3 }
    const edgesLeftTop = { x: WorktableStateResizingItemEdgeX.Left, y: WorktableStateResizingItemEdgeY.Top }
    const expectRectLeftTop = { ...rect, x: 2, y: 2, w: 3, h: 3 }
    const widgetLayout = [fixtureWidgetLayoutItemA({ id, rect })];
    const expectWidgetLayoutLeft = [fixtureWidgetLayoutItemA({ id, rect: expectRectLeft })];
    const expectWidgetLayoutRight = [fixtureWidgetLayoutItemA({ id, rect: expectRectRight })];
    const expectWidgetLayoutTop = [fixtureWidgetLayoutItemA({ id, rect: expectRectTop })];
    const expectWidgetLayoutBottom = [fixtureWidgetLayoutItemA({ id, rect: expectRectBottom })];
    const expectWidgetLayoutLeftTop = [fixtureWidgetLayoutItemA({ id, rect: expectRectLeftTop })];

    const newWidgetLayoutLeft = resizeLayoutItemCalc(widgetLayout, id, deltasX, minAllowedSize, edgesLeft);
    const newWidgetLayoutRight = resizeLayoutItemCalc(widgetLayout, id, deltasX, minAllowedSize, edgesRight);
    const newWidgetLayoutTop = resizeLayoutItemCalc(widgetLayout, id, deltasY, minAllowedSize, edgesTop);
    const newWidgetLayoutBottom = resizeLayoutItemCalc(widgetLayout, id, deltasY, minAllowedSize, edgesBottom);
    const newWidgetLayoutLeftTop = resizeLayoutItemCalc(widgetLayout, id, deltasXY, minAllowedSize, edgesLeftTop);

    expect(newWidgetLayoutLeft).toEqual(expectWidgetLayoutLeft);
    expect(newWidgetLayoutRight).toEqual(expectWidgetLayoutRight);
    expect(newWidgetLayoutTop).toEqual(expectWidgetLayoutTop);
    expect(newWidgetLayoutBottom).toEqual(expectWidgetLayoutBottom);
    expect(newWidgetLayoutLeftTop).toEqual(expectWidgetLayoutLeftTop);
  })
})
