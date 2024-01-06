/*
 * Copyright: (c) 2024, Alex Kaul
 * GNU General Public License v3.0 or later (see COPYING or https://www.gnu.org/licenses/gpl-3.0.txt)
 */

import { settingsEditorComp, Settings } from '@/widgets/_template/settings';
import { screen, waitFor } from '@testing-library/react';
import { setupSettingsSut } from '@tests/widgets/setupSut'

describe('Template Widget Settings', () => {
  it('should fill inputs with right values', () => {
    const settings: Settings = { text: 'SOME TEXT VALUE' };
    setupSettingsSut(settingsEditorComp, settings);

    expect(screen.getByRole('textbox', { name: /text/i })).toHaveValue(settings.text);
  })

  it('should allow to update "text" setting with a text input', async () => {
    const someText = 'Some text';
    const settings: Settings = { text: '' };
    const expectSettings: Settings = {
      ...settings,
      text: someText
    }
    const { userEvent, getSettings } = setupSettingsSut(settingsEditorComp, settings);
    const input = screen.getByRole('textbox', { name: /text/i })

    userEvent.type(input, someText);
    await waitFor(() => expect(input).toHaveValue(someText))

    expect(getSettings()).toEqual(expectSettings);
  })
})
