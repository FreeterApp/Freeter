/*
 * Copyright: (c) 2024, Alex Kaul
 * GNU General Public License v3.0 or later (see COPYING or https://www.gnu.org/licenses/gpl-3.0.txt)
 */

import { useCallback, useEffect, useState } from 'react';
import { RectPx } from '@/ui/types/dimensions';

const getElRect = (el: HTMLElement | null, useViewportRect: boolean) => {
  if (el) {
    if (useViewportRect) {
      const rect = el.getBoundingClientRect();
      return {
        xPx: rect.left,
        yPx: rect.top,
        wPx: rect.width,
        hPx: rect.height
      };
    } else {
      return {
        xPx: el.clientLeft,
        yPx: el.clientTop,
        wPx: el.clientWidth,
        hPx: el.clientHeight
      };
    }
  } else {
    return {
      xPx: 0,
      yPx: 0,
      wPx: 0,
      hPx: 0
    }
  }
}

export function useElementRect(el: HTMLElement | null, opts?: {
  useViewportRect?: boolean;
  defaultVal?: RectPx;
  refreshDep?: unknown;
}) {
  const { xPx, yPx, wPx, hPx } = getElRect(el, !!opts?.useViewportRect);
  const [elementRect, setElementRect] = useState<RectPx>(opts?.defaultVal || { xPx, yPx, wPx, hPx });

  const refreshElementRect = useCallback(() => {
    setElementRect({ xPx, yPx, wPx, hPx })
  }, [hPx, wPx, xPx, yPx])

  if (elementRect.hPx !== hPx || elementRect.wPx !== wPx || elementRect.xPx !== xPx || elementRect.yPx !== yPx) {
    refreshElementRect();
  }

  useEffect(() => {
    refreshElementRect();
  }, [refreshElementRect, opts?.refreshDep])

  useEffect(() => {
    window.addEventListener('resize', refreshElementRect);
    return () => {
      window.removeEventListener('resize', refreshElementRect);
    }
  }, [refreshElementRect]);

  return elementRect;
}
