/*
 * Copyright: (c) 2024, Alex Kaul
 * GNU General Public License v3.0 or later (see COPYING or https://www.gnu.org/licenses/gpl-3.0.txt)
 */

import { settingsEditorComp } from '@/widgets/commander/settings';
import { OpenDialogResult } from '@/widgets/types';
import { screen } from '@testing-library/react';
import { setupSettingsSut } from '@tests/widgets/setupSut'
import { fixtureSettings } from './fixtures';

describe('Commander Widget Settings', () => {
  it('should fill inputs with right values', () => {
    const settings = fixtureSettings({ cmds: ['cmd1', 'cmd2'], cwd: 'some/dir' });
    setupSettingsSut(settingsEditorComp, settings);

    const cmdLineInputs = screen.getByText('Command-lines').parentElement!.querySelectorAll('input');
    expect(cmdLineInputs.length).toBe(2);
    expect(cmdLineInputs[0]).toHaveValue(settings.cmds[0]);
    expect(cmdLineInputs[1]).toHaveValue(settings.cmds[1]);
    expect(screen.getByRole('textbox', { name: /working directory/i })).toHaveValue(settings.cwd);
  })

  it('should allow to update "cmds" setting with text inputs', async () => {
    const testCmds = ['cmd1', 'cmd2'];
    const settings = fixtureSettings({ cmds: testCmds });
    const { userEvent, getSettings } = setupSettingsSut(settingsEditorComp, settings);
    const cmdLineInputs = screen.getByText('Command-lines').parentElement!.querySelectorAll('input');
    const testInput = cmdLineInputs[1];

    await userEvent.type(testInput, ' test');

    expect(getSettings().cmds).toEqual([testCmds[0], testCmds[1] + ' test']);
  })

  it('should allow to add an item to "cmds" with a button', async () => {
    const testCmds = ['cmd1', 'cmd2'];
    const settings = fixtureSettings({ cmds: testCmds });
    const { userEvent, getSettings } = setupSettingsSut(settingsEditorComp, settings);
    const btn = screen.getByRole('button', { name: 'Add a command-line' });

    await userEvent.click(btn);

    expect(getSettings().cmds).toEqual([...testCmds, '']);
  })

  it('should allow to remove an item from "cmds" with a button', async () => {
    const testCmds = ['cmd1', 'cmd2', 'cmd3'];
    const settings = fixtureSettings({ cmds: testCmds });
    const { userEvent, getSettings } = setupSettingsSut(settingsEditorComp, settings);
    const btn = screen.queryAllByRole('button', { name: 'Delete Command-line' })[1];

    await userEvent.click(btn);

    expect(getSettings().cmds).toEqual(['cmd1', 'cmd3']);
  })

  it('should allow to update "cwd" setting with a text input', async () => {
    const testCwd = 'test/dir';
    const settings = fixtureSettings({ cwd: testCwd });
    const { userEvent, getSettings } = setupSettingsSut(settingsEditorComp, settings);
    const testInput = screen.getByRole('textbox', { name: /working directory/i });

    await userEvent.type(testInput, '/subdir');

    expect(getSettings().cwd).toEqual(testCwd + '/subdir');
  })

  it('should allow to set "cwd" with an open dir dialog', async () => {
    const initCwd = 'init/dir';
    const pickedCwd = 'picked/dir';
    const odRes: OpenDialogResult = { filePaths: [pickedCwd], canceled: false };
    const settings = fixtureSettings({ cwd: initCwd });
    const { userEvent, getSettings } = setupSettingsSut(settingsEditorComp, settings, {
      mockSettingsApi: {
        dialog: {
          showOpenDirDialog: jest.fn().mockResolvedValue(odRes)
        }
      }
    });
    const btn = screen.getByRole('button', { name: /select directory/i });

    await userEvent.click(btn);

    expect(getSettings().cwd).toEqual(pickedCwd)
  })
})
