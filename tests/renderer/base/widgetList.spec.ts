/*
 * Copyright: (c) 2024, Alex Kaul
 * GNU General Public License v3.0 or later (see COPYING or https://www.gnu.org/licenses/gpl-3.0.txt)
 */

import { createListItem, WidgetList } from '@/base/widgetList';
import { fixtureWidgetListItemA } from '@tests/base/fixtures/widgetList';

describe('WidgetList', () => {
  describe('createListItem()', () => {
    it('should return a new list containing the created item at the target item index', () => {
      const id = 'TEST-ID'
      const widgetId = 'TEST-WIDGET-ID'
      const targetItemId = 'TARGET-ITEM-ID'
      const list: WidgetList = [
        fixtureWidgetListItemA({ id: targetItemId })
      ];

      const [newList, newItem] = createListItem(
        list,
        { id, widgetId },
        targetItemId
      );

      const expectList: WidgetList = [{ id, widgetId }, list[0]];
      expect(newList).toEqual(expectList);
      expect(newList[0]).toBe(newItem);
    })

    it('should create item at the end of the list, if target item is null', () => {
      const id = 'TEST-ID'
      const widgetId = 'TEST-WIDGET-ID'
      const list: WidgetList = [
        fixtureWidgetListItemA()
      ];

      const [newList, newItem] = createListItem(
        list,
        { id, widgetId },
        null
      );

      const expectList: WidgetList = [list[0], { id, widgetId }];
      expect(newList).toEqual(expectList);
      expect(newList[1]).toBe(newItem);
    })

    it('should create item at the end of the list, if target item id does not exist', () => {
      const id = 'TEST-ID'
      const widgetId = 'TEST-WIDGET-ID'
      const list: WidgetList = [
        fixtureWidgetListItemA()
      ];

      const [newList, newItem] = createListItem(
        list,
        { id, widgetId },
        'NO-SUCH-ID'
      );

      const expectList: WidgetList = [list[0], { id, widgetId }];
      expect(newList).toEqual(expectList);
      expect(newList[1]).toBe(newItem);
    })

    it('should return the same list and null item if the list already has another item with the same id', () => {
      const id = 'TEST-ID'
      const widgetId = 'TEST-WIDGET-ID'
      const list: WidgetList = [
        fixtureWidgetListItemA({ id })
      ];

      const [newList, newItem] = createListItem(
        list,
        { id, widgetId },
        null
      );

      expect(newList).toBe(list);
      expect(newItem).toBeNull();
    })

    it('should set right props for the created item', () => {
      const id = 'TEST-ID'
      const widgetId = 'TEST-WIDGET-ID'
      const list: WidgetList = [
        fixtureWidgetListItemA()
      ];

      const [, newItem] = createListItem(
        list,
        { id, widgetId },
        null
      );

      expect(newItem?.id).toBe(id);
      expect(newItem?.widgetId).toBe(widgetId);
    })
  })

});
