/*
 * Copyright: (c) 2024, Alex Kaul
 * GNU General Public License v3.0 or later (see COPYING or https://www.gnu.org/licenses/gpl-3.0.txt)
 */

import { settingsEditorComp } from '@/widgets/timer/settings';
import { screen } from '@testing-library/react';
import { setupSettingsSut } from '@tests/widgets/setupSut'
import { fixtureSettings } from './fixtures';
import { glockenspielArpeggioId } from '@/widgets/timer/audio/timer-end';

function setupAudioMock() {
  const load = jest.spyOn(window.Audio.prototype, 'load').mockImplementation(() => { })
  const play = jest.spyOn(window.Audio.prototype, 'play').mockImplementation(() => { })
  const pause = jest.spyOn(window.Audio.prototype, 'pause').mockImplementation(() => { })
  return {
    audioMock: {
      load,
      play,
      pause
    }
  }
}

describe('Timer Widget Settings', () => {
  it('should fill inputs with right values', () => {
    const settings = fixtureSettings({ mins: 50 });
    setupAudioMock();
    setupSettingsSut(settingsEditorComp, settings);

    expect(screen.getByRole('combobox', { name: /^timer$/i })).toHaveValue(settings.mins.toString());
  })

  it('should allow to update "mins" setting with an option select', async () => {
    const settings = fixtureSettings({ mins: 10 });
    setupAudioMock();
    const { userEvent, getSettings } = setupSettingsSut(settingsEditorComp, settings);
    const select = screen.getByRole('combobox', { name: /^timer$/i })

    await userEvent.selectOptions(select, '30');
    expect(getSettings()).toEqual({
      ...settings,
      mins: 30
    });
  })

  it('should allow to update "endSound" setting with an option select', async () => {
    const settings = fixtureSettings({ endSound: glockenspielArpeggioId });
    setupAudioMock();
    const { userEvent, getSettings } = setupSettingsSut(settingsEditorComp, settings);
    const select = screen.getByRole('combobox', { name: /^Play Sound When Timer Ends$/i })

    await userEvent.selectOptions(select, '');
    expect(getSettings()).toEqual({
      ...settings,
      endSound: ''
    });
  })

  it('should allow to update "endSoundVol" setting with an option select', async () => {
    const settings = fixtureSettings({ endSoundVol: 90 });
    setupAudioMock();
    const { userEvent, getSettings } = setupSettingsSut(settingsEditorComp, settings);
    const select = screen.getByRole('combobox', { name: /^End Sound Volume$/i })

    await userEvent.selectOptions(select, '30');
    expect(getSettings()).toEqual({
      ...settings,
      endSoundVol: 30
    });
  })
})
