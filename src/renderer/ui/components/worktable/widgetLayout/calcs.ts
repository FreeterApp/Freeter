/*
 * Copyright: (c) 2024, Alex Kaul
 * GNU General Public License v3.0 or later (see COPYING or https://www.gnu.org/licenses/gpl-3.0.txt)
 */

import { WidgetLayoutItemRect, widgetLayoutVisibleCols, widgetLayoutVisibleRows } from '@/base/widgetLayout';
import { RectPx, WHPx, XYPx } from '@/ui/types/dimensions';

const itemMargin: XYPx = { xPx: 6, yPx: 6 };
const layoutPadding: XYPx = { xPx: 6, yPx: 6 };

/**
 * Functions to calc grid XYWH in pixels and units (cols/rows)
 */

export function clamp(num: number, lowerBound: number, upperBound: number): number {
  return Math.max(Math.min(num, upperBound), lowerBound);
}

export function calcGridColWidth(viewportSize: WHPx): number {
  return (viewportSize.wPx - itemMargin.xPx * (widgetLayoutVisibleCols - 1) - layoutPadding.xPx * 2) / widgetLayoutVisibleCols;
}

export function calcGridRowHeight(viewportSize: WHPx): number {
  return (viewportSize.hPx - itemMargin.yPx * (widgetLayoutVisibleRows - 1) - layoutPadding.yPx * 2) / widgetLayoutVisibleRows;
}

function _itemWHUnitsToPx(wOrHUnits: number, colOrRowSizePx: number, marginPx: number): number {
  if (!Number.isFinite(wOrHUnits)) {
    return wOrHUnits;
  }
  return Math.round(
    colOrRowSizePx * wOrHUnits + Math.max(0, wOrHUnits - 1) * marginPx
  );
}

function _itemXYUnitsToPx(xOrYUnits: number, colOrRowSizePx: number, layoutPaddingXOrYPx: number, marginXOrYPx: number): number {
  if (!Number.isFinite(xOrYUnits)) {
    return xOrYUnits;
  }
  return Math.round((colOrRowSizePx + marginXOrYPx) * xOrYUnits + layoutPaddingXOrYPx);
}

export function itemWUnitsToPx(wUnits: number, colWidthPx: number): number {
  return _itemWHUnitsToPx(wUnits, colWidthPx, itemMargin.xPx)
}

export function itemHUnitsToPx(hUnits: number, rowHeightPx: number): number {
  return _itemWHUnitsToPx(hUnits, rowHeightPx, itemMargin.xPx)
}

export function itemXUnitsToPx(xUnits: number, colWidthPx: number): number {
  return _itemXYUnitsToPx(xUnits, colWidthPx, layoutPadding.xPx, itemMargin.xPx);
}

export function itemYUnitsToPx(yUnits: number, rowHeightPx: number): number {
  return _itemXYUnitsToPx(yUnits, rowHeightPx, layoutPadding.yPx, itemMargin.yPx);
}

export function itemRectUnitsToPx(rectUnits: WidgetLayoutItemRect, colWidthPx: number, rowHeightPx: number): RectPx {
  const wPx = _itemWHUnitsToPx(rectUnits.w, colWidthPx, itemMargin.xPx);
  const hPx = _itemWHUnitsToPx(rectUnits.h, rowHeightPx, itemMargin.yPx);
  const xPx = _itemXYUnitsToPx(rectUnits.x, colWidthPx, layoutPadding.xPx, itemMargin.xPx);
  const yPx = _itemXYUnitsToPx(rectUnits.y, rowHeightPx, layoutPadding.yPx, itemMargin.yPx);

  return { xPx, yPx, wPx, hPx };
}

export function _itemWHPxToUnits(wOrHPx: number, colOrRowSizePx: number, marginXOrYPx: number): number {
  // width = colWidth * w + (margin * (w - 1))
  // width = cW * w + (w * m - m)
  // width = w * (cW + m) - m
  // w * (cW + m) = width + m
  // w = (width + m) / (cW + m)
  // w = (width + margin) / (colWidth + margin)
  return Math.round((wOrHPx + marginXOrYPx) / (colOrRowSizePx + marginXOrYPx));
}

function _itemXYPxToUnits(xOrYPx: number, colOrRowSizePx: number, layoutPaddingXOrYPx: number, marginXOrYPx: number): number {
  // left = colWidth * x + margin * x + layoutpadding
  // l = cx + mx + p
  // l - p = cx + mx
  // l - p = x(c + m)
  // (l - p) / (c + m) = x
  // x = (left - padding) / (coldWidth + margin)
  return Math.round((xOrYPx - layoutPaddingXOrYPx) / (colOrRowSizePx + marginXOrYPx));
}

export function itemWPxToUnits(wPx: number, colWidthPx: number): number {
  return _itemWHPxToUnits(wPx, colWidthPx, itemMargin.xPx);
}

export function itemHPxToUnits(hPx: number, colHeightPx: number): number {
  return _itemWHPxToUnits(hPx, colHeightPx, itemMargin.yPx);
}

export function itemXPxToUnits(xPx: number, colWidthPx: number): number {
  return _itemXYPxToUnits(xPx, colWidthPx, layoutPadding.xPx, itemMargin.xPx)
}

export function itemYPxToUnits(yPx: number, rowHeightPx: number): number {
  return _itemXYPxToUnits(yPx, rowHeightPx, layoutPadding.yPx, itemMargin.yPx)
}

export function itemRectPxToUnits(rectPx: RectPx, colWidthPx: number, rowHeightPx: number): WidgetLayoutItemRect {
  const w = _itemWHPxToUnits(rectPx.wPx, colWidthPx, itemMargin.xPx);
  const h = _itemWHPxToUnits(rectPx.hPx, rowHeightPx, itemMargin.yPx);
  const x = _itemXYPxToUnits(rectPx.xPx, colWidthPx, layoutPadding.xPx, itemMargin.xPx);
  const y = _itemXYPxToUnits(rectPx.yPx, rowHeightPx, layoutPadding.yPx, itemMargin.yPx);

  return { x, y, w, h };
}
