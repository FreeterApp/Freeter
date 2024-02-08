/*
 * Copyright: (c) 2024, Alex Kaul
 * GNU General Public License v3.0 or later (see COPYING or https://www.gnu.org/licenses/gpl-3.0.txt)
 */

/**
 * Taken from electron.d.ts and updated with generic types
 */
interface ElectronIpcRenderer {
  invoke<TArgs extends unknown[], TRes>(channel: string, ...args: TArgs): Promise<TRes>;
  on<TArgs extends unknown[]>(channel: string, listener: (...args: TArgs) => void): this;
  once<TArgs extends unknown[]>(channel: string, listener: (...args: TArgs) => void): this;
  removeListener<TArgs extends unknown[]>(channel: string, listener: (...args: TArgs) => void): this;
  send<TArgs extends unknown[]>(channel: string, ...args: TArgs): void;
}

export interface MainApi {
  electronIpcRenderer: ElectronIpcRenderer;
}
