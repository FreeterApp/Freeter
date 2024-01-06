/*
 * Copyright: (c) 2024, Alex Kaul
 * GNU General Public License v3.0 or later (see COPYING or https://www.gnu.org/licenses/gpl-3.0.txt)
 */

import { debounce } from '@common/helpers/debounce';

jest.useFakeTimers();

describe('debounce', () => {
  describe('debounced function', () => {
    it('should not call the function after 1 sec, when delay is 2 secs', async () => {
      const fn = jest.fn();
      const debouncedFn = debounce(fn, 2000);

      debouncedFn()
      jest.advanceTimersByTime(1000);

      expect(fn).not.toBeCalled();
    })

    it('should call the function after 2 secs, when delay is 2 secs', () => {
      const fn = jest.fn();
      const debouncedFn = debounce(fn, 2000);

      debouncedFn()
      jest.advanceTimersByTime(2000);

      expect(fn).toBeCalled();
    })

    it('should call the function one time after a series of calls, with args from a last call', () => {
      const fn = jest.fn();
      const args1 = ['a', 1];
      const args2 = ['b', 2];
      const args3 = ['c', 3];
      const debouncedFn = debounce(fn, 2000);

      debouncedFn(...args1)
      jest.advanceTimersByTime(1000);

      expect(fn).not.toBeCalled();

      debouncedFn(...args2)
      jest.advanceTimersByTime(1000);

      expect(fn).not.toBeCalled();

      debouncedFn(...args3)
      jest.advanceTimersByTime(2000);

      expect(fn).toBeCalledTimes(1);
      expect(fn).toBeCalledWith(...args3);
    })
  })

  describe('cancel', () => {
    it('should cancel a call of the debounced function', () => {
      const fn = jest.fn();
      const debouncedFn = debounce(fn, 2000);

      debouncedFn()
      debouncedFn.cancel();
      jest.advanceTimersByTime(2000);

      expect(fn).not.toBeCalled();
    })
  })
})
