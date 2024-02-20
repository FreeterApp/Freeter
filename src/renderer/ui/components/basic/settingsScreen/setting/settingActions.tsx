/*
 * Copyright: (c) 2024, Alex Kaul
 * GNU General Public License v3.0 or later (see COPYING or https://www.gnu.org/licenses/gpl-3.0.txt)
 */

import { ActionBarItems } from '@/base/actionBar';
import { ActionBar } from '@/ui/components/basic/actionBar';

export interface SettingActionsProps {
  className?: string;
  actions: ActionBarItems;
}

export const SettingActions = ({
  className,
  actions
}: SettingActionsProps) => (
  <ActionBar
    className={className}
    actionBarItems={actions}
  />
)
