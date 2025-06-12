/*
 * Copyright: (c) 2024, Alex Kaul
 * GNU General Public License v3.0 or later (see COPYING or https://www.gnu.org/licenses/gpl-3.0.txt)
 */

import { createLayoutItem, createLayoutItemAtFreeArea, moveLayoutItem, removeLayoutItem, resizeLayoutItemByEdges, WidgetLayout, WidgetLayoutItem, WidgetLayoutItemRect } from '@/base/widgetLayout';
import { fixtureWidgetLayoutItemA, fixtureWidgetLayoutItemB, fixtureWidgetLayoutItemC, fixtureWidgetLayoutItemD } from '@tests/base/fixtures/widgetLayout';

describe('WidgetLayout', () => {
  describe('createLayoutItem()', () => {
    it('should return a new layout containing the created item', () => {
      const id = 'TEST-ID'
      const rect = { x: 1, y: 1, w: 1, h: 1 };
      const widgetId = 'TEST-WIDGET-ID'
      const layout: WidgetLayout = [fixtureWidgetLayoutItemA()];
      const expectLayout: WidgetLayout = [...layout, { id, rect, widgetId }];

      const [newLayout, newItem] = createLayoutItem(
        layout,
        { id, rect, widgetId }
      );

      expect(newLayout).toEqual(expectLayout);
      expect(newItem).toEqual(expectLayout[1]);
    })

    it('should return the same layout and null item if the layout already has another item with the same id', () => {
      const testId = 'TEST-ID'
      const layout: WidgetLayout = [fixtureWidgetLayoutItemA({ id: testId })];

      const [newLayout, newItem] = createLayoutItem(
        layout,
        { id: testId, rect: { x: 1, y: 1, w: 1, h: 1 }, widgetId: 'SOME-WIDGET' }
      );

      expect(newLayout).toBe(layout);
      expect(newItem).toBeNull();
    })

    it('should set right props for the created item', () => {
      const id = 'TEST-ID'
      const rect = { x: 1, y: 1, w: 1, h: 1 };
      const widgetId = 'TEST-WIDGET-ID'
      const layout: WidgetLayout = [fixtureWidgetLayoutItemA()];

      const [, newItem] = createLayoutItem(
        layout,
        { id, rect, widgetId }
      );

      expect(newItem?.id).toBe(id);
      expect(newItem?.rect).toEqual(rect);
      expect(newItem?.widgetId).toBe(widgetId);
    })

    it('should set x = 0 for values < 0', () => {
      const id = 'TEST-ID'
      const rect = { x: -1, y: 1, w: 1, h: 1 };
      const expectRect = { x: 0, y: 1, w: 1, h: 1 };
      const widgetId = 'TEST-WIDGET-ID'
      const layout: WidgetLayout = [fixtureWidgetLayoutItemA()];

      const newItem = createLayoutItem(
        layout,
        { id, rect, widgetId }
      )[1] as WidgetLayoutItem;

      expect(newItem.rect).toEqual(expectRect);
    })

    it('should set y = 0 for values < 0', () => {
      const id = 'TEST-ID'
      const rect = { x: 1, y: -1, w: 1, h: 1 };
      const expectRect = { x: 1, y: 0, w: 1, h: 1 };
      const widgetId = 'TEST-WIDGET-ID'
      const layout: WidgetLayout = [fixtureWidgetLayoutItemA()];

      const newItem = createLayoutItem(
        layout,
        { id, rect, widgetId }
      )[1] as WidgetLayoutItem;

      expect(newItem.rect).toEqual(expectRect);
    })

    it('should fix collisions', () => {
      const id = 'TEST-ID'
      const rect = { x: 2, y: 0, w: 2, h: 3 };
      const widgetId = 'TEST-WIDGET-ID'
      const layout: WidgetLayout = [
        fixtureWidgetLayoutItemA({ rect: { x: 3, y: 1, w: 3, h: 2 } }),
        fixtureWidgetLayoutItemB({ rect: { x: 0, y: 0, w: 2, h: 3 } }),
        fixtureWidgetLayoutItemC({ rect: { x: 2, y: 4, w: 4, h: 14 } }),
        fixtureWidgetLayoutItemD({ rect: { x: 3, y: 0, w: 3, h: 1 } })
      ];
      const expectLayoutItems: WidgetLayout = [
        { ...layout[0], rect: { x: 3, y: 4, w: 3, h: 2 } },
        { ...layout[1], rect: { x: 0, y: 0, w: 2, h: 3 } },
        { ...layout[2], rect: { x: 2, y: 6, w: 4, h: 14 } },
        { ...layout[3], rect: { x: 3, y: 3, w: 3, h: 1 } }
      ];

      const newLayout = createLayoutItem(
        layout,
        { id, rect, widgetId }
      )[0];

      expect(newLayout).toContainEqual(expectLayoutItems[0]);
      expect(newLayout).toContainEqual(expectLayoutItems[1]);
      expect(newLayout).toContainEqual(expectLayoutItems[2]);
      expect(newLayout).toContainEqual(expectLayoutItems[3]);
    })
  })

  describe('createLayoutItemAtFreeArea()', () => {
    it('should return a new layout containing the created item', () => {
      const id = 'TEST-ID'
      const size = { w: 1, h: 1 };
      const widgetId = 'TEST-WIDGET-ID'
      const layout: WidgetLayout = [fixtureWidgetLayoutItemA({ rect: { x: 3, y: 3, w: 1, h: 1 } })];
      const expectLayout: WidgetLayout = [...layout, { id, rect: { x: 0, y: 0, ...size }, widgetId }];

      const [newLayout, newItem] = createLayoutItemAtFreeArea(
        layout,
        { id, size, widgetId }
      );

      expect(newLayout).toEqual(expectLayout);
      expect(newItem).toEqual(expectLayout[1]);
    })

    it('should return the same layout and null item if the layout already has another item with the same id', () => {
      const testId = 'TEST-ID'
      const layout: WidgetLayout = [fixtureWidgetLayoutItemA({ id: testId })];

      const [newLayout, newItem] = createLayoutItemAtFreeArea(
        layout,
        { id: testId, size: { w: 1, h: 1 }, widgetId: 'SOME-WIDGET' }
      );

      expect(newLayout).toBe(layout);
      expect(newItem).toBeNull();
    })

    it('should set right props for the created item', () => {
      const id = 'TEST-ID'
      const size = { w: 1, h: 1 };
      const widgetId = 'TEST-WIDGET-ID'

      const [, newItem] = createLayoutItemAtFreeArea(
        [],
        { id, size, widgetId }
      );

      expect(newItem?.id).toBe(id);
      expect(newItem?.rect).toEqual({ x: 0, y: 0, ...size });
      expect(newItem?.widgetId).toBe(widgetId);
    })

    it('should set x,y to the closest free area based on the provided w,h size', () => {
      const size = { w: 3, h: 3 };
      const expectRect = { x: 4, y: 3, ...size };
      const layout: WidgetLayout = [
        fixtureWidgetLayoutItemA({ rect: { x: 2, y: 2, w: 2, h: 2 } }),
        fixtureWidgetLayoutItemB({ rect: { x: 6, y: 0, w: 10, h: 3 } }),
        fixtureWidgetLayoutItemC({ rect: { x: 7, y: 4, w: 9, h: 2 } }),
      ];

      const [, newItem] = createLayoutItemAtFreeArea(
        layout,
        { id: 'TEST-ID', size, widgetId: 'WIDGET-ID' }
      );

      expect(newItem?.rect).toEqual(expectRect);
    })

  })

  describe('moveLayoutItem()', () => {
    it('should return a new layout with updated item if its rect has new values', () => {
      const id = 'TEST-ID';
      const origXY = { x: 1, y: 1 };
      const newXY = { x: 2, y: 2 };
      const origLayout: WidgetLayout = [
        fixtureWidgetLayoutItemA({ id, rect: origXY })
      ];
      const expectLayout: WidgetLayout = [{
        ...origLayout[0],
        rect: {
          ...origLayout[0].rect,
          ...newXY
        }
      }];

      const newLayout = moveLayoutItem(origLayout, id, newXY);

      expect(newLayout).toEqual(expectLayout);
    })

    it('should return the original layout if there were not any updates', () => {
      const id = 'TEST-ID';
      const xy = { x: 3, y: 1 };
      const origLayout: WidgetLayout = [
        fixtureWidgetLayoutItemA({ id, rect: xy })
      ];

      const newLayout = moveLayoutItem(origLayout, id, xy);

      expect(newLayout).toBe(origLayout);
    })

    it('should set x = 0 for values < 0', () => {
      const id = 'TEST-ID';
      const origXY = { x: 1, y: 1 };
      const newXY = { x: -1, y: 1 };
      const expectXY = { x: 0, y: 1 };
      const origLayout: WidgetLayout = [
        fixtureWidgetLayoutItemA({ id, rect: origXY })
      ];
      const expectLayout: WidgetLayout = [{
        ...origLayout[0],
        rect: {
          ...origLayout[0].rect,
          ...expectXY
        }
      }]

      const newLayout = moveLayoutItem(origLayout, id, newXY);

      expect(newLayout).toEqual(expectLayout);
    })

    it('should set y = 0 for values < 0', () => {
      const id = 'TEST-ID';
      const origXY = { x: 1, y: 1 };
      const newXY = { x: 1, y: -1 };
      const expectXY = { x: 1, y: 0 };
      const origLayout: WidgetLayout = [
        fixtureWidgetLayoutItemA({ id, rect: origXY })
      ];
      const expectLayout: WidgetLayout = [{
        ...origLayout[0],
        rect: {
          ...origLayout[0].rect,
          ...expectXY
        }
      }]

      const newLayout = moveLayoutItem(origLayout, id, newXY);

      expect(newLayout).toEqual(expectLayout);
    })


    it('should fix collisions', () => {
      const id = 'TEST-ID';
      const moveByXY = {
        x: 2,
        y: 0
      };
      const origLayout: WidgetLayout = [
        fixtureWidgetLayoutItemA({ rect: { x: 3, y: 1, w: 3, h: 2 } }),
        fixtureWidgetLayoutItemB({ id, rect: { x: 0, y: 0, w: 2, h: 3 } }), // Will move this
        fixtureWidgetLayoutItemC({ rect: { x: 2, y: 4, w: 4, h: 14 } }),
        fixtureWidgetLayoutItemD({ rect: { x: 3, y: 0, w: 3, h: 1 } })
      ];
      const expectLayout: WidgetLayout = [
        { ...origLayout[0], rect: { x: 3, y: 4, w: 3, h: 2 } },
        { ...origLayout[1], rect: { x: 2, y: 0, w: 2, h: 3 } }, // Will move this
        { ...origLayout[2], rect: { x: 2, y: 6, w: 4, h: 14 } },
        { ...origLayout[3], rect: { x: 3, y: 3, w: 3, h: 1 } }
      ];

      const newLayout = moveLayoutItem(origLayout, id, moveByXY);

      expect(newLayout).toContainEqual(expectLayout[0]);
      expect(newLayout).toContainEqual(expectLayout[1]);
      expect(newLayout).toContainEqual(expectLayout[2]);
      expect(newLayout).toContainEqual(expectLayout[3]);
    })
  })

  describe('removeLayoutItem()', () => {
    it('should return a new layout without an item specified by id, if such id exists', () => {
      const id = 'TEST-ID';
      const origLayout: WidgetLayout = [
        fixtureWidgetLayoutItemA(),
        fixtureWidgetLayoutItemB({ id })
      ];
      const expectLayout: WidgetLayout = [origLayout[0]];

      const newLayout = removeLayoutItem(origLayout, id);

      expect(newLayout).toEqual(expectLayout);
    })

    it('should return the original layout if there is no item with the specified id', () => {
      const origLayout: WidgetLayout = [
        fixtureWidgetLayoutItemA()
      ];

      const newLayout = removeLayoutItem(origLayout, 'NO-SUCH-ID');

      expect(newLayout).toBe(origLayout);
    })
  })

  describe('resizeLayoutItemByEdges()', () => {
    it('should return a new array copy with updated item if its rect has new values after updating by any edge', () => {
      const id = 'TEST-ID';
      const origRect: WidgetLayoutItemRect = { x: 3, y: 1, w: 3, h: 2 };
      const delta1 = {
        top: 1,
        right: 2
      };
      const delta2 = {
        left: 1,
        bottom: 2
      };
      const expectRect1: WidgetLayoutItemRect = {
        ...origRect,
        w: origRect.w + delta1.right,
        y: origRect.y - delta1.top,
        h: origRect.h + delta1.top,
      };
      const expectRect2: WidgetLayoutItemRect = {
        ...origRect,
        x: origRect.x - delta2.left,
        w: origRect.w + delta2.left,
        h: origRect.h + delta2.bottom,
      };
      const origLayout: WidgetLayout = [
        fixtureWidgetLayoutItemA({ id, rect: origRect }),
      ];
      const expectLayout1 = [{
        ...origLayout[0],
        rect: expectRect1
      }]
      const expectLayout2 = [{
        ...origLayout[0],
        rect: expectRect2
      }]

      const newLayout1 = resizeLayoutItemByEdges(origLayout, id, delta1, { w: 1, h: 1 });
      const newLayout2 = resizeLayoutItemByEdges(origLayout, id, delta2, { w: 1, h: 1 });

      expect(newLayout1).toEqual(expectLayout1);
      expect(newLayout2).toEqual(expectLayout2);
    })

    it('should return the original array for zero deltas', () => {
      const id = 'TEST-ID';
      const origLayout: WidgetLayout = [
        fixtureWidgetLayoutItemA({ id }),
      ];

      const newLayout1 = resizeLayoutItemByEdges(origLayout, id, { left: 0 }, { w: 1, h: 1 });
      expect(newLayout1).toBe(origLayout);

      const newLayout2 = resizeLayoutItemByEdges(origLayout, id, { top: 0 }, { w: 1, h: 1 });
      expect(newLayout2).toBe(origLayout);

      const newLayout3 = resizeLayoutItemByEdges(origLayout, id, { right: 0 }, { w: 1, h: 1 });
      expect(newLayout3).toBe(origLayout);

      const newLayout4 = resizeLayoutItemByEdges(origLayout, id, { bottom: 0 }, { w: 1, h: 1 });
      expect(newLayout4).toBe(origLayout);

      const newLayout5 = resizeLayoutItemByEdges(origLayout, id, {}, { w: 1, h: 1 });
      expect(newLayout5).toBe(origLayout);
    })

    it('should set width = minSize.w for values < minSize.w', () => {
      const id = 'TEST-ID';
      const origXW = { x: 3, w: 3 };
      const delta1 = { left: -4 };
      const expectXW1 = { x: 4, w: 2 }
      const delta2 = { right: -4 };
      const expectXW2 = { x: 3, w: 2 }
      const origLayout: WidgetLayout = [
        fixtureWidgetLayoutItemA({ id, rect: origXW }),
      ];
      const expectedLayout1: WidgetLayout = [{
        ...origLayout[0],
        rect: {
          ...origLayout[0].rect,
          ...expectXW1
        }
      }]
      const expectedLayout2: WidgetLayout = [{
        ...origLayout[0],
        rect: {
          ...origLayout[0].rect,
          ...expectXW2
        }
      }]

      const newLayout1 = resizeLayoutItemByEdges(origLayout, id, delta1, { w: 2, h: 1 });
      const newLayout2 = resizeLayoutItemByEdges(origLayout, id, delta2, { w: 2, h: 1 });

      expect(newLayout1).toEqual(expectedLayout1);
      expect(newLayout2).toEqual(expectedLayout2);
    })

    it('should set height = minSize.h for values < minSize.h', () => {
      const id = 'TEST-ID';
      const origYH = { y: 1, h: 3 };
      const delta1 = { top: -3 };
      const expectYH1 = { y: 2, h: 2 }
      const delta2 = { bottom: -3 };
      const expectYH2 = { y: 1, h: 2 }
      const origLayout: WidgetLayout = [
        fixtureWidgetLayoutItemA({ id, rect: origYH }),
      ];
      const expectedLayout1: WidgetLayout = [{
        ...origLayout[0],
        rect: {
          ...origLayout[0].rect,
          ...expectYH1
        }
      }]
      const expectedLayout2: WidgetLayout = [{
        ...origLayout[0],
        rect: {
          ...origLayout[0].rect,
          ...expectYH2
        }
      }]

      const newLayout1 = resizeLayoutItemByEdges(origLayout, id, delta1, { w: 1, h: 2 });
      const newLayout2 = resizeLayoutItemByEdges(origLayout, id, delta2, { w: 1, h: 2 });

      expect(newLayout1).toEqual(expectedLayout1);
      expect(newLayout2).toEqual(expectedLayout2);
    })

    it('should set max allowed w if x < 0', () => {
      const id = 'TEST-ID';
      const origXW = { x: 3, w: 3 };
      const maxAllowedDelta = origXW.x;
      const delta = { left: maxAllowedDelta + 1 };
      const expectXW = { x: 0, w: origXW.w + maxAllowedDelta }
      const origLayout: WidgetLayout = [
        fixtureWidgetLayoutItemA({ id, rect: origXW }),
      ];
      const expectedLayout: WidgetLayout = [{
        ...origLayout[0],
        rect: {
          ...origLayout[0].rect,
          ...expectXW
        }
      }]

      const newLayout = resizeLayoutItemByEdges(origLayout, id, delta, { w: 1, h: 1 });

      expect(newLayout).toEqual(expectedLayout);
    })

    it('should set max allowed h if y < 0', () => {
      const id = 'TEST-ID';
      const origYH = { y: 1, h: 2 };
      const maxAllowedDelta = origYH.y;
      const delta = { top: maxAllowedDelta + 1 };
      const expectYH = { y: 0, h: origYH.h + maxAllowedDelta }
      const origLayout: WidgetLayout = [
        fixtureWidgetLayoutItemA({ id, rect: origYH }),
      ];
      const expectedLayout: WidgetLayout = [{
        ...origLayout[0],
        rect: {
          ...origLayout[0].rect,
          ...expectYH
        }
      }]

      const newLayout = resizeLayoutItemByEdges(origLayout, id, delta, { w: 1, h: 1 });

      expect(newLayout).toEqual(expectedLayout);
    })

    it('should fix collisions', () => {
      const id = 'TEST-ID';
      const delta = {
        right: 2
      };
      const origLayout: WidgetLayout = [
        fixtureWidgetLayoutItemA({ rect: { x: 3, y: 1, w: 3, h: 2 } }),
        fixtureWidgetLayoutItemB({ id, rect: { x: 0, y: 0, w: 2, h: 3 } }), // Will resize this
        fixtureWidgetLayoutItemC({ rect: { x: 2, y: 4, w: 4, h: 14 } }),
        fixtureWidgetLayoutItemD({ rect: { x: 3, y: 0, w: 3, h: 1 } })
      ];
      const expectLayout: WidgetLayout = [
        { ...origLayout[0], rect: { x: 3, y: 4, w: 3, h: 2 } },
        { ...origLayout[1], rect: { x: 0, y: 0, w: 4, h: 3 } }, // Will resize this
        { ...origLayout[2], rect: { x: 2, y: 6, w: 4, h: 14 } },
        { ...origLayout[3], rect: { x: 3, y: 3, w: 3, h: 1 } }
      ];

      const newLayout = resizeLayoutItemByEdges(origLayout, id, delta, { w: 1, h: 1 });

      expect(newLayout).toContainEqual(expectLayout[0]);
      expect(newLayout).toContainEqual(expectLayout[1]);
      expect(newLayout).toContainEqual(expectLayout[2]);
      expect(newLayout).toContainEqual(expectLayout[3]);
    })
  })

})
