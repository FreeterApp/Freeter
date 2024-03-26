/*
 * Copyright: (c) 2024, Alex Kaul
 * GNU General Public License v3.0 or later (see COPYING or https://www.gnu.org/licenses/gpl-3.0.txt)
 */

import { deleteWidgetsFromWidgetLayoutSubCase } from '@/application/useCases/workflow/subs/deleteWidgetsFromWidgetLayout';
import { fixtureWidgetLayoutItemA, fixtureWidgetLayoutItemB, fixtureWidgetLayoutItemC, fixtureWidgetLayoutItemD } from '@tests/base/fixtures/widgetLayout';

describe('deleteWidgetsFromWidgetLayoutSubCase()', () => {
  it('should remove items with specified widget ids from the widget layout', () => {
    const layout = [
      fixtureWidgetLayoutItemA({ widgetId: 'W-1' }),
      fixtureWidgetLayoutItemB({ widgetId: 'W-2' }),
      fixtureWidgetLayoutItemC({ widgetId: 'W-3' }),
      fixtureWidgetLayoutItemD({ widgetId: 'W-4' }),
    ]

    const [updLayout] = deleteWidgetsFromWidgetLayoutSubCase(
      ['W-2', 'W-3', 'NO-ID'],
      layout
    )

    expect(updLayout).toEqual([layout[0], layout[3]])
  })

  it('should return ids of deleted widgets', () => {
    const list = [
      fixtureWidgetLayoutItemA({ widgetId: 'W-1' }),
      fixtureWidgetLayoutItemB({ widgetId: 'W-2' }),
      fixtureWidgetLayoutItemC({ widgetId: 'W-3' }),
      fixtureWidgetLayoutItemD({ widgetId: 'W-4' }),
    ]

    const [, delWgtIds] = deleteWidgetsFromWidgetLayoutSubCase(
      ['W-2', 'W-3', 'NO-ID'],
      list
    )

    expect(delWgtIds).toEqual(['W-2', 'W-3'])
  })

})
