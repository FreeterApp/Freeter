/*
 * Copyright: (c) 2024, Alex Kaul
 * GNU General Public License v3.0 or later (see COPYING or https://www.gnu.org/licenses/gpl-3.0.txt)
 */

import { WidgetEnvAreaWorkflow, createWidget, createWidgetEnv, getWidgetDisplayName, updateWidgetCoreSettings, updateWidgetSettings } from '@/base/widget';
import { fixtureWidgetA } from '@tests/base/fixtures/widget';
import { fixtureWidgetTypeA } from '@tests/base/fixtures/widgetType';

describe('Widget', () => {
  describe('createWidget()', () => {
    it('should return a new widget object with right params', () => {
      const id = 'ID';
      const typeId = 'TYPE-ID';
      const widgetName = 'WIDGET NAME';

      const settings = {
        someParam: 'Some Value'
      }
      const type = fixtureWidgetTypeA({
        id: typeId,
        createSettingsState: () => ({ ...settings })
      })

      const widget = createWidget(type, id, widgetName);

      expect(widget.id).toBe(id);
      expect(widget.type).toBe(typeId);
      expect(widget.coreSettings.name).toBe(widgetName);
      expect(widget.settings).toEqual(settings);
    })
  })

  describe('updateWidgetCoreSettings()', () => {
    it('should return a new widget object with updated coreSettings', () => {
      const currentWidget = fixtureWidgetA();
      const newSettings = { color: 'green', name: 'New Name' };
      const expectedWidget: typeof currentWidget = {
        ...currentWidget,
        coreSettings: newSettings
      }

      const updatedWidget = updateWidgetCoreSettings(currentWidget, newSettings);

      expect(updatedWidget).toEqual(expectedWidget);
    })
  })

  describe('updateWidgetSettings()', () => {
    it('should return a new widget object with updated settings', () => {
      const currentWidget = fixtureWidgetA();
      const newSettings = { str: 'val' };
      const expectedWidget: typeof currentWidget = {
        ...currentWidget,
        settings: newSettings
      }

      const updatedWidget = updateWidgetSettings(currentWidget, newSettings);

      expect(updatedWidget).toEqual(expectedWidget);
    })
  })

  describe('createWidgetEnv()', () => {
    it('should create a copy of a provided envData object', () => {
      const envData: WidgetEnvAreaWorkflow = { area: 'workflow', projectId: 'P', workflowId: 'W' };

      const gotWidgetEnv = createWidgetEnv(envData);

      expect(gotWidgetEnv).toEqual(envData);
      expect(gotWidgetEnv).not.toBe(envData);
    })

    it('should create a frozen object', () => {
      const widgetEnv = createWidgetEnv({ area: 'shelf' });

      expect(() => {
        (widgetEnv as unknown as WidgetEnvAreaWorkflow).area = 'workflow';
      }).toThrowError();
    })
  })

  describe('getWidgetDisplayName()', () => {
    it('should return widget name, when it is not empty', () => {
      const wName = 'WIDGET NAME';
      const tName = 'TYPE NAME';
      const widget = fixtureWidgetA({ coreSettings: { name: wName } })
      const type = fixtureWidgetTypeA({ name: tName })

      expect(getWidgetDisplayName(widget, type)).toBe(wName);
    })

    it('should return widget type name, when the widget name is empty and the type name is not empty', () => {
      const wName = '';
      const tName = 'TYPE NAME';
      const widget = fixtureWidgetA({ coreSettings: { name: wName } })
      const type = fixtureWidgetTypeA({ name: tName })

      expect(getWidgetDisplayName(widget, type)).toBe(tName);
    })

    it('should return widget type name, when the widget is undefined and the type name is not empty', () => {
      const tName = 'TYPE NAME';
      const type = fixtureWidgetTypeA({ name: tName })

      expect(getWidgetDisplayName(undefined, type)).toBe(tName);
    })

    it('should return an empty string, when the widget and type names are empty', () => {
      const wName = '';
      const tName = '';
      const widget = fixtureWidgetA({ coreSettings: { name: wName } })
      const type = fixtureWidgetTypeA({ name: tName })

      expect(getWidgetDisplayName(widget, type)).toBe('');
    })

    it('should return an empty string, when the widget and type are undefined', () => {
      expect(getWidgetDisplayName(undefined, undefined)).toBe('');
    })
  })
})
