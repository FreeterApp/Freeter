/*
 * Copyright: (c) 2024, Alex Kaul
 * GNU General Public License v3.0 or later (see COPYING or https://www.gnu.org/licenses/gpl-3.0.txt)
 */

import { settingsEditorComp } from '@/widgets/note/settings';
import { screen } from '@testing-library/react';
import { setupSettingsSut } from '@tests/widgets/setupSut'
import { fixtureSettings } from './fixtures';

describe('Note Widget Settings', () => {
  it('should fill inputs with right values', () => {
    const settings = fixtureSettings({ spellCheck: true });
    setupSettingsSut(settingsEditorComp, settings);

    expect(screen.getByRole('checkbox', { name: /Enable spell checking/i })).toBeChecked();
  })

  it('should allow to update "spellCheck" setting with a checkbox', async () => {
    const settings = fixtureSettings({ spellCheck: true });
    const { userEvent, getSettings } = setupSettingsSut(settingsEditorComp, settings);
    const checkbox = screen.getByRole('checkbox', { name: /Enable spell checking/i })

    await userEvent.click(checkbox);

    expect(getSettings()).toEqual({
      ...settings,
      spellCheck: false
    });

    await userEvent.click(checkbox);

    expect(getSettings()).toEqual({
      ...settings,
      spellCheck: true
    });
  })
})
