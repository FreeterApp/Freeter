/*
 * Copyright: (c) 2024, Alex Kaul
 * GNU General Public License v3.0 or later (see COPYING or https://www.gnu.org/licenses/gpl-3.0.txt)
 */

import { Settings } from '@/widgets/file-opener/settings';
import { widgetComp } from '@/widgets/file-opener/widget'
import { screen } from '@testing-library/react';
import { SetupWidgetSutOptional, setupWidgetSut } from '@tests/widgets/setupSut'
import { fixtureSettings } from './fixtures';
import { SettingsType } from '@/widgets/file-opener/settingsType';
import { fixtureAppA } from '@tests/base/fixtures/app';

function setupSut(settings: Settings, optional?: SetupWidgetSutOptional) {
  const { comp, ...rest } = setupWidgetSut(widgetComp, settings, optional);
  return {
    comp,
    ...rest
  }
}

describe('File Opener Widget', () => {
  it('should render a "not specified" note, if files is empty, when type=file', () => {
    setupSut(fixtureSettings({ type: SettingsType.File, files: [], folders: ['not-empty'] }));

    expect(screen.getByText(/files not specified/i)).toBeInTheDocument();
  })

  it('should render a "not specified" note, if folders is empty, when type=folder', () => {
    setupSut(fixtureSettings({ type: SettingsType.Folder, files: ['not-empty'], folders: [] }));

    expect(screen.getByText(/folders not specified/i)).toBeInTheDocument();
  })

  it('should render a "not specified" note, if all files are empty strings, when type=file', () => {
    setupSut(fixtureSettings({ type: SettingsType.File, files: ['', ''], folders: ['not-empty'] }));

    expect(screen.getByText(/files not specified/i)).toBeInTheDocument();
  })

  it('should render a "not specified" note, if all files are empty strings, when type=folder', () => {
    setupSut(fixtureSettings({ type: SettingsType.Folder, files: ['not-empty'], folders: ['', ''] }));

    expect(screen.getByText(/folders not specified/i)).toBeInTheDocument();
  })

  it('should render a button with "Open File" title, if files has only one non-empty string, when type=file', () => {
    setupSut(fixtureSettings({ type: SettingsType.File, files: ['one', ''], folders: ['more', 'than', 'one'] }));

    expect(screen.getByRole('button', { name: /open file/i })).toBeInTheDocument();
  })

  it('should not render a button with "Open File" title, when type=folder', () => {
    setupSut(fixtureSettings({ type: SettingsType.Folder, files: ['one', ''], folders: ['one', ''] }));

    expect(screen.queryByRole('button', { name: /open file/i })).not.toBeInTheDocument();
  })

  it('should render a button with "Open Folder" title, if folders has only one non-empty string, when type=folder', () => {
    setupSut(fixtureSettings({ type: SettingsType.Folder, files: ['more', 'than', 'one'], folders: ['one', ''] }));

    expect(screen.getByRole('button', { name: /open folder/i })).toBeInTheDocument();
  })

  it('should not render a button with "Open Folder" title, when type=file', () => {
    setupSut(fixtureSettings({ type: SettingsType.File, files: ['one', ''], folders: ['one', ''] }));

    expect(screen.queryByRole('button', { name: /open folder/i })).not.toBeInTheDocument();
  })

  it('should render a button with "Open Files" title, if files has multiple non-empty strings, when type=file', () => {
    setupSut(fixtureSettings({ type: SettingsType.File, files: ['more', 'than', 'one'], folders: ['one'] }));

    expect(screen.getByRole('button', { name: /open files/i })).toBeInTheDocument();
  })

  it('should render a button with "Open Folders" title, if folders has multiple non-empty strings, when type=folder', () => {
    setupSut(fixtureSettings({ type: SettingsType.Folder, files: ['one'], folders: ['more', 'than', 'one'] }));

    expect(screen.getByRole('button', { name: /open folders/i })).toBeInTheDocument();
  })

  it('should call openPath for each non-empty files item with right params on the open button click, when type=file and openIn is empty', async () => {
    const openPath = jest.fn();
    const { userEvent } = setupSut(
      fixtureSettings({ type: SettingsType.File, files: ['', 'file/path1', 'file/path2'], folders: ['', 'folder/path1', 'folder/path2'], openIn: '' }),
      {
        mockWidgetApi: {
          shell: {
            openPath
          }
        }
      }
    );

    await userEvent.click(screen.getByRole('button', { name: /open files/i }))

    expect(openPath).toBeCalledTimes(2);
    expect(openPath).toHaveBeenNthCalledWith(1, 'file/path1');
    expect(openPath).toHaveBeenNthCalledWith(2, 'file/path2');
  })

  it('should call openPath for each non-empty files item with right params on the open button click, when type=file and openIn = unexisting app', async () => {
    const openPath = jest.fn();
    const app = fixtureAppA();
    const { userEvent } = setupSut(
      fixtureSettings({ type: SettingsType.File, files: ['', 'file/path1', 'file/path2'], folders: ['', 'folder/path1', 'folder/path2'], openIn: 'NO-SUCH-ID' }),
      {
        mockWidgetApi: {
          shell: {
            openPath
          }
        },
        sharedState: {
          apps: {
            apps: {
              [app.id]: app
            },
            appIds: [app.id]
          }
        }
      }
    );

    await userEvent.click(screen.getByRole('button', { name: /open files/i }))

    expect(openPath).toBeCalledTimes(2);
    expect(openPath).toHaveBeenNthCalledWith(1, 'file/path1');
    expect(openPath).toHaveBeenNthCalledWith(2, 'file/path2');
  })

  it('should call openApp with right params on the open button click, when type=file and openIn = an existing app id', async () => {
    const openApp = jest.fn();
    const app = fixtureAppA();
    const { userEvent } = setupSut(
      fixtureSettings({ type: SettingsType.File, files: ['', 'file/path1', 'file/path2'], folders: ['', 'folder/path1', 'folder/path2'], openIn: app.id }),
      {
        mockWidgetApi: {
          shell: {
            openApp
          }
        },
        sharedState: {
          apps: {
            apps: {
              [app.id]: app
            },
            appIds: [app.id]
          }
        }
      }
    );

    await userEvent.click(screen.getByRole('button', { name: /open files/i }))

    expect(openApp).toHaveBeenCalledTimes(1);
    expect(openApp).toHaveBeenCalledWith(app.settings.execPath, [app.settings.cmdArgs, 'file/path1', 'file/path2']);
  })

  it('should call openPath for each non-empty folders item with right params on the open button click, when type=folder and openIn is empty', async () => {
    const openPath = jest.fn();
    const { userEvent } = setupSut(
      fixtureSettings({ type: SettingsType.Folder, files: ['', 'file/path1', 'file/path2'], folders: ['', 'folder/path1', 'folder/path2'], openIn: '' }),
      {
        mockWidgetApi: {
          shell: {
            openPath
          }
        }
      }
    );

    await userEvent.click(screen.getByRole('button', { name: /open folders/i }))

    expect(openPath).toBeCalledTimes(2);
    expect(openPath).toHaveBeenNthCalledWith(1, 'folder/path1');
    expect(openPath).toHaveBeenNthCalledWith(2, 'folder/path2');
  })

  it('should call openPath for each non-empty folders item with right params on the open button click, when type=folder and openIn = unexisting app', async () => {
    const openPath = jest.fn();
    const app = fixtureAppA();
    const { userEvent } = setupSut(
      fixtureSettings({ type: SettingsType.Folder, files: ['', 'file/path1', 'file/path2'], folders: ['', 'folder/path1', 'folder/path2'], openIn: 'NO-SUCH-ID' }),
      {
        mockWidgetApi: {
          shell: {
            openPath
          }
        },
        sharedState: {
          apps: {
            apps: {
              [app.id]: app
            },
            appIds: [app.id]
          }
        }
      }
    );

    await userEvent.click(screen.getByRole('button', { name: /open folders/i }))

    expect(openPath).toBeCalledTimes(2);
    expect(openPath).toHaveBeenNthCalledWith(1, 'folder/path1');
    expect(openPath).toHaveBeenNthCalledWith(2, 'folder/path2');
  })

  it('should call openApp with right params on the open button click, when type=folder and openIn = an existing app id', async () => {
    const openApp = jest.fn();
    const app = fixtureAppA();
    const { userEvent } = setupSut(
      fixtureSettings({ type: SettingsType.Folder, files: ['', 'file/path1', 'file/path2'], folders: ['', 'folder/path1', 'folder/path2'], openIn: app.id }),
      {
        mockWidgetApi: {
          shell: {
            openApp
          }
        },
        sharedState: {
          apps: {
            apps: {
              [app.id]: app
            },
            appIds: [app.id]
          }
        }
      }
    );

    await userEvent.click(screen.getByRole('button', { name: /open folders/i }))

    expect(openApp).toHaveBeenCalledTimes(1);
    expect(openApp).toHaveBeenCalledWith(app.settings.execPath, [app.settings.cmdArgs, 'folder/path1', 'folder/path2']);
  })
})
