/*
 * Copyright: (c) 2024, Alex Kaul
 * GNU General Public License v3.0 or later (see COPYING or https://www.gnu.org/licenses/gpl-3.0.txt)
 */

import { useEffect } from 'react';
import { UiThemeId } from '@/base/uiTheme';
import { uiThemes } from '@/ui/components/app/uiTheme/themes';

export interface UIThemeProps {
  themeId: UiThemeId;
}

export const UITheme = ({
  themeId
}: UIThemeProps) => {
  useEffect(() => {
    const theme = uiThemes[themeId];
    Object.keys(theme).forEach((key) => {
      const value = theme[key as keyof typeof theme];
      document.documentElement.style.setProperty(`--freeter-${key}`, value);
    });
  }, [themeId])
  return <></>;
}
