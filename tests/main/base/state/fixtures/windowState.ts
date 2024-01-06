/*
 * Copyright: (c) 2024, Alex Kaul
 * GNU General Public License v3.0 or later (see COPYING or https://www.gnu.org/licenses/gpl-3.0.txt)
 */

import { WindowState } from '@/base/state/window';
import { StateInStore } from '@common/application/interfaces/store';
import { deepFreeze } from '@common/helpers/deepFreeze';

const windowState: WindowState = {
  x: 10,
  y: 20,
  w: 30,
  h: 40,
  isFull: false,
  isMaxi: false,
  isMini: false
};

type WindowStateTestData = Partial<StateInStore<WindowState>>;

export const fixtureWindowState = (
  testData: WindowStateTestData
) => deepFreeze({
  ...windowState,
  ...testData
});
