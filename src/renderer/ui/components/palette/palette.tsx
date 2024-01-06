/*
 * Copyright: (c) 2024, Alex Kaul
 * GNU General Public License v3.0 or later (see COPYING or https://www.gnu.org/licenses/gpl-3.0.txt)
 */

import { PaletteViewModelHook } from './paletteViewModel';
import clsx from 'clsx';
import styles from './palette.module.scss';
import PaletteItem from './paletteItem';

type Deps = {
  usePaletteViewModel: PaletteViewModelHook
}

export function createPaletteComponent({
  usePaletteViewModel
}: Deps) {
  function Palette() {
    const {
      onItemDragEnd,
      onItemDragStart,
      onItemClick,
      widgetTypes,
      isHidden
    } = usePaletteViewModel();

    return (
      <ul
        className={clsx(styles.palette, isHidden && styles['is-hidden'])}
      >
      {widgetTypes.map(item => (
        <PaletteItem
          key={item.id}
          id={item.id}
          icon={item.icon}
          name={item.name}
          onDragStart={onItemDragStart}
          onDragEnd={onItemDragEnd}
          onClick={onItemClick}
        />
      ))}
      </ul>
    )
  }

  return Palette;
}
