/*
 * Copyright: (c) 2024, Alex Kaul
 * GNU General Public License v3.0 or later (see COPYING or https://www.gnu.org/licenses/gpl-3.0.txt)
 */

// Original identity-obj-proxy: https://github.com/keyz/identity-obj-proxy/blob/master/src/index.js
// Updated to support ES named exports for styles
module.exports = new Proxy({}, {
  get: function getter(target, key) {
    if (key === '__esModule') {
      return true;
    }
    // If the code looks for 'default' (common in ESM), return the proxy itself
    if (key === 'default') {
      return new Proxy({}, { get: (_, k) => k });
    }
    // Return the key as the class name, but only if it's a string
    return typeof key === 'string' ? key : target[key];
  }
})
