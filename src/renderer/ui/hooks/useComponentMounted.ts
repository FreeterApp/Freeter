/*
 * Copyright: (c) 2024, Alex Kaul
 * GNU General Public License v3.0 or later (see COPYING or https://www.gnu.org/licenses/gpl-3.0.txt)
 */

import { useEffect, useState } from 'react';

export function useComponentMounted() {
  const [componentMounted, setComponentMounted] = useState(false);

  useEffect(() => {
    setComponentMounted(true);
    return () => {
      setComponentMounted(false);
    }
  }, []);

  return componentMounted;
}
