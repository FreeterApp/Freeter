/*
 * Copyright: (c) 2024, Alex Kaul
 * GNU General Public License v3.0 or later (see COPYING or https://www.gnu.org/licenses/gpl-3.0.txt)
 */

import { useCallback } from 'react';
import styles from './palette.module.scss';
import { SvgIcon } from '@/ui/components/basic/svgIcon';

export interface PaletteItemProps {
  id: string;
  icon: string;
  name: string;
  onDragStart: (itemId: string) => void;
  onDragEnd: () => void;
  onClick: (itemId: string) => void;
}

const PaletteItemComponent = (props: PaletteItemProps) => {
  const { id, icon, name, onDragStart, onDragEnd, onClick } = props;

  const onDragStartHandler = useCallback(() => {
    onDragStart(id);
  }, [id, onDragStart])

  const onDragEndHandler = useCallback(() => {
    onDragEnd();
  }, [onDragEnd])

  const onClickHandler = useCallback(() => {
    onClick(id);
  }, [id, onClick])

  return (
    <li
      className={styles['palette-item']}
      draggable={true}
      onDragStart={onDragStartHandler}
      onDragEnd={onDragEndHandler}
      onClick={onClickHandler}
      title={name}
    >
      <SvgIcon svg={icon} className={styles['palette-item-icon']}></SvgIcon>
      <span>{name}</span>
    </li>
  )
}

export default PaletteItemComponent;
