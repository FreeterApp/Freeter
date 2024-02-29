/*
 * Copyright: (c) 2024, Alex Kaul
 * GNU General Public License v3.0 or later (see COPYING or https://www.gnu.org/licenses/gpl-3.0.txt)
 */

import { settingsEditorComp } from '@/widgets/to-do-list/settings';
import { screen } from '@testing-library/react';
import { setupSettingsSut } from '@tests/widgets/setupSut'
import { fixtureSettings } from './fixtures';

describe('To-Do List Widget Settings', () => {
  it('should fill inputs with right values', () => {
    const settings = fixtureSettings({ doneToBottom: true });
    setupSettingsSut(settingsEditorComp, settings);

    expect(screen.getByRole('checkbox', { name: /move it to bottom/i })).toBeChecked();
  })

  it('should allow to update "doneToBottom" setting with a checkbox', async () => {
    const settings = fixtureSettings({ doneToBottom: true });
    const { userEvent, getSettings } = setupSettingsSut(settingsEditorComp, settings);
    const checkbox = screen.getByRole('checkbox', { name: /move it to bottom/i })

    await userEvent.click(checkbox);

    expect(getSettings()).toEqual({
      ...settings,
      doneToBottom: false
    });

    await userEvent.click(checkbox);

    expect(getSettings()).toEqual({
      ...settings,
      doneToBottom: true
    });
  })
})
