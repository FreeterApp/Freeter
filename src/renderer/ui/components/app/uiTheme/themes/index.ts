import { UiThemeId } from '@/base/uiTheme';
import { darkTheme } from '@/ui/components/app/uiTheme/themes/dark';
import { lightTheme } from '@/ui/components/app/uiTheme/themes/light';

type UiTheme = typeof darkTheme;

export const uiThemes: Record<UiThemeId, UiTheme> = {
  'dark': darkTheme,
  'light': lightTheme
}
