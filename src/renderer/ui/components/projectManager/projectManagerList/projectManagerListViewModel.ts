/*
 * Copyright: (c) 2024, Alex Kaul
 * GNU General Public License v3.0 or later (see COPYING or https://www.gnu.org/licenses/gpl-3.0.txt)
 */

import { EntityId } from '@/base/entity';
import { EntityList } from '@/base/entityList';
import { Project } from '@/base/project';
import { ProjectManagerListItemDeleteProjectAction, ProjectManagerListItemOnDragEvent, ProjectManagerListItemOnMouseEvent } from '@/ui/components/projectManager/projectManagerList/projectManagerListItemViewModel';
import { MouseEvent } from 'react';

export interface ProjectManagerListProps {
  projectList: EntityList<Project>;
  currentProjectId: EntityId | null;
  draggingOverProjectId: EntityId | null;
  deleteProjectIds: Record<EntityId, boolean>;
  deleteProjectAction: ProjectManagerListItemDeleteProjectAction;
  onListItemClick: ProjectManagerListItemOnMouseEvent;
  onListItemDragStart: ProjectManagerListItemOnDragEvent;
  onListItemDragEnd: ProjectManagerListItemOnDragEvent;
  onListItemDragEnter: ProjectManagerListItemOnDragEvent;
  onListItemDragLeave: ProjectManagerListItemOnDragEvent;
  onListItemDragOver: ProjectManagerListItemOnDragEvent;
  onListItemDrop: ProjectManagerListItemOnDragEvent;
  onAddProjectClick: (evt: MouseEvent<HTMLElement>) => void;
}

export function useProjectManagerListViewModel(props: ProjectManagerListProps) {
  return props;
}
