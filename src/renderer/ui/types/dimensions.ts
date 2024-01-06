/*
 * Copyright: (c) 2024, Alex Kaul
 * GNU General Public License v3.0 or later (see COPYING or https://www.gnu.org/licenses/gpl-3.0.txt)
 */

export interface WHPx {
  wPx: number;
  hPx: number;
}

export interface XYPx {
  xPx: number;
  yPx: number;
}

export interface RectPx extends WHPx, XYPx { }
