/*
 * Copyright: (c) 2024, Alex Kaul
 * GNU General Public License v3.0 or later (see COPYING or https://www.gnu.org/licenses/gpl-3.0.txt)
 */

import { settingsEditorComp } from '@/widgets/link-opener/settings';
import { screen } from '@testing-library/react';
import { setupSettingsSut } from '@tests/widgets/setupSut'
import { fixtureSettings } from './fixtures';

describe('Link Opener Widget Settings', () => {
  it('should fill inputs with right values', () => {
    const settings = fixtureSettings({ urls: ['test://url1', 'test://url2'] });
    setupSettingsSut(settingsEditorComp, settings);

    const urlInputs = screen.getByText('URLs', { exact: true }).parentElement!.querySelectorAll('input');
    expect(urlInputs.length).toBe(2);
    expect(urlInputs[0]).toHaveValue(settings.urls[0]);
    expect(urlInputs[1]).toHaveValue(settings.urls[1]);
  })

  it('should allow to update "urls" setting with text inputs', async () => {
    const testUrls = ['test://url1', 'test://url2'];
    const settings = fixtureSettings({ urls: testUrls });
    const { userEvent, getSettings } = setupSettingsSut(settingsEditorComp, settings);
    const urlInputs = screen.getByText('URLs', { exact: true }).parentElement!.querySelectorAll('input');
    const testInput = urlInputs[1];

    await userEvent.type(testInput, '/test');

    expect(getSettings().urls).toEqual([testUrls[0], testUrls[1] + '/test']);
  })

  it('should allow to add an item to "urls" with a button', async () => {
    const testUrls = ['test://url1', 'test://url2'];
    const settings = fixtureSettings({ urls: testUrls });
    const { userEvent, getSettings } = setupSettingsSut(settingsEditorComp, settings);
    const btn = screen.getByRole('button', { name: 'Add a URL' });

    await userEvent.click(btn);

    expect(getSettings().urls).toEqual([...testUrls, '']);
  })

  it('should allow to remove an item from "urls" with a button', async () => {
    const testUrls = ['test://url1', 'test://url2', 'test://url3'];
    const settings = fixtureSettings({ urls: testUrls });
    const { userEvent, getSettings } = setupSettingsSut(settingsEditorComp, settings);
    const btn = screen.queryAllByRole('button', { name: 'Delete URL' })[1];

    await userEvent.click(btn);

    expect(getSettings().urls).toEqual([testUrls[0], testUrls[2]]);
  })

})
