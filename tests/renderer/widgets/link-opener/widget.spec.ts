/*
 * Copyright: (c) 2024, Alex Kaul
 * GNU General Public License v3.0 or later (see COPYING or https://www.gnu.org/licenses/gpl-3.0.txt)
 */

import { Settings } from '@/widgets/link-opener/settings';
import { widgetComp } from '@/widgets/link-opener/widget'
import { screen } from '@testing-library/react';
import { SetupWidgetSutOptional, setupWidgetSut } from '@tests/widgets/setupSut'
import { fixtureSettings } from './fixtures';

function setupSut(settings: Settings, optional?: SetupWidgetSutOptional) {
  const { comp, ...rest } = setupWidgetSut(widgetComp, settings, optional);
  return {
    comp,
    ...rest
  }
}

describe('Link Opener Widget', () => {
  it('should render a "not specified" note, if urls is empty', () => {
    setupSut(fixtureSettings({ urls: [] }));

    expect(screen.getByText(/urls not specified/i)).toBeInTheDocument();
  })

  it('should render a "not specified" note, if all urls are empty strings', () => {
    setupSut(fixtureSettings({ urls: ['', ''] }));

    expect(screen.getByText(/urls not specified/i)).toBeInTheDocument();
  })

  it('should render a button with "Open Link" title, if urls has only one non-empty string', () => {
    setupSut(fixtureSettings({ urls: ['one', ''] }));

    expect(screen.getByRole('button', { name: /open link/i })).toBeInTheDocument();
  })

  it('should render a button with "Open Links" title, if urls has multiple non-empty strings', () => {
    setupSut(fixtureSettings({ urls: ['more', 'than', 'one'] }));

    expect(screen.getByRole('button', { name: /open links/i })).toBeInTheDocument();
  })

  it('should call openExternalUrl for each non-empty urls item with right params, when clicking the open button', async () => {
    const openExternalUrl = jest.fn();
    const { userEvent } = setupSut(
      fixtureSettings({ urls: ['', 'test://url1', 'test://url2'] }),
      {
        mockWidgetApi: {
          shell: {
            openExternalUrl
          }
        }
      }
    );

    await userEvent.click(screen.getByRole('button', { name: /open links/i }))

    expect(openExternalUrl).toBeCalledTimes(2);
    expect(openExternalUrl).toHaveBeenNthCalledWith(1, 'test://url1');
    expect(openExternalUrl).toHaveBeenNthCalledWith(2, 'test://url2');
  })
})
