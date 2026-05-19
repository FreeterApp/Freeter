/*
 * Copyright: (c) 2024, Alex Kaul
 * GNU General Public License v3.0 or later (see COPYING or https://www.gnu.org/licenses/gpl-3.0.txt)
 */

import { ActionBarProps, useActionBarViewModel } from '@/ui/components/basic/actionBar/actionBarViewModel';
import clsx from 'clsx';
import styles from './actionBar.module.scss';
import { Button } from '@/ui/components/basic/button';
import { memo } from 'react';

export const ActionBar = memo(function ActionBar(props: ActionBarProps) {
  const {
    actionBarItems,
    onActionBarItemClick,
    className
  } = useActionBarViewModel(props);

  return (
    actionBarItems.length>0 &&
    <ul
      role="toolbar"
      className={clsx(
        styles['action-bar'],
        className
      )}
    >
    {actionBarItems.map(item => (
      <li
        role="presentation"
        key={item.id}
        className={styles['action-bar-item']}
      >
        <Button
          iconSvg={item.icon}
          size='S'
          title={item.title}
          disabled={(item.enabled !== undefined && !item.enabled)}
          onClick={e => onActionBarItemClick(e, item.id)}
          pressed={item.pressed}
        ></Button>
      </li>
    ))}
    </ul>
  )
})
