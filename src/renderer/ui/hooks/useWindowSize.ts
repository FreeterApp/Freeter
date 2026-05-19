/*
 * Copyright: (c) 2024, Alex Kaul
 * GNU General Public License v3.0 or later (see COPYING or https://www.gnu.org/licenses/gpl-3.0.txt)
 */

import { useEffect, useState } from 'react';
import { WHPx } from '@/ui/types/dimensions';

export function useWindowSize(defaultVal?: WHPx) {
  const [windowSize, setWindowSize] = useState<WHPx>(() => {
    if (!window) {
      return defaultVal || { wPx: 500, hPx: 500 };
    }

    return {
      wPx: window.innerWidth,
      hPx: window.innerHeight,
    };
  });

  useEffect(() => {
    const windowResizeHandler = () => {
      setWindowSize({
        wPx: window.innerWidth,
        hPx: window.innerHeight,
      });
    };

    window.addEventListener('resize', windowResizeHandler);

    return () => {
      window.removeEventListener('resize', windowResizeHandler);
    };
  }, []);

  return windowSize;
}
