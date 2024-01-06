/*
 * Copyright: (c) 2024, Alex Kaul
 * GNU General Public License v3.0 or later (see COPYING or https://www.gnu.org/licenses/gpl-3.0.txt)
 */

import { EntityId } from '@/base/entity';
import { ActionBarItems } from '@/base/actionBar';
import { ClickActionBarItemUseCase } from '@/application/useCases/actionBar/clickActionBarItem';
import { useCallback } from 'react';

type Deps = {
  clickActionBarItemUseCase: ClickActionBarItemUseCase;
}

export interface ActionBarProps {
  actionBarItems: ActionBarItems;
  className?: string;
}

export function createActionBarViewModelHook({
  clickActionBarItemUseCase,
}: Deps) {
  return function useActionBarViewModel(props: ActionBarProps) {
    const { actionBarItems } = props;
    const onActionBarItemClick = useCallback((actionId: EntityId) => {
      clickActionBarItemUseCase(actionBarItems, actionId);
    }, [actionBarItems])

    return {
      ...props,
      onActionBarItemClick
    };
  }
}

export type ActionBarViewModelHook = ReturnType<typeof createActionBarViewModelHook>;
export type ActionBarViewModel = ReturnType<ActionBarViewModelHook>;
