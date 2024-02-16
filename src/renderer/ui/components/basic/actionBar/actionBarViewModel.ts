/*
 * Copyright: (c) 2024, Alex Kaul
 * GNU General Public License v3.0 or later (see COPYING or https://www.gnu.org/licenses/gpl-3.0.txt)
 */

import { EntityId } from '@/base/entity';
import { ActionBarItems } from '@/base/actionBar';
import { useCallback } from 'react';
import { clickActionBarItemUseCase } from '@/application/useCases/actionBar/clickActionBarItem';

export interface ActionBarProps {
  actionBarItems: ActionBarItems;
  className?: string;
}

export function useActionBarViewModel(props: ActionBarProps) {
  const { actionBarItems } = props;
  const onActionBarItemClick = useCallback((actionId: EntityId) => {
    clickActionBarItemUseCase(actionBarItems, actionId);
  }, [actionBarItems])

  return {
    ...props,
    onActionBarItemClick
  };
}
