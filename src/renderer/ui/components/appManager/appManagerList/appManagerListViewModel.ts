/*
 * Copyright: (c) 2024, Alex Kaul
 * GNU General Public License v3.0 or later (see COPYING or https://www.gnu.org/licenses/gpl-3.0.txt)
 */

import { App } from '@/base/app';
import { EntityId } from '@/base/entity';
import { EntityList } from '@/base/entityList';
import { AppManagerListItemAppAction, AppManagerListItemOnDragEvent, AppManagerListItemOnMouseEvent } from '@/ui/components/appManager/appManagerList/appManagerListItemViewModel';
import { MouseEvent } from 'react';

export interface AppManagerListProps {
  appList: EntityList<App>;
  currentAppId: EntityId | null;
  draggingOverAppId: EntityId | null;
  deleteAppIds: Record<EntityId, boolean>;
  deleteAppAction: AppManagerListItemAppAction;
  duplicateAppAction: AppManagerListItemAppAction;
  onListItemClick: AppManagerListItemOnMouseEvent;
  onListItemDragStart: AppManagerListItemOnDragEvent;
  onListItemDragEnd: AppManagerListItemOnDragEvent;
  onListItemDragEnter: AppManagerListItemOnDragEvent;
  onListItemDragLeave: AppManagerListItemOnDragEvent;
  onListItemDragOver: AppManagerListItemOnDragEvent;
  onListItemDrop: AppManagerListItemOnDragEvent;
  onAddAppClick: (evt: MouseEvent<HTMLElement>) => void;
}

export function useAppManagerListViewModel(props: AppManagerListProps) {
  return props;
}
