/*
 * Copyright: (c) 2024, Alex Kaul
 * GNU General Public License v3.0 or later (see COPYING or https://www.gnu.org/licenses/gpl-3.0.txt)
 */

import { EntityId } from '@/base/entity';
import { ActionBarItems } from '@/base/actionBar';
import { MouseEvent, useCallback } from 'react';
import { clickActionBarItemUseCase } from '@/application/useCases/actionBar/clickActionBarItem';

export interface ActionBarProps {
  actionBarItems: ActionBarItems;
  className?: string;
}

export function useActionBarViewModel(props: ActionBarProps) {
  const { actionBarItems } = props;
  const onActionBarItemClick = useCallback((e: MouseEvent, actionId: EntityId) => {
    e.preventDefault();
    e.stopPropagation();
    clickActionBarItemUseCase(actionBarItems, actionId);
  }, [actionBarItems])

  return {
    ...props,
    onActionBarItemClick
  };
}
