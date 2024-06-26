/*
 * Copyright: (c) 2024, Alex Kaul
 * GNU General Public License v3.0 or later (see COPYING or https://www.gnu.org/licenses/gpl-3.0.txt)
 */

import clsx from 'clsx';
import * as styles from '../settingsScreen.module.scss';

export interface SettingRowProps extends React.PropsWithChildren<React.HTMLAttributes<HTMLDivElement>> {}

export const SettingRow = ({
  children,
  className,
  ...divProps
}: SettingRowProps) => (
  <div className={clsx(className, styles['setting-row'])} {...divProps}>
    { children }
  </div>
)
