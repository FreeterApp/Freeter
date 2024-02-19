/*
 * Copyright: (c) 2024, Alex Kaul
 * GNU General Public License v3.0 or later (see COPYING or https://www.gnu.org/licenses/gpl-3.0.txt)
 */

import { Settings } from '@/widgets/commander/settings';
import { widgetComp } from '@/widgets/commander/widget'
import { screen } from '@testing-library/react';
import { SetupWidgetSutOptional, setupWidgetSut } from '@tests/widgets/setupSut'
import { fixtureSettings } from './fixtures';

function setupCommanderWidgetSut(settings: Settings, optional?: SetupWidgetSutOptional) {
  const { comp, ...rest } = setupWidgetSut(widgetComp, settings, optional);
  return {
    comp,
    ...rest
  }
}

describe('Commander Widget', () => {
  it('should render a "not specified" note, if cmds is empty', () => {
    setupCommanderWidgetSut(fixtureSettings({ cmds: [] }));

    expect(screen.getByText(/command-lines not specified/i)).toBeInTheDocument();
  })
  it('should render a "not specified" note, if all cmds are empty strings', () => {
    setupCommanderWidgetSut(fixtureSettings({ cmds: ['', ''] }));

    expect(screen.getByText(/command-lines not specified/i)).toBeInTheDocument();
  })

  it('should render a button with "Execute Command-line" title, if cmds has only one non-empty string', () => {
    setupCommanderWidgetSut(fixtureSettings({ cmds: ['', 'cmd1'] }));

    expect(screen.getByRole('button', { name: /execute Command-line/i })).toBeInTheDocument();
  })

  it('should render a button with "Execute Command-lines" title, if cmds has multiple non-empty string', () => {
    setupCommanderWidgetSut(fixtureSettings({ cmds: ['', 'cmd1', 'cmd2'] }));

    expect(screen.getByRole('button', { name: /execute Command-lines/i })).toBeInTheDocument();
  })

  it('should call execCmdLines with non-empty cmds and cwd, when clicking the execute button', async () => {
    const execCmdLines = jest.fn();
    const { userEvent } = setupCommanderWidgetSut(
      fixtureSettings({ cmds: ['', 'cmd1', '', 'cmd2'], cwd: 'some/dir' }),
      {
        mockWidgetApi: {
          terminal: {
            execCmdLines
          }
        }
      }
    );

    await userEvent.click(screen.getByRole('button', { name: /execute Command-lines/i }))

    expect(execCmdLines).toBeCalledTimes(1);
    expect(execCmdLines).toBeCalledWith(['cmd1', 'cmd2'], 'some/dir');
  })

  it('should call execCmdLines with cwd=undefined, when cwd setting is empty', async () => {
    const execCmdLines = jest.fn();
    const { userEvent } = setupCommanderWidgetSut(
      fixtureSettings({ cmds: ['cmd1', 'cmd2'], cwd: '' }),
      {
        mockWidgetApi: {
          terminal: {
            execCmdLines
          }
        }
      }
    );

    await userEvent.click(screen.getByRole('button', { name: /execute Command-lines/i }))

    expect(execCmdLines).toBeCalledTimes(1);
    expect(execCmdLines).toBeCalledWith(['cmd1', 'cmd2'], undefined);
  })
})
