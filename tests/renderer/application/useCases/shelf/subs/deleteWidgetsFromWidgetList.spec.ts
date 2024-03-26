/*
 * Copyright: (c) 2024, Alex Kaul
 * GNU General Public License v3.0 or later (see COPYING or https://www.gnu.org/licenses/gpl-3.0.txt)
 */

import { deleteWidgetsFromWidgetListSubCase } from '@/application/useCases/shelf/subs/deleteWidgetsFromWidgetList';
import { fixtureWidgetListItemA, fixtureWidgetListItemB, fixtureWidgetListItemC, fixtureWidgetListItemD } from '@tests/base/fixtures/widgetList';

describe('deleteWidgetsFromWidgetListSubCase()', () => {
  it('should remove items with specified widget ids from the widget list', () => {
    const list = [
      fixtureWidgetListItemA({ widgetId: 'W-1' }),
      fixtureWidgetListItemB({ widgetId: 'W-2' }),
      fixtureWidgetListItemC({ widgetId: 'W-3' }),
      fixtureWidgetListItemD({ widgetId: 'W-4' }),
    ]

    const [updList] = deleteWidgetsFromWidgetListSubCase(
      ['W-2', 'W-3', 'NO-ID'],
      list
    )

    expect(updList).toEqual([list[0], list[3]])
  })

  it('should return ids of deleted widgets', () => {
    const list = [
      fixtureWidgetListItemA({ widgetId: 'W-1' }),
      fixtureWidgetListItemB({ widgetId: 'W-2' }),
      fixtureWidgetListItemC({ widgetId: 'W-3' }),
      fixtureWidgetListItemD({ widgetId: 'W-4' }),
    ]

    const [, delWgtIds] = deleteWidgetsFromWidgetListSubCase(
      ['W-2', 'W-3', 'NO-ID'],
      list
    )

    expect(delWgtIds).toEqual(['W-2', 'W-3'])
  })

})
