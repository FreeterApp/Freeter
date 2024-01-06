/*
 * Copyright: (c) 2024, Alex Kaul
 * GNU General Public License v3.0 or later (see COPYING or https://www.gnu.org/licenses/gpl-3.0.txt)
 */

import { Event } from '@/helpers';

describe('Event', () => {
  it('can add a listener', () => {
    const event = new Event();
    const callback = jest.fn();

    expect(event.hasListener(callback)).toBe(false);

    event.addListener(callback);

    expect(event.hasListener(callback)).toBe(true);
  })

  it('can remove a listener', () => {
    const event = new Event();
    const callback = jest.fn();

    event.addListener(callback);
    expect(event.hasListener(callback)).toBe(true);

    event.removeListener(callback);
    expect(event.hasListener(callback)).toBe(false);
  })

  it('invokes all registered listeners when the event is emitted ', () => {
    const event = new Event<[] | [number, string, Record<string, unknown>, unknown[]]>();
    const callback1 = jest.fn();
    const callback2 = jest.fn();

    event.addListener(callback1);

    event.emit();
    expect(callback1.mock.calls.length).toBe(1);
    expect(callback1.mock.calls[0][0]).toBeUndefined();

    event.addListener(callback2);
    event.emit(10, 'str', { key: 'val' }, [1, 2, 3]);
    expect(callback1.mock.calls.length).toBe(2);
    expect(callback2.mock.calls.length).toBe(1);
    expect(callback1.mock.calls[1][0]).toBe(10);
    expect(callback1.mock.calls[1][1]).toBe('str');
    expect(callback1.mock.calls[1][2]).toEqual({ key: 'val' });
    expect(callback1.mock.calls[1][3]).toEqual([1, 2, 3]);
    expect(callback2.mock.calls[0][0]).toBe(10);
    expect(callback2.mock.calls[0][1]).toBe('str');
    expect(callback2.mock.calls[0][2]).toEqual({ key: 'val' });
    expect(callback2.mock.calls[0][3]).toEqual([1, 2, 3]);

    event.removeListener(callback1);

    event.emit();
    expect(callback1.mock.calls.length).toBe(2);
    expect(callback2.mock.calls.length).toBe(2);
  })
});
