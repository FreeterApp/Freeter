/*
 * Copyright: (c) 2024, Alex Kaul
 * GNU General Public License v3.0 or later (see COPYING or https://www.gnu.org/licenses/gpl-3.0.txt)
 */

import { sanitizeUrl } from '@common/helpers/sanitizeUrl';

describe('sanitizeUrl', () => {
  it('should return the url as is, if it is valid', () => {
    const testUrl = 'https://freeter.io/'

    const gotUrl = sanitizeUrl(testUrl);

    expect(gotUrl).toBe(testUrl);
  })

  it('should allow to set a default prefix for scheme-less urls', () => {
    const testPrefix = 'https://';
    const testUrl = 'freeter.io/'

    const gotUrl = sanitizeUrl(testUrl, testPrefix);

    expect(gotUrl).toBe(testPrefix + testUrl);
  })

  it('should return an empty string, if the url is invalid', () => {
    const testUrl = 'invalid^url'

    const gotUrl = sanitizeUrl(testUrl);

    expect(gotUrl).toBe('');
  })
});
