/*
 * Copyright: (c) 2024, Alex Kaul
 * GNU General Public License v3.0 or later (see COPYING or https://www.gnu.org/licenses/gpl-3.0.txt)
 */

import { createSettingsState, defaultEngine, settingsEditorComp, SettingsMode } from '@/widgets/web-query/settings';
import { screen, waitFor } from '@testing-library/react';
import { setupSettingsSut } from '@tests/widgets/setupSut'
import { fixtureSettings } from './fixtures';

describe('createSettingsState()', () => {
  it('should correctly create settings state, when mode is invalid', () => {
    const { mode, ...srcSettings } = fixtureSettings({ engine: '', descr: 'Descr', query: 'Query', url: 'Url' })
    const state = createSettingsState({ ...srcSettings })

    expect(state.mode).toBe(SettingsMode.Browser);
    expect(state.descr).toBe(srcSettings.descr);
    expect(state.engine).toBe('');
    expect(state.query).toBe(srcSettings.query);
    expect(state.url).toBe(srcSettings.url);
  })

  describe('Browser mode', () => {
    it('should correctly create settings state, when engine is not string', () => {
      const { engine, ...srcSettings } = fixtureSettings({ mode: SettingsMode.Browser, descr: 'Descr', query: 'Query', url: 'Url' })
      const state = createSettingsState({ ...srcSettings })

      expect(state.mode).toBe(srcSettings.mode);
      expect(state.descr).toBe('');
      expect(state.engine).toBe(defaultEngine.id);
      expect(state.query).toBe(srcSettings.query);
      expect(state.url).toBe('');
    })

    it('should correctly create settings state, when engine is custom (empty string)', () => {
      const srcSettings = fixtureSettings({ mode: SettingsMode.Browser, engine: '', descr: 'Descr', query: 'Query', url: 'Url' })
      const state = createSettingsState({ ...srcSettings })

      expect(state.mode).toBe(srcSettings.mode);
      expect(state.descr).toBe(srcSettings.descr);
      expect(state.engine).toBe(srcSettings.engine);
      expect(state.query).toBe(srcSettings.query);
      expect(state.url).toBe(srcSettings.url);
    })

    it('should correctly create settings state, when engine is not custom', () => {
      const srcSettings = fixtureSettings({ mode: SettingsMode.Browser, engine: 'ddgo-lite', descr: 'Descr', query: 'Query', url: 'Url' })
      const state = createSettingsState({ ...srcSettings })

      expect(state.mode).toBe(srcSettings.mode);
      expect(state.descr).toBe('');
      expect(state.engine).toBe(srcSettings.engine);
      expect(state.query).toBe(srcSettings.query);
      expect(state.url).toBe('');
    })

    it('should correctly create settings state, when engine does not exist', () => {
      const srcSettings = fixtureSettings({ mode: SettingsMode.Browser, engine: 'NO-SUCH-ID', descr: 'Descr', query: 'Query', url: 'Url' })
      const state = createSettingsState({ ...srcSettings })

      expect(state.mode).toBe(srcSettings.mode);
      expect(state.descr).toBe('');
      expect(state.engine).toBe(defaultEngine.id);
      expect(state.query).toBe(srcSettings.query);
      expect(state.url).toBe('');
    })
  })

  describe('Webpages mode', () => {
    it('should correctly create settings state', () => {
      const srcSettings = fixtureSettings({ mode: SettingsMode.Webpages, descr: 'Descr', engine: '', query: 'Query', url: 'Url' })
      const state = createSettingsState({ ...srcSettings })

      expect(state.mode).toBe(srcSettings.mode);
      expect(state.descr).toBe(srcSettings.descr);
      expect(state.engine).toBe('');
      expect(state.query).toBe(srcSettings.query);
      expect(state.url).toBe('');
    })
  })
})

describe('Web Query Widget Settings', () => {
  it('should fill Mode input with right value', () => {
    const settings = fixtureSettings({ mode: SettingsMode.Webpages });
    setupSettingsSut(settingsEditorComp, settings);

    expect(screen.getByRole('combobox', { name: /mode/i })).toHaveValue(settings.mode.toString());
  })

  it('should allow to update "mode" setting with an option select', async () => {
    const settings = fixtureSettings({ mode: SettingsMode.Webpages });
    const { userEvent, getSettings } = setupSettingsSut(settingsEditorComp, settings);
    const select = screen.getByRole('combobox', { name: /mode/i })

    userEvent.selectOptions(select, SettingsMode.Browser.toString());
    await waitFor(() => expect((screen.getByRole('option', { name: 'Browser App' }) as HTMLOptionElement).selected).toBe(true))
    expect(getSettings()).toEqual({
      ...settings,
      mode: SettingsMode.Browser
    });
  })

  it('should update descr with current engine\'s value, when switching "mode" from Browser to Webpages', async () => {
    const settings = fixtureSettings({ mode: SettingsMode.Browser, engine: defaultEngine.id });
    const { userEvent, getSettings } = setupSettingsSut(settingsEditorComp, settings);
    const select = screen.getByRole('combobox', { name: /mode/i })

    userEvent.selectOptions(select, SettingsMode.Webpages.toString());
    await waitFor(() => expect((screen.getByRole('option', { name: 'Webpage Widgets' }) as HTMLOptionElement).selected).toBe(true))
    expect(getSettings()).toEqual({
      ...settings,
      mode: SettingsMode.Webpages,
      descr: defaultEngine.descr
    });
  })

  describe('Browser mode', () => {
    it('should show right inputs', () => {
      const settings = fixtureSettings({ mode: SettingsMode.Browser });
      setupSettingsSut(settingsEditorComp, settings);

      expect(screen.getByRole('combobox', { name: /query engine/i })).toBeInTheDocument();
      expect(screen.getByRole('textbox', { name: /description/i })).toBeInTheDocument();
      expect(screen.getByRole('textbox', { name: /url template/i })).toBeInTheDocument();
      expect(screen.getByRole('textbox', { name: /query template/i })).toBeInTheDocument();
    })

    it('should fill inputs with right values, when engine==custom', () => {
      const settings = fixtureSettings({ mode: SettingsMode.Browser, engine: '', descr: 'Some Descr', query: 'Some Query', url: 'Some Url' });
      setupSettingsSut(settingsEditorComp, settings);

      expect(screen.getByRole('combobox', { name: /query engine/i })).toHaveValue(settings.engine);
      expect(screen.getByRole('textbox', { name: /description/i })).toHaveValue(settings.descr);
      expect(screen.getByRole('textbox', { name: /url template/i })).toHaveValue(settings.url);
      expect(screen.getByRole('textbox', { name: /query template/i })).toHaveValue(settings.query);
    })

    it('should fill inputs with right values, when engine!==custom', () => {
      const settings = fixtureSettings({ mode: SettingsMode.Browser, engine: defaultEngine.id, descr: 'Some Descr', query: 'Some Query', url: 'Some Url' });
      setupSettingsSut(settingsEditorComp, settings);

      expect(screen.getByRole('combobox', { name: /query engine/i })).toHaveValue(settings.engine);
      expect(screen.getByRole('textbox', { name: /description/i })).toHaveValue(defaultEngine.descr);
      expect(screen.getByRole('textbox', { name: /url template/i })).toHaveValue(defaultEngine.url);
      expect(screen.getByRole('textbox', { name: /query template/i })).toHaveValue(settings.query);
    })

    it('should enable descr/url inputs, when engine==custom', () => {
      const settings = fixtureSettings({ mode: SettingsMode.Browser, engine: '' });
      setupSettingsSut(settingsEditorComp, settings);

      expect(screen.getByRole('textbox', { name: /description/i })).toBeEnabled();
      expect(screen.getByRole('textbox', { name: /url template/i })).toBeEnabled();
    })

    it('should disable descr/url inputs, when engine!==custom', () => {
      const settings = fixtureSettings({ mode: SettingsMode.Browser, engine: defaultEngine.id });
      setupSettingsSut(settingsEditorComp, settings);

      expect(screen.getByRole('textbox', { name: /description/i })).toBeDisabled();
      expect(screen.getByRole('textbox', { name: /url template/i })).toBeDisabled();
    })

    it('should allow to update "engine" setting with an option select', async () => {
      const settings = fixtureSettings({ mode: SettingsMode.Browser, engine: defaultEngine.id });
      const { userEvent, getSettings } = setupSettingsSut(settingsEditorComp, settings);
      const select = screen.getByRole('combobox', { name: /query engine/i })

      userEvent.selectOptions(select, 'goog');
      await waitFor(() => expect((screen.getByRole('option', { name: 'Google' }) as HTMLOptionElement).selected).toBe(true))
      expect(getSettings()).toEqual({
        ...settings,
        engine: 'goog'
      });
    })

    it('should update descr/url with current engine\'s values, when switching "engine" setting from non-custom to custom', async () => {
      const settings = fixtureSettings({ mode: SettingsMode.Browser, engine: defaultEngine.id });
      const { userEvent, getSettings } = setupSettingsSut(settingsEditorComp, settings);
      const select = screen.getByRole('combobox', { name: /query engine/i })

      userEvent.selectOptions(select, '');
      await waitFor(() => expect((screen.getByRole('option', { name: 'Custom Engine' }) as HTMLOptionElement).selected).toBe(true))
      expect(getSettings()).toEqual({
        ...settings,
        engine: '',
        descr: defaultEngine.descr,
        url: defaultEngine.url
      });
    })

    it('should not update descr/url, when switching "engine" setting from custom to non-custom', async () => {
      const settings = fixtureSettings({ mode: SettingsMode.Browser, engine: '' });
      const { userEvent, getSettings } = setupSettingsSut(settingsEditorComp, settings);
      const select = screen.getByRole('combobox', { name: /query engine/i })

      userEvent.selectOptions(select, defaultEngine.id);
      await waitFor(() => expect((screen.getByRole('option', { name: defaultEngine.name }) as HTMLOptionElement).selected).toBe(true))
      expect(getSettings()).toEqual({
        ...settings,
        engine: defaultEngine.id,
      });
    })

    it('should allow to update "descr" setting with a text input', async () => {
      const descr = 'descr';
      const settings = fixtureSettings({ mode: SettingsMode.Browser, engine: '', descr });
      const { userEvent, getSettings } = setupSettingsSut(settingsEditorComp, settings);
      const input = screen.getByRole('textbox', { name: /description/i })

      await userEvent.type(input, '!');

      expect(getSettings()).toEqual({
        ...settings,
        descr: descr + '!'
      });
    })

    it('should allow to update "url" setting with a text input', async () => {
      const url = 'url';
      const settings = fixtureSettings({ mode: SettingsMode.Browser, engine: '', url });
      const { userEvent, getSettings } = setupSettingsSut(settingsEditorComp, settings);
      const input = screen.getByRole('textbox', { name: /url template/i })

      await userEvent.type(input, '!');

      expect(getSettings()).toEqual({
        ...settings,
        url: url + '!'
      });
    })

    it('should allow to update "query" setting with a text input', async () => {
      const query = 'query';
      const settings = fixtureSettings({ mode: SettingsMode.Browser, engine: '', query });
      const { userEvent, getSettings } = setupSettingsSut(settingsEditorComp, settings);
      const input = screen.getByRole('textbox', { name: /query template/i })

      await userEvent.type(input, '!');

      expect(getSettings()).toEqual({
        ...settings,
        query: query + '!'
      });
    })
  })

  describe('Webpages mode', () => {
    it('should show right inputs', () => {
      const settings = fixtureSettings({ mode: SettingsMode.Webpages });
      setupSettingsSut(settingsEditorComp, settings);

      expect(screen.queryByRole('combobox', { name: /query engine/i })).not.toBeInTheDocument();
      expect(screen.getByRole('textbox', { name: /description/i })).toBeInTheDocument();
      expect(screen.queryByRole('textbox', { name: /url template/i })).not.toBeInTheDocument();
      expect(screen.getByRole('textbox', { name: /query template/i })).toBeInTheDocument();
    })

    it('should fill inputs with right values', () => {
      const settings = fixtureSettings({ mode: SettingsMode.Webpages, descr: 'Some Descr', query: 'Some Query' });
      setupSettingsSut(settingsEditorComp, settings);

      expect(screen.getByRole('textbox', { name: /description/i })).toHaveValue(settings.descr);
      expect(screen.getByRole('textbox', { name: /query template/i })).toHaveValue(settings.query);
    })

    it('should enable descr input (even when engine!==custom)', () => {
      const settings = fixtureSettings({ mode: SettingsMode.Webpages, engine: defaultEngine.id });
      setupSettingsSut(settingsEditorComp, settings);

      expect(screen.getByRole('textbox', { name: /description/i })).toBeEnabled();
    })

    it('should allow to update "descr" setting with a text input', async () => {
      const descr = 'descr';
      const settings = fixtureSettings({ mode: SettingsMode.Webpages, descr });
      const { userEvent, getSettings } = setupSettingsSut(settingsEditorComp, settings);
      const input = screen.getByRole('textbox', { name: /description/i })

      await userEvent.type(input, '!');

      expect(getSettings()).toEqual({
        ...settings,
        descr: descr + '!'
      });
    })

    it('should allow to update "query" setting with a text input', async () => {
      const query = 'query';
      const settings = fixtureSettings({ mode: SettingsMode.Webpages, query });
      const { userEvent, getSettings } = setupSettingsSut(settingsEditorComp, settings);
      const input = screen.getByRole('textbox', { name: /query template/i })

      await userEvent.type(input, '!');

      expect(getSettings()).toEqual({
        ...settings,
        query: query + '!'
      });
    })
  })
})
