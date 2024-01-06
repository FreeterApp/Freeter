/*
 * Copyright: (c) 2024, Alex Kaul
 * GNU General Public License v3.0 or later (see COPYING or https://www.gnu.org/licenses/gpl-3.0.txt)
 */

import { useCallback, useEffect, useState } from 'react';
import { WHPx } from '@/ui/types/dimensions';

export function useWindowSize(defaultVal?: WHPx) {
  const [windowSize, setWindowSize] = useState<WHPx>(defaultVal || { wPx: 500, hPx: 500 });

  const windowResizeHandler = useCallback(() => {
    setWindowSize({
      wPx: window.innerWidth,
      hPx: window.innerHeight
    });
  }, [])

  useEffect(() => {
    window.addEventListener('resize', windowResizeHandler);
    windowResizeHandler();
    return () => {
      window.removeEventListener('resize', windowResizeHandler);
    }
  }, [windowResizeHandler]);

  return windowSize;
}
