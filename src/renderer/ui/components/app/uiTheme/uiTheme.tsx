/*
 * Copyright: (c) 2024, Alex Kaul
 * GNU General Public License v3.0 or later (see COPYING or https://www.gnu.org/licenses/gpl-3.0.txt)
 */

import { useEffect } from 'react';
import './dark.scss';
import './light.scss';

const allThemeIds = ['dark', 'light'] as const;
type ThemeId = typeof allThemeIds[number];

export interface UIThemeProps {
  themeId: ThemeId;
}

export const UITheme = ({
  themeId
}: UIThemeProps) => {
  useEffect(() => {
    const themeClassName = `theme-${themeId}`;
    document.getElementsByTagName('html')[0].classList.add(themeClassName);
    return () => {
      document.getElementsByTagName('html')[0].classList.remove(themeClassName);
    };
  }, [themeId])
  return <></>;
}
