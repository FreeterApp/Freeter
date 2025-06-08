/*
 * Copyright: (c) 2024, Alex Kaul
 * GNU General Public License v3.0 or later (see COPYING or https://www.gnu.org/licenses/gpl-3.0.txt)
 */

import { useCallback, useEffect, useState } from 'react';
import { RectPx } from '@/ui/types/dimensions';

export function useElementRect(el: HTMLElement | null, opts?: {
  useViewportRect?: boolean;
  defaultVal?: RectPx;
  refreshDep?: unknown;
}) {
  const [elementRect, setElementRect] = useState<RectPx>(opts?.defaultVal || { xPx: 0, yPx: 0, wPx: 500, hPx: 500 });

  const refreshElementRect = useCallback(() => {
    if (el) {
      if (opts?.useViewportRect) {
        const rect = el.getBoundingClientRect();
        setElementRect({
          xPx: rect.left,
          yPx: rect.top,
          wPx: rect.width,
          hPx: rect.height
        });
      } else {
        setElementRect({
          xPx: el.clientLeft,
          yPx: el.clientTop,
          wPx: el.clientWidth,
          hPx: el.clientHeight
        });
      }
    }
  }, [el, opts?.useViewportRect])

  useEffect(() => {
    refreshElementRect();
  }, [refreshElementRect, opts?.refreshDep])

  useEffect(() => {
    window.addEventListener('resize', refreshElementRect);
    refreshElementRect();
    return () => {
      window.removeEventListener('resize', refreshElementRect);
    }
  }, [refreshElementRect]);

  return elementRect;
}
