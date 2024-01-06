/*
 * Copyright: (c) 2024, Alex Kaul
 * GNU General Public License v3.0 or later (see COPYING or https://www.gnu.org/licenses/gpl-3.0.txt)
 */

import { ModalScreen, ModalScreenProps } from '@/ui/components/basic/modalScreen';

export interface SettingsScreenProps extends Omit<ModalScreenProps, 'buttons'> {
  onOkClick: () => void;
  onCancelClick: () => void;
}

export const SettingsScreen = ({
  onOkClick,
  onCancelClick,
  className,
  children,
  ...restProps
}: SettingsScreenProps) => (
  <ModalScreen
    buttons={[
      {id: 'ok', caption: 'Ok', primary: true, onClick: onOkClick},
      {id: 'cancel', caption: 'Cancel', onClick: onCancelClick},
    ]}
    className={className}
    {...restProps}
  >
    {children}
  </ModalScreen>
)
