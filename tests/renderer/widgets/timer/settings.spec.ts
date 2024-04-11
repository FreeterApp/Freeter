/*
 * Copyright: (c) 2024, Alex Kaul
 * GNU General Public License v3.0 or later (see COPYING or https://www.gnu.org/licenses/gpl-3.0.txt)
 */

import { settingsEditorComp } from '@/widgets/timer/settings';
import { screen } from '@testing-library/react';
import { setupSettingsSut } from '@tests/widgets/setupSut'
import { fixtureSettings } from './fixtures';

describe('Timer Widget Settings', () => {
  it('should fill inputs with right values', () => {
    const settings = fixtureSettings({ mins: 50 });
    setupSettingsSut(settingsEditorComp, settings);

    expect(screen.getByRole('combobox', { name: /timer/i })).toHaveValue(settings.mins.toString());
  })

  it('should allow to update "mins" setting with an option select', async () => {
    const settings = fixtureSettings({ mins: 10 });
    const { userEvent, getSettings } = setupSettingsSut(settingsEditorComp, settings);
    const select = screen.getByRole('combobox', { name: /timer/i })

    await userEvent.selectOptions(select, '30');
    expect(getSettings()).toEqual({
      ...settings,
      mins: 30
    });
  })
})
