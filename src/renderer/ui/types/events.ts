/*
 * Copyright: (c) 2024, Alex Kaul
 * GNU General Public License v3.0 or later (see COPYING or https://www.gnu.org/licenses/gpl-3.0.txt)
 */

import react from 'react';

export type ContextMenuEvent<E = MouseEvent> = E & {
  contextData?: unknown;
}

export type ReactContextMenuEvent<T = Element, E = MouseEvent> = react.MouseEvent<T, ContextMenuEvent<E>>;
