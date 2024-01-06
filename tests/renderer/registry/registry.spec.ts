/*
 * Copyright: (c) 2024, Alex Kaul
 * GNU General Public License v3.0 or later (see COPYING or https://www.gnu.org/licenses/gpl-3.0.txt)
 */

import widgets from '@/widgets';
import { registry } from '@/registry/registry';

jest.mock('@/widgets')

describe('Registry', () => {
  describe('getWidgetTypes()', () => {
    it('should return a default value of Widgets module', () => {
      const widgetTypes = registry.getWidgetTypes();

      expect(widgetTypes).toBe(widgets);
    })
  })

});
