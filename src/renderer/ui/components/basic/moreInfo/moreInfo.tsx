/*
 * Copyright: (c) 2024, Alex Kaul
 * GNU General Public License v3.0 or later (see COPYING or https://www.gnu.org/licenses/gpl-3.0.txt)
 */

import { SvgIcon } from '@/ui/components/basic/svgIcon';
import styles from './moreInfo.module.scss';
import clsx from 'clsx';
import { circleQuestion16Svg } from '@/ui/assets/images/appIcons';

export interface MoreInfoProps {
  info: string;
  className?: string;
}

export const MoreInfo = ({
  info,
  className
}: MoreInfoProps) => (
  <span title={info} className={clsx(styles['more-info'], className)}>
    <SvgIcon svg={circleQuestion16Svg} className={styles['more-info-icon']}/>
  </span>
)
