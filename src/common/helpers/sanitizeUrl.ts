/*
 * Copyright: (c) 2024, Alex Kaul
 * GNU General Public License v3.0 or later (see COPYING or https://www.gnu.org/licenses/gpl-3.0.txt)
 */

export function sanitizeUrl(url: string, defPrefix: string = 'https://'): string {
  url = url.trim();
  try {
    new URL(url);
    return url;
  } catch (e) {
    try {
      const prefixedUrl = defPrefix + url;
      new URL(prefixedUrl);
      return prefixedUrl;
    } catch (e) {
      return '';
    }
  }
}
