/*
 * Copyright: (c) 2024, Alex Kaul
 * GNU General Public License v3.0 or later (see COPYING or https://www.gnu.org/licenses/gpl-3.0.txt)
 */

import { MoreInfo } from '@/ui/components/basic/moreInfo';
import styles from '../settingsScreen.module.scss';

export interface SettingBlockProps extends React.PropsWithChildren {
  titleForId?: string;
  moreInfo?: string;
  title: string;
}

export const SettingBlock = ({
  titleForId,
  title,
  children,
  moreInfo
}: SettingBlockProps) => (
  <fieldset>
    <label
      htmlFor={titleForId}
    >
      {title}
      {moreInfo && <MoreInfo info={moreInfo} className={styles['more-info']}/>}
    </label>
    <div>
      { children }
    </div>
  </fieldset>
)
