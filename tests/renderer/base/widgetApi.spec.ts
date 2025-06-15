/*
 * Copyright: (c) 2024, Alex Kaul
 * GNU General Public License v3.0 or later (see COPYING or https://www.gnu.org/licenses/gpl-3.0.txt)
 */

import { WidgetApiCommonFactory, WidgetApiModuleFactories, WidgetApiModuleName, createWidgetApiFactory } from '@/base/widgetApi'

const testId = 'TEST-ID';

function callCreateWidgetApiFactory({
  commonFactory,
  moduleFactories
}: {
  commonFactory?: () => unknown,
  moduleFactories?: Record<string, () => unknown>,
}) {
  return createWidgetApiFactory(
    (commonFactory || (() => ({}))) as WidgetApiCommonFactory,
    (moduleFactories || ({})) as unknown as WidgetApiModuleFactories
  )
}

describe('WidgetApi', () => {
  describe('widgetApiFactory()', () => {
    it('should call commonFactory with right args', () => {
      const commonFactory = jest.fn();
      const updateActionBarHandler = () => undefined;
      const setContextMenuFactoryHandler = () => undefined;
      const exposeApiHandler = () => undefined;
      const widgetApiFactory = callCreateWidgetApiFactory({ commonFactory });

      widgetApiFactory(testId, updateActionBarHandler, setContextMenuFactoryHandler, exposeApiHandler, []);

      expect(commonFactory).toHaveBeenCalledTimes(1);
      expect(commonFactory).toHaveBeenCalledWith(testId, updateActionBarHandler, setContextMenuFactoryHandler, exposeApiHandler);
    })
    it('should put props returned by commonFactory into WidgetApi', () => {
      const testProps = {
        key1: 'val1',
        key2: 'val2'
      };
      const widgetApiFactory = callCreateWidgetApiFactory({ commonFactory: () => testProps });

      const gotRes = widgetApiFactory('', () => undefined, () => undefined, () => undefined, []);

      expect(gotRes).toMatchObject(testProps);
    })
    it('should call moduleFactories with widgetId', () => {
      const moduleFactory = jest.fn();
      const moduleName: WidgetApiModuleName = 'clipboard';
      const widgetApiFactory = callCreateWidgetApiFactory({ moduleFactories: { [moduleName]: moduleFactory } });

      widgetApiFactory(testId, () => undefined, () => undefined, () => undefined, [moduleName]);

      expect(moduleFactory).toHaveBeenCalledTimes(1);
      expect(moduleFactory).toHaveBeenCalledWith(testId);
    })
    it('should put module objects returned by moduleFactories into WidgetApi', () => {
      const testProps = {
        key1: 'val1',
        key2: 'val2'
      };
      const moduleName: WidgetApiModuleName = 'clipboard';
      const widgetApiFactory = callCreateWidgetApiFactory({ moduleFactories: { [moduleName]: () => testProps } });

      const gotRes = widgetApiFactory('', () => undefined, () => undefined, () => undefined, [moduleName]);

      expect(gotRes).toMatchObject({
        [moduleName]: testProps
      });
    })
    it('should only call moduleFactories specified by availableModules', () => {
      const testProps1 = {
        key1: 'val1',
        key2: 'val2'
      };
      const testProps2 = {
        key3: 'val3',
        key4: 'val4'
      };
      const testProps3 = {
        key5: 'val5',
        key6: 'val6'
      };
      const moduleName1: WidgetApiModuleName = 'clipboard';
      const moduleName2: WidgetApiModuleName = 'process';
      const moduleName3: WidgetApiModuleName = 'shell';
      const widgetApiFactory = callCreateWidgetApiFactory({
        moduleFactories: {
          [moduleName1]: () => testProps1,
          [moduleName2]: () => testProps2,
          [moduleName3]: () => testProps3,
        }
      });

      const gotRes = widgetApiFactory('', () => undefined, () => undefined, () => undefined, [moduleName2, moduleName3]);

      expect(gotRes).toMatchObject({
        [moduleName2]: testProps2,
        [moduleName3]: testProps3,
      });
    })
  })
})
