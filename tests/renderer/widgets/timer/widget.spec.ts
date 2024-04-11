/*
 * Copyright: (c) 2024, Alex Kaul
 * GNU General Public License v3.0 or later (see COPYING or https://www.gnu.org/licenses/gpl-3.0.txt)
 */

import { Settings } from '@/widgets/timer/settings';
import { widgetComp } from '@/widgets/timer/widget'
import { act, screen } from '@testing-library/react';
import { SetupWidgetSutOptional, setupWidgetSut } from '@tests/widgets/setupSut'
import { fixtureSettings } from './fixtures';

function setupTimerWidgetSut(settings: Settings, optional?: SetupWidgetSutOptional) {
  const { comp, ...rest } = setupWidgetSut(widgetComp, settings, optional);
  return {
    comp,
    ...rest
  }
}

describe('Timer Widget', () => {
  beforeEach(() => {
    jest.useFakeTimers()
  })
  afterEach(() => {
    jest.useRealTimers()
  })

  it('should render "05:00", if mins=5', () => {
    setupTimerWidgetSut(fixtureSettings({ mins: 5 }));

    expect(screen.getByText('05:00')).toBeInTheDocument();
  })

  it('should render "90:00", if mins=90', () => {
    setupTimerWidgetSut(fixtureSettings({ mins: 90 }));

    expect(screen.getByText('90:00')).toBeInTheDocument();
  })

  it('should render Start button, if not started', () => {
    setupTimerWidgetSut(fixtureSettings({}));

    expect(screen.getByRole('button', { name: /start/i })).toBeInTheDocument();
  })

  it('should not render Start button, after start', async () => {
    const { userEvent } = setupTimerWidgetSut(fixtureSettings({}));
    const user = userEvent.setup({ delay: null });

    await user.click(screen.getByRole('button', { name: /start/i }));

    expect(screen.queryByRole('button', { name: /start/i })).not.toBeInTheDocument();
  })

  it('should not render Reset button, if not started', async () => {
    setupTimerWidgetSut(fixtureSettings({}));

    expect(screen.queryByRole('button', { name: /reset/i })).not.toBeInTheDocument();
  })

  it('should render Reset button after start', async () => {
    const { userEvent } = setupTimerWidgetSut(fixtureSettings({}));
    const user = userEvent.setup({ delay: null });

    await user.click(screen.getByRole('button', { name: /start/i }));

    expect(screen.getByRole('button', { name: /reset/i })).toBeInTheDocument();
  })

  it('should not render Reset button after reset', async () => {
    const { userEvent } = setupTimerWidgetSut(fixtureSettings({}));
    const user = userEvent.setup({ delay: null });

    await user.click(screen.getByRole('button', { name: /start/i }));
    await user.click(screen.getByRole('button', { name: /reset/i }));

    expect(screen.queryByRole('button', { name: /reset/i })).not.toBeInTheDocument();
  })

  it('should not update MM:SS, if not started', () => {
    setupTimerWidgetSut(fixtureSettings({ mins: 90 }));

    act(() => jest.advanceTimersByTime(5000));

    expect(screen.getByText('90:00')).toBeInTheDocument();

    act(() => jest.advanceTimersByTime(5000));

    expect(screen.getByText('90:00')).toBeInTheDocument();
  })

  it('should update MM:SS, after start', async () => {
    const { userEvent } = setupTimerWidgetSut(fixtureSettings({ mins: 90 }));
    const user = userEvent.setup({ delay: null });
    await user.click(screen.getByRole('button', { name: /start/i }));

    act(() => jest.advanceTimersByTime(5000));

    expect(screen.queryByText('90:00')).not.toBeInTheDocument();
    expect(screen.getByText('89:55')).toBeInTheDocument();

    act(() => jest.advanceTimersByTime(5000));

    expect(screen.getByText('89:50')).toBeInTheDocument();
  })

  it('should reset MM:SS, after reset', async () => {
    const { userEvent } = setupTimerWidgetSut(fixtureSettings({ mins: 90 }));
    const user = userEvent.setup({ delay: null });
    await user.click(screen.getByRole('button', { name: /start/i }));

    act(() => jest.advanceTimersByTime(5000));

    expect(screen.getByText('89:55')).toBeInTheDocument();

    await user.click(screen.getByRole('button', { name: /reset/i }));

    expect(screen.queryByText('89:55')).not.toBeInTheDocument();
    expect(screen.getByText('90:00')).toBeInTheDocument();
  })

  it('should not update MM:SS after reset', async () => {
    const { userEvent } = setupTimerWidgetSut(fixtureSettings({ mins: 90 }));
    const user = userEvent.setup({ delay: null });
    await user.click(screen.getByRole('button', { name: /start/i }));

    act(() => jest.advanceTimersByTime(5000));

    expect(screen.getByText('89:55')).toBeInTheDocument();

    await user.click(screen.getByRole('button', { name: /reset/i }));

    expect(screen.getByText('90:00')).toBeInTheDocument();

    act(() => jest.advanceTimersByTime(5000));

    expect(screen.getByText('90:00')).toBeInTheDocument();
  })

  it('should correctly stop when timer ends', async () => {
    const { userEvent } = setupTimerWidgetSut(fixtureSettings({ mins: 5 }));
    const user = userEvent.setup({ delay: null });
    await user.click(screen.getByRole('button', { name: /start/i }));

    act(() => jest.advanceTimersByTime(295000));

    expect(screen.getByText('00:05')).toBeInTheDocument();

    act(() => jest.advanceTimersByTime(5000));

    expect(screen.getByText('00:00')).toBeInTheDocument();

    act(() => jest.advanceTimersByTime(1000));

    expect(screen.getByText('05:00')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /start/i })).toBeInTheDocument();
    expect(screen.queryByRole('button', { name: /reset/i })).not.toBeInTheDocument();

    act(() => jest.advanceTimersByTime(5000));

    expect(screen.getByText('05:00')).toBeInTheDocument();
  })
})
