/*
 * Copyright: (c) 2024, Alex Kaul
 * GNU General Public License v3.0 or later (see COPYING or https://www.gnu.org/licenses/gpl-3.0.txt)
 */

import { Button, ButtonProps } from '@/ui/components/basic/button';
import styles from './modalScreen.module.scss';
import clsx from 'clsx';

export interface ModalScreenProps extends React.PropsWithChildren<React.DetailedHTMLProps<React.HTMLAttributes<HTMLDivElement>, HTMLDivElement>> {
  buttons: Array<ButtonProps & {id: string}>;
  title: string;
}

export const ModalScreen = ({
  buttons,
  title,
  className,
  children,
  ...restProps
}: ModalScreenProps) => (
  <div className={clsx(className, styles['modal-screen'])} {...restProps}>
    <header className={styles['modal-screen-header']}>
      <h2>{title}</h2>
      <div>{buttons.map(({id, ...btnProps})=><Button key={id} size="L" {...btnProps}></Button>)}</div>
    </header>
    <section className={styles['modal-screen-body']}>
      {children}
    </section>
  </div>
)
