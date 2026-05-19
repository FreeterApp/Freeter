/*
 * Copyright: (c) 2024, Alex Kaul
 * GNU General Public License v3.0 or later (see COPYING or https://www.gnu.org/licenses/gpl-3.0.txt)
 */

import styles from './inAppNote.module.scss';
import clsx from 'clsx';

export type InAppNoteProps = React.PropsWithChildren<React.DetailedHTMLProps<React.HTMLAttributes<HTMLDivElement>, HTMLDivElement>>

export const InAppNote = ({
  className,
  children,
  ...restProps
}: InAppNoteProps) => (
  <div className={clsx(className, styles['in-app-note'])} {...restProps}>
    <div>
      {children}
    </div>
  </div>
)
