/*
 * Copyright: (c) 2024, Alex Kaul
 * GNU General Public License v3.0 or later (see COPYING or https://www.gnu.org/licenses/gpl-3.0.txt)
 */

import { RectPx, WHPx } from '@/ui/types/dimensions';
import { itemRectUnitsToPx, calcGridColWidth, calcGridRowHeight } from './calcs';
import styles from './widgetLayoutItemGhost.module.scss';

interface WidgetLayoutItemGhostProps {
  w: number;
  h: number;
  x: number;
  y: number;
  viewportSize: WHPx;
}

const WidgetLayoutItemGhost = (props: WidgetLayoutItemGhostProps) => {
  const {x, y, w, h, viewportSize} = props;

  const rectPx: RectPx = itemRectUnitsToPx(
    { x, y, w, h },
    calcGridColWidth(viewportSize),
    calcGridRowHeight(viewportSize)
  );

  return (
    <div
      className={styles['layout-item-ghost']}
      style={{
        transform: `translate(${rectPx.xPx}px,${rectPx.yPx}px)`,
        width: `${rectPx.wPx}px`,
        height: `${rectPx.hPx}px`
      }}
      data-testid="widget-layout-item-ghost"
    >
    </div>
  )
}

export default WidgetLayoutItemGhost;
