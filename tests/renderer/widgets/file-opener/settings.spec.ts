/*
 * Copyright: (c) 2024, Alex Kaul
 * GNU General Public License v3.0 or later (see COPYING or https://www.gnu.org/licenses/gpl-3.0.txt)
 */

import { settingsEditorComp } from '@/widgets/file-opener/settings';
import { OpenDialogResult } from '@/widgets/appModules';
import { screen } from '@testing-library/react';
import { setupSettingsSut } from '@tests/widgets/setupSut'
import { fixtureSettings } from './fixtures';
import { SettingsType } from '@/widgets/file-opener/settingsType';

describe('File Opener Widget Settings', () => {
  it('should display file-specific inputs, when type=File', () => {
    const settings = fixtureSettings({ type: SettingsType.File, files: ['file/path1'] });
    setupSettingsSut(settingsEditorComp, settings);

    const fileInputs = screen.getByText('Files', { exact: true }).parentElement!.querySelectorAll('input');
    expect(fileInputs.length).toBe(1);

    const folderInputsArea = screen.queryByText('Folders', { exact: true });
    expect(folderInputsArea).not.toBeInTheDocument();
  })

  it('should display folder-specific inputs, when type=Folder', () => {
    const settings = fixtureSettings({ type: SettingsType.Folder, folders: ['folder/path1'] });
    setupSettingsSut(settingsEditorComp, settings);

    const fileInputsArea = screen.queryByText('Files', { exact: true });
    expect(fileInputsArea).not.toBeInTheDocument();

    const folderInputs = screen.getByText('Folders', { exact: true }).parentElement!.querySelectorAll('input');
    expect(folderInputs.length).toBe(1);
  })

  it('should fill inputs with right values, when type=file', () => {
    const settings = fixtureSettings({ type: SettingsType.File, files: ['file/path1', 'file/path2'] });
    setupSettingsSut(settingsEditorComp, settings);

    expect(screen.getByRole('combobox', { name: /^type$/i })).toHaveValue(settings.type.toString());
    const fileInputs = screen.getByText('Files', { exact: true }).parentElement!.querySelectorAll('input');
    expect(fileInputs.length).toBe(2);
    expect(fileInputs[0]).toHaveValue(settings.files[0]);
    expect(fileInputs[1]).toHaveValue(settings.files[1]);
  })

  it('should fill inputs with right values, when type=folder', () => {
    const settings = fixtureSettings({ type: SettingsType.Folder, folders: ['folder/path1', 'folder/path2'] });
    setupSettingsSut(settingsEditorComp, settings);

    expect(screen.getByRole('combobox', { name: /^type$/i })).toHaveValue(settings.type.toString());
    const foldernputs = screen.getByText('Folders', { exact: true }).parentElement!.querySelectorAll('input');
    expect(foldernputs.length).toBe(2);
    expect(foldernputs[0]).toHaveValue(settings.folders[0]);
    expect(foldernputs[1]).toHaveValue(settings.folders[1]);
  })

  it('should allow to update "type" setting with an option select', async () => {
    const settings = fixtureSettings({ type: SettingsType.File });
    const { userEvent, getSettings } = setupSettingsSut(settingsEditorComp, settings);
    const select = screen.getByRole('combobox', { name: /^type$/i })

    await userEvent.selectOptions(select, SettingsType.Folder.toString());
    expect((screen.getByRole('option', { name: 'Open Folder(s)' }) as HTMLOptionElement).selected).toBe(true)
    expect(getSettings()).toEqual({
      ...settings,
      type: SettingsType.Folder
    });
  })

  it('should allow to update "files" setting with text inputs', async () => {
    const testFiles = ['file/path1', 'file/path2'];
    const settings = fixtureSettings({ type: SettingsType.File, files: testFiles });
    const { userEvent, getSettings } = setupSettingsSut(settingsEditorComp, settings);
    const fileInputs = screen.getByText('Files', { exact: true }).parentElement!.querySelectorAll('input');
    const testInput = fileInputs[1];

    await userEvent.type(testInput, '/test');

    expect(getSettings().files).toEqual([testFiles[0], testFiles[1] + '/test']);
  })

  it('should allow to update "folders" setting with text inputs', async () => {
    const testFolders = ['folder/path1', 'folder/path2'];
    const settings = fixtureSettings({ type: SettingsType.Folder, folders: testFolders });
    const { userEvent, getSettings } = setupSettingsSut(settingsEditorComp, settings);
    const folderInputs = screen.getByText('Folders', { exact: true }).parentElement!.querySelectorAll('input');
    const testInput = folderInputs[1];

    await userEvent.type(testInput, '/test');

    expect(getSettings().folders).toEqual([testFolders[0], testFolders[1] + '/test']);
  })

  it('should allow to add an item to "files" with a button', async () => {
    const testFiles = ['file/path1', 'file/path2'];
    const settings = fixtureSettings({ type: SettingsType.File, files: testFiles });
    const { userEvent, getSettings } = setupSettingsSut(settingsEditorComp, settings);
    const btn = screen.getByRole('button', { name: 'Add a file path' });

    await userEvent.click(btn);

    expect(getSettings().files).toEqual([...testFiles, '']);
  })

  it('should allow to add an item to "folders" with a button', async () => {
    const testFolders = ['folder/path1', 'folder/path2'];
    const settings = fixtureSettings({ type: SettingsType.Folder, folders: testFolders });
    const { userEvent, getSettings } = setupSettingsSut(settingsEditorComp, settings);
    const btn = screen.getByRole('button', { name: 'Add a folder path' });

    await userEvent.click(btn);

    expect(getSettings().folders).toEqual([...testFolders, '']);
  })

  it('should allow to remove an item from "files" with a button', async () => {
    const testFiles = ['file/path1', 'file/path2', 'file/path3'];
    const settings = fixtureSettings({ type: SettingsType.File, files: testFiles });
    const { userEvent, getSettings } = setupSettingsSut(settingsEditorComp, settings);
    const btn = screen.queryAllByRole('button', { name: 'Delete File Path' })[1];

    await userEvent.click(btn);

    expect(getSettings().files).toEqual([testFiles[0], testFiles[2]]);
  })

  it('should allow to remove an item from "folders" with a button', async () => {
    const testFolders = ['folder/path1', 'folder/path2', 'folder/path3'];
    const settings = fixtureSettings({ type: SettingsType.Folder, folders: testFolders });
    const { userEvent, getSettings } = setupSettingsSut(settingsEditorComp, settings);
    const btn = screen.queryAllByRole('button', { name: 'Delete Folder Path' })[1];

    await userEvent.click(btn);

    expect(getSettings().folders).toEqual([testFolders[0], testFolders[2]]);
  })

  it('should allow to update a "files" item with an open dir dialog', async () => {
    const testFiles = ['file/path1', 'file/path2'];
    const pickedFile = 'picked/file';
    const odRes: OpenDialogResult = { filePaths: [pickedFile], canceled: false };
    const settings = fixtureSettings({ type: SettingsType.File, files: testFiles });
    const { userEvent, getSettings } = setupSettingsSut(settingsEditorComp, settings, {
      mockSettingsApi: {
        dialog: {
          showOpenFileDialog: jest.fn().mockResolvedValue(odRes)
        }
      }
    });
    const btn = screen.getAllByRole('button', { name: /select file/i })[1];

    await userEvent.click(btn);

    expect(getSettings().files).toEqual([testFiles[0], pickedFile]);
  })

  it('should allow to update a "folders" item with an open dir dialog', async () => {
    const testFolders = ['folder/path1', 'folder/path2'];
    const pickedFolder = 'picked/folder';
    const odRes: OpenDialogResult = { filePaths: [pickedFolder], canceled: false };
    const settings = fixtureSettings({ type: SettingsType.Folder, files: testFolders });
    const { userEvent, getSettings } = setupSettingsSut(settingsEditorComp, settings, {
      mockSettingsApi: {
        dialog: {
          showOpenDirDialog: jest.fn().mockResolvedValue(odRes)
        }
      }
    });
    const btn = screen.getAllByRole('button', { name: /select folder/i })[1];

    await userEvent.click(btn);

    expect(getSettings().folders).toEqual([testFolders[0], pickedFolder]);
  })
})
