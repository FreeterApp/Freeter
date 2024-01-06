/*
 * Copyright: (c) 2024, Alex Kaul
 * GNU General Public License v3.0 or later (see COPYING or https://www.gnu.org/licenses/gpl-3.0.txt)
 */

import { ActionBarItems } from '@/base/actionBar';
import { EntityId } from '@/base/entity';
import { Project } from '@/base/project';
import { delete14Svg } from '@/ui/assets/images/appIcons';
import { DragEvent, MouseEvent, useCallback, useMemo } from 'react';

export type ProjectManagerListItemOnMouseEvent = (evt: MouseEvent<HTMLElement>, projectId: EntityId) => void;
export type ProjectManagerListItemOnDragEvent = (evt: DragEvent<HTMLElement>, projectId: EntityId) => void;
export type ProjectManagerListItemDeleteProjectAction = (itemId: EntityId) => void;

export interface ProjectManagerListItemProps {
  project: Project;
  isCurrent: boolean;
  hasDeletionMark: boolean;
  isDropArea: boolean;
  onClick: ProjectManagerListItemOnMouseEvent;
  onDragStart: ProjectManagerListItemOnDragEvent;
  onDragEnd: ProjectManagerListItemOnDragEvent;
  onDragEnter: ProjectManagerListItemOnDragEvent;
  onDragLeave: ProjectManagerListItemOnDragEvent;
  onDragOver: ProjectManagerListItemOnDragEvent;
  onDrop: ProjectManagerListItemOnDragEvent;
  deleteProjectAction: ProjectManagerListItemDeleteProjectAction;
}

export function useProjectManagerListItemViewModel(props: ProjectManagerListItemProps) {
  const {
    isCurrent,
    hasDeletionMark,
    onClick,
    project,
    deleteProjectAction,
    isDropArea,
    onDragEnd,
    onDragEnter,
    onDragLeave,
    onDragOver,
    onDragStart,
    onDrop,
  } = props;
  const { id } = project;
  const { name } = project.settings;

  const onClickHandler = useCallback((evt: MouseEvent<HTMLElement>) => {
    onClick(evt, id)
  }, [onClick, id])

  const onDragStartHandler = useCallback((evt: DragEvent<HTMLElement>) => {
    onDragStart(evt, id);
  }, [id, onDragStart])

  const onDragEndHandler = useCallback((evt: DragEvent<HTMLElement>) => {
    onDragEnd(evt, id);
  }, [id, onDragEnd])

  const onDragEnterHandler = useCallback((evt: DragEvent<HTMLElement>) => {
    evt.stopPropagation();
    onDragEnter(evt, id);
  }, [id, onDragEnter])

  const onDragLeaveHandler = useCallback((evt: DragEvent<HTMLElement>) => {
    evt.stopPropagation();
    onDragLeave(evt, id);
  }, [id, onDragLeave])

  const onDragOverHandler = useCallback((evt: DragEvent<HTMLElement>) => {
    evt.stopPropagation();
    onDragOver(evt, id);
  }, [id, onDragOver])

  const onDropHandler = useCallback((evt: DragEvent<HTMLElement>) => {
    evt.stopPropagation();
    onDrop(evt, id);
  }, [id, onDrop])

  const actionBarItems = useMemo<ActionBarItems>(() => [{
    enabled: true,
    pressed: hasDeletionMark,
    icon: delete14Svg,
    id: 'DELETE-PROJECT',
    title: 'Delete Project',
    doAction: async () => {
      deleteProjectAction(id);
    }
  }], [deleteProjectAction, id, hasDeletionMark])

  return {
    name,
    isCurrent,
    isDropArea,
    hasDeletionMark,
    actionBarItems,
    onClickHandler,
    onDragStartHandler,
    onDragEndHandler,
    onDragEnterHandler,
    onDragLeaveHandler,
    onDragOverHandler,
    onDropHandler,
  };
}
