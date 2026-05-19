/*
 * Copyright: (c) 2024, Alex Kaul
 * GNU General Public License v3.0 or later (see COPYING or https://www.gnu.org/licenses/gpl-3.0.txt)
 */

import { useLayoutEffect, useRef, useState } from 'react';
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

export function useElementRect(opts?: {
  useViewportRect?: boolean;
  defaultVal?: RectPx;
}) {
  const ref = useRef<HTMLElement>(null);
  const [rect, setRect] = useState<RectPx>(opts?.defaultVal || getElRect(null, !!opts?.useViewportRect))

  useLayoutEffect(() => {
    const updateRect = () => {
      if (ref.current) {
        setRect(getElRect(ref.current, !!opts?.useViewportRect));
      }
    };

    updateRect();
    // Re-measure on window resize or scroll if needed
    window.addEventListener('resize', updateRect);

    return () => {
      window.removeEventListener('resize', updateRect);
    };
  }, [opts?.useViewportRect]);

  console.log(rect);

  return [ref, rect] as const;
}
