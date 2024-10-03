/*
 * Copyright: (c) 2024, Alex Kaul
 * GNU General Public License v3.0 or later (see COPYING or https://www.gnu.org/licenses/gpl-3.0.txt)
 */

import { convertBoolToStr, convertNumToStr, convertStrToBool, convertStrToNum, convertStrToUndBool, convertStrToUndNum, convertUndBoolToStr, convertUndNumToStr } from '@/base/convTypes';

describe('ConvTypes', () => {
  describe('convertBoolToStr()', () => {
    it('should return "1" for true', () => {
      expect(convertBoolToStr(true)).toBe('1');
    })

    it('should return "0" for false', () => {
      expect(convertBoolToStr(false)).toBe('0');
    })
  })

  describe('convertStrToBool()', () => {
    it('should return true for "1"', () => {
      expect(convertStrToBool('1')).toBe(true);
    })

    it('should return false for "0"', () => {
      expect(convertStrToBool('0')).toBe(false);
    })
  })

  describe('convertUndBoolToStr()', () => {
    it('should return "1" for true', () => {
      expect(convertUndBoolToStr(true)).toBe('1');
    })

    it('should return "0" for false', () => {
      expect(convertUndBoolToStr(false)).toBe('0');
    })

    it('should return "" for undefined', () => {
      expect(convertUndBoolToStr(undefined)).toBe('');
    })
  })

  describe('convertStrToUndBool()', () => {
    it('should return true for "1"', () => {
      expect(convertStrToUndBool('1')).toBe(true);
    })

    it('should return false for "0"', () => {
      expect(convertStrToUndBool('0')).toBe(false);
    })

    it('should return undefined for ""', () => {
      expect(convertStrToUndBool('')).toBe(undefined);
    })
  })

  describe('convertNumToStr()', () => {
    it('should return "1" for 1', () => {
      expect(convertNumToStr(1)).toBe('1');
    })

    it('should return "0" for 0', () => {
      expect(convertNumToStr(0)).toBe('0');
    })
  })

  describe('convertStrToNum()', () => {
    it('should return 1 for "1"', () => {
      expect(convertStrToNum('1')).toBe(1);
    })

    it('should return 0 for "0"', () => {
      expect(convertStrToNum('0')).toBe(0);
    })

    it('should return NaN for "abc"', () => {
      expect(convertStrToNum('abc')).toBeNaN();
    })
  })

  describe('convertUndNumToStr()', () => {
    it('should return "1" for 1', () => {
      expect(convertUndNumToStr(1)).toBe('1');
    })

    it('should return "0" for 0', () => {
      expect(convertUndNumToStr(0)).toBe('0');
    })

    it('should return "" for undefined', () => {
      expect(convertUndNumToStr(undefined)).toBe('');
    })
  })

  describe('convertStrToUndNum()', () => {
    it('should return 1 for "1"', () => {
      expect(convertStrToUndNum('1')).toBe(1);
    })

    it('should return 0 for "0"', () => {
      expect(convertStrToUndNum('0')).toBe(0);
    })

    it('should return NaN for "abc"', () => {
      expect(convertStrToUndNum('abc')).toBeNaN();
    })

    it('should return undefined for ""', () => {
      expect(convertStrToUndNum('')).toBe(undefined);
    })
  })
})
