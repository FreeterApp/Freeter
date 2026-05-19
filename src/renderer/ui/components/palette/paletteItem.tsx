/*
 * Copyright: (c) 2024, Alex Kaul
 * GNU General Public License v3.0 or later (see COPYING or https://www.gnu.org/licenses/gpl-3.0.txt)
 */

import { useCallback } from 'react';
import styles from './palette.module.scss';
import { SvgIcon } from '@/ui/components/basic/svgIcon';
import { MoreInfo } from '@/ui/components/basic/moreInfo';

export interface PaletteItemProps {
  id: string;
  icon: string;
  name: string;
  moreInfo?: string;
  onDragStart: (itemId: string) => void;
  onDragEnd: () => void;
  onClick: (itemId: string) => void;
  onContextMenu: (itemId: string) => void;
}

const PaletteItemComponent = (props: PaletteItemProps) => {
  const { id, icon, name, moreInfo, onDragStart, onDragEnd, onClick, onContextMenu } = props;

  const onDragStartHandler = useCallback(() => {
    onDragStart(id);
  }, [id, onDragStart])

  const onDragEndHandler = useCallback(() => {
    onDragEnd();
  }, [onDragEnd])

  const onClickHandler = useCallback(() => {
    onClick(id);
  }, [id, onClick])

  const onContextMenuHandler = useCallback(() => {
    onContextMenu(id);
  }, [id, onContextMenu])

  return (
    <li
      className={styles['palette-item']}
      draggable={true}
      onDragStart={onDragStartHandler}
      onDragEnd={onDragEndHandler}
      onClick={onClickHandler}
      onContextMenu={onContextMenuHandler}
    >
      <SvgIcon svg={icon} className={styles['palette-item-icon']}></SvgIcon>
      <span className={styles['palette-item-name']}>{name}</span>
      {moreInfo && <MoreInfo info={moreInfo}/>}
    </li>
  )
}

export default PaletteItemComponent;
