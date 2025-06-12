/*
 * Copyright: (c) 2024, Alex Kaul
 * GNU General Public License v3.0 or later (see COPYING or https://www.gnu.org/licenses/gpl-3.0.txt)
 */

import { Settings, SettingsSessionPersist, SettingsSessionScope } from '@/widgets/webpage/settings';
import { widgetComp } from '@/widgets/webpage/widget'
import { screen } from '@testing-library/react';
import { SetupWidgetSutOptional, setupWidgetSut } from '@tests/widgets/setupSut'
import { fixtureSettings } from './fixtures';
import { WidgetEnv, EntityId } from '@/widgets/appModules';

function setupWebpageWidgetSut(settings: Settings, optional?: SetupWidgetSutOptional) {
  const { comp, ...rest } = setupWidgetSut(widgetComp, settings, optional);
  const webview = comp.container.getElementsByTagName('webview')[0];
  return {
    comp,
    webview,
    ...rest
  }
}

describe('Webpage Widget', () => {
  it('should render a "not specified" note, if url is empty', () => {
    setupWebpageWidgetSut(fixtureSettings({ url: '' }));

    expect(screen.getByText(/webpage url not specified/i)).toBeInTheDocument();
  })
  it('should not render a "not specified" note, if url is not empty', () => {
    setupWebpageWidgetSut(fixtureSettings({ url: '127.0.0.1' }));

    expect(screen.queryByText(/webpage url not specified/i)).not.toBeInTheDocument();
  })
  it('should render a <webview> element, if url is not empty', () => {
    const { comp } = setupWebpageWidgetSut(fixtureSettings({ url: '127.0.0.1' }));

    expect(comp.container.getElementsByTagName('webview').length).toBe(1);
  })
  it('should not render a <webview> element, if url is empty', () => {
    const { comp } = setupWebpageWidgetSut(fixtureSettings({ url: '' }));

    expect(comp.container.getElementsByTagName('webview').length).toBe(0);
  })
  it('should not re-render <webview> element in DOM, when url changes', () => {
    const { comp, setSettings } = setupWebpageWidgetSut(fixtureSettings({ url: '127.0.0.1' }));
    const elem = comp.container.getElementsByTagName('webview')[0];

    setSettings(fixtureSettings({ url: 'new.url' }));

    expect(comp.container.getElementsByTagName('webview')[0]).toBe(elem);
  })
  it('should not re-render <webview> element in DOM, when sessionScope change does not cause webview partition change', () => {
    const { comp, setSettings } = setupWebpageWidgetSut(fixtureSettings({ sessionScope: 'prj' }), { env: { area: 'shelf' } });
    const elem = comp.container.getElementsByTagName('webview')[0];

    setSettings(fixtureSettings({ sessionScope: 'wfl' }));

    expect(comp.container.getElementsByTagName('webview')[0]).toBe(elem);
  })
  it('should re-render <webview> element in DOM, when sessionScope change causes webview partition change', () => {
    const { comp, setSettings } = setupWebpageWidgetSut(fixtureSettings({ sessionScope: 'wgt' }), { env: { area: 'shelf' } });
    const elem = comp.container.getElementsByTagName('webview')[0];

    setSettings(fixtureSettings({ sessionScope: 'wfl' }));

    expect(comp.container.getElementsByTagName('webview')[0]).not.toBe(elem);
  })
  it('should re-render <webview> element in DOM, when sessionPersist changes', () => {
    const { comp, setSettings } = setupWebpageWidgetSut(fixtureSettings({ sessionPersist: 'persist' }));
    const elem = comp.container.getElementsByTagName('webview')[0];

    setSettings(fixtureSettings({ sessionPersist: 'temp' }));

    expect(comp.container.getElementsByTagName('webview')[0]).not.toBe(elem);
  })
  describe('webview src attribute', () => {
    it('should be as specified by the url setting', () => {
      const testUrl = 'http://127.0.0.1/';
      const { webview } = setupWebpageWidgetSut(fixtureSettings({ url: testUrl }));

      expect(webview).toHaveAttribute('src', testUrl);
    })
    it('should be trimmed', () => {
      const { webview } = setupWebpageWidgetSut(fixtureSettings({ url: '       http://127.0.0.1/      ' }));

      expect(webview).toHaveAttribute('src', 'http://127.0.0.1/');
    })
    it('should be prefixed with the https:// protocol, if url does not have a protocol', () => {
      const { webview } = setupWebpageWidgetSut(fixtureSettings({ url: '127.0.0.1' }));

      expect(webview).toHaveAttribute('src', 'https://127.0.0.1');
    })
    it('should be empty, if url is invalid after prefixing with the https://', () => {
      const { webview } = setupWebpageWidgetSut(fixtureSettings({ url: ':' }));

      expect(webview).not.toHaveAttribute('src');
    })
  })
  describe('webview partition attribute', () => {
    const projectId = 'PROJECT-ID';
    const workflowId = 'WORKFLOW-ID';
    const widgetId = 'WIDGET-ID';
    it.each<[string, SettingsSessionScope, SettingsSessionPersist, EntityId, WidgetEnv]>([
      ['persist:app', 'app', 'persist', widgetId, { area: 'shelf' }],
      ['persist:shlf', 'prj', 'persist', widgetId, { area: 'shelf' }],
      ['persist:shlf', 'wfl', 'persist', widgetId, { area: 'shelf' }],
      [`persist:wgt:${widgetId}`, 'wgt', 'persist', widgetId, { area: 'shelf' }],

      ['persist:app', 'app', 'persist', widgetId, { area: 'workflow', projectId, workflowId }],
      [`persist:prj:${projectId}`, 'prj', 'persist', widgetId, { area: 'workflow', projectId, workflowId }],
      [`persist:wfl:${workflowId}`, 'wfl', 'persist', widgetId, { area: 'workflow', projectId, workflowId }],
      [`persist:wgt:${widgetId}`, 'wgt', 'persist', widgetId, { area: 'workflow', projectId, workflowId }],

      ['app', 'app', 'temp', widgetId, { area: 'shelf' }],
      ['shlf', 'prj', 'temp', widgetId, { area: 'shelf' }],
      ['shlf', 'wfl', 'temp', widgetId, { area: 'shelf' }],
      [`wgt:${widgetId}`, 'wgt', 'temp', widgetId, { area: 'shelf' }],

      ['app', 'app', 'temp', widgetId, { area: 'workflow', projectId, workflowId }],
      [`prj:${projectId}`, 'prj', 'temp', widgetId, { area: 'workflow', projectId, workflowId }],
      [`wfl:${workflowId}`, 'wfl', 'temp', widgetId, { area: 'workflow', projectId, workflowId }],
      [`wgt:${widgetId}`, 'wgt', 'temp', widgetId, { area: 'workflow', projectId, workflowId }],
    ])(
      'should be "%s" when the sessionScope/sessionPersist settings are "%s"/"%s", widgetId is "%s", env is "%o"',
      (expectedPartition, sessionScope, sessionPersist, widgetId, env) => {
        const { webview } = setupWebpageWidgetSut(fixtureSettings({ sessionScope, sessionPersist }), { env, widgetId });
        expect(webview).toHaveAttribute('partition', expectedPartition);
      }
    )
  })
})
