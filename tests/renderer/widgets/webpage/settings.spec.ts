/*
 * Copyright: (c) 2024, Alex Kaul
 * GNU General Public License v3.0 or later (see COPYING or https://www.gnu.org/licenses/gpl-3.0.txt)
 */

import { settingsEditorComp } from '@/widgets/webpage/settings';
import { act, screen, waitFor } from '@testing-library/react';
import { setupSettingsSut } from '@tests/widgets/setupSut'
import { fixtureSettings } from './fixtures';

describe('Webpage Widget Settings', () => {
  beforeEach(() => {
    jest.useFakeTimers()
  })
  afterEach(() => {
    jest.runOnlyPendingTimers()
    jest.useRealTimers()
  })

  it('should fill inputs with right values', () => {
    const settings = fixtureSettings({ url: 'https://www.url.com/', sessionScope: 'wgt' });
    setupSettingsSut(settingsEditorComp, settings);

    expect(screen.getByRole('textbox', { name: /url/i })).toHaveValue(settings.url);
    expect(screen.getByRole('combobox', { name: /session scope/i })).toHaveValue(settings.sessionScope);
  })

  it('should allow to update "sessionScope" setting with an option select', async () => {
    const settings = fixtureSettings({ sessionScope: 'wgt' });
    const { userEvent, getSettings } = setupSettingsSut(settingsEditorComp, settings);
    const select = screen.getByRole('combobox', { name: /session scope/i })

    userEvent.selectOptions(select, 'wfl');
    await waitFor(() => expect((screen.getByRole('option', { name: 'Workflow' }) as HTMLOptionElement).selected).toBe(true))
    expect(getSettings()).toEqual({
      ...settings,
      sessionScope: 'wfl'
    });
  })

  it('should allow to update "sessionPersist" setting with an option select', async () => {
    const settings = fixtureSettings({ sessionPersist: 'persist' });
    const { userEvent, getSettings } = setupSettingsSut(settingsEditorComp, settings);
    const select = screen.getByRole('combobox', { name: /session persistence/i })

    userEvent.selectOptions(select, 'temp');
    await waitFor(() => expect((screen.getByRole('option', { name: 'Temporary' }) as HTMLOptionElement).selected).toBe(true))
    expect(getSettings()).toEqual({
      ...settings,
      sessionPersist: 'temp'
    });
  })

  it('should allow to update "viewMode" setting with an option select', async () => {
    const settings = fixtureSettings({ viewMode: 'mobile' });
    const { userEvent, getSettings } = setupSettingsSut(settingsEditorComp, settings);
    const select = screen.getByRole('combobox', { name: /view mode/i })

    userEvent.selectOptions(select, 'desktop');
    await waitFor(() => expect((screen.getByRole('option', { name: 'Desktop' }) as HTMLOptionElement).selected).toBe(true))
    expect(getSettings()).toEqual({
      ...settings,
      viewMode: 'desktop'
    });
  })

  it('should allow to update "url" setting with a debounced (3s) text input', async () => {
    const url1 = 'https:';
    const url2 = '//url';
    const url3 = '.com'
    const settings = fixtureSettings({ url: '' });
    const { userEvent, getSettings } = setupSettingsSut(settingsEditorComp, settings);
    const input = screen.getByRole('textbox', { name: /url/i })

    userEvent.type(input, url1);
    await waitFor(() => expect(input).toHaveValue(url1))

    act(() => jest.advanceTimersByTime(2000));
    expect(getSettings()).toEqual(settings);

    userEvent.type(input, url2);
    await waitFor(() => expect(input).toHaveValue(url1 + url2))

    act(() => jest.advanceTimersByTime(2000));
    expect(getSettings()).toEqual(settings);

    userEvent.type(input, url3);
    await waitFor(() => expect(input).toHaveValue(url1 + url2 + url3))

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
    const input = screen.getByRole('textbox', { name: /url/i })

    userEvent.type(input, url);
    await waitFor(() => expect(input).toHaveValue(url))
    expect(getSettings()).toEqual(settings);

    fireEvent.blur(input);
    await waitFor(() => expect(getSettings()).toEqual({
      ...settings,
      url
    }));
  })
})
