/*
 * Copyright: (c) 2024, Alex Kaul
 * GNU General Public License v3.0 or later (see COPYING or https://www.gnu.org/licenses/gpl-3.0.txt)
 */

export class Event<T extends unknown[]> {
  private listeners: ((...args: T) => void)[];
  constructor() {
    this.listeners = [];
  }

  hasListener(callback: (...args: T) => void) {
    return (this.listeners.indexOf(callback) > -1);
  }

  addListener(callback: (...args: T) => void) {
    this.listeners.push(callback);
  }

  removeListener(callback: (...args: T) => void) {
    const idx = this.listeners.indexOf(callback);
    if (idx > -1) {
      this.listeners.splice(idx, 1);
    }
  }

  emit(...args: T) {
    this.listeners.forEach(listener => listener(...args));
  }
}
