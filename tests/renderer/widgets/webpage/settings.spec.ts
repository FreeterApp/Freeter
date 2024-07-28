/*
 * Copyright: (c) 2024, Alex Kaul
 * GNU General Public License v3.0 or later (see COPYING or https://www.gnu.org/licenses/gpl-3.0.txt)
 */

import { settingsEditorComp } from '@/widgets/webpage/settings';
import { act, screen } from '@testing-library/react';
import { setupSettingsSut } from '@tests/widgets/setupSut'
import { fixtureSettings } from './fixtures';

jest.useFakeTimers()

describe('Webpage Widget Settings', () => {
  it('should fill inputs with right values', () => {
    const settings = fixtureSettings({ url: 'https://www.url.com/', sessionScope: 'wgt', sessionPersist: 'temp', autoReload: 3600 });
    setupSettingsSut(settingsEditorComp, settings);

    expect(screen.getByRole('textbox', { name: /url/i })).toHaveValue(settings.url);
    expect(screen.getByRole('combobox', { name: /session scope/i })).toHaveValue(settings.sessionScope);
    expect(screen.getByRole('combobox', { name: /session persistence/i })).toHaveValue(settings.sessionPersist);
    expect(screen.getByRole('combobox', { name: /Auto-Reload/i })).toHaveValue(settings.autoReload.toString());
  })

  it('should allow to update "sessionScope" setting with an option select', async () => {
    const settings = fixtureSettings({ sessionScope: 'wgt' });
    const { userEvent, getSettings } = setupSettingsSut(settingsEditorComp, settings);
    const user = userEvent.setup({ delay: null });
    const select = screen.getByRole('combobox', { name: /session scope/i })

    await user.selectOptions(select, 'wfl');

    expect(getSettings()).toEqual({
      ...settings,
      sessionScope: 'wfl'
    });
  })

  it('should allow to update "sessionPersist" setting with an option select', async () => {
    const settings = fixtureSettings({ sessionPersist: 'persist' });
    const { userEvent, getSettings } = setupSettingsSut(settingsEditorComp, settings);
    const user = userEvent.setup({ delay: null });
    const select = screen.getByRole('combobox', { name: /session persistence/i })

    await user.selectOptions(select, 'temp');

    expect(getSettings()).toEqual({
      ...settings,
      sessionPersist: 'temp'
    });
  })

  it('should allow to update "autoReload" setting with an option select', async () => {
    const settings = fixtureSettings({ autoReload: 10 });
    const { userEvent, getSettings } = setupSettingsSut(settingsEditorComp, settings);
    const user = userEvent.setup({ delay: null });
    const select = screen.getByRole('combobox', { name: /Auto-Reload/i })

    await user.selectOptions(select, '0');

    expect(getSettings()).toEqual({
      ...settings,
      autoReload: 0
    });

    await user.selectOptions(select, '300');

    expect(getSettings()).toEqual({
      ...settings,
      autoReload: 300
    });
  })

  it('should allow to update "url" setting with a debounced (3s) text input', async () => {
    const url1 = 'https:';
    const url2 = '//url';
    const url3 = '.com'
    const settings = fixtureSettings({ url: '' });
    const { userEvent, getSettings } = setupSettingsSut(settingsEditorComp, settings);
    const user = userEvent.setup({ delay: null });
    const input = screen.getByRole('textbox', { name: /url/i })

    await user.type(input, url1);

    act(() => jest.advanceTimersByTime(2000));
    expect(getSettings()).toEqual(settings);

    await user.type(input, url2);

    act(() => jest.advanceTimersByTime(2000));
    expect(getSettings()).toEqual(settings);

    await user.type(input, url3);

    act(() => jest.advanceTimersByTime(3000));
    expect(getSettings()).toEqual({
      ...settings,
      url: url1 + url2 + url3
    });
  })
  it('should immediately update "url" setting on input blur', async () => {
    const url = 'https://url.com';
    const settings = fixtureSettings({ url: '' });
    const { fireEvent, userEvent, getSettings } = setupSettingsSut(settingsEditorComp, settings);
    const user = userEvent.setup({ delay: null });
    const input = screen.getByRole('textbox', { name: /url/i })

    await user.type(input, url);
    expect(getSettings()).toEqual(settings);

    fireEvent.blur(input);
    expect(getSettings()).toEqual({
      ...settings,
      url
    });
  })
})
