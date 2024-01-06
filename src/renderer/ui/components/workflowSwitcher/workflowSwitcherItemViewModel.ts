/*
 * Copyright: (c) 2024, Alex Kaul
 * GNU General Public License v3.0 or later (see COPYING or https://www.gnu.org/licenses/gpl-3.0.txt)
 */

import { EntityId } from '@/base/entity';
import { ActionBarItems } from '@/base/actionBar';
import { delete14Svg, settings14Svg } from '@/ui/assets/images/appIcons';
import React, { DragEvent, MouseEvent, useCallback, useEffect, useMemo, useRef } from 'react';

export interface WorkflowSwitcherItemActionBarActions {
  openSettings: (itemId: EntityId) => void;
  delete: (itemId: EntityId) => void;
}
export interface WorkflowSwitcherItemProps {
  id: string;
  name: string;
  isEditMode: boolean;
  isCurrent: boolean;
  isDropArea: boolean;
  isEditNameMode: boolean;
  actionBarActions: WorkflowSwitcherItemActionBarActions;
  onClick: (evt: MouseEvent<HTMLElement>, itemId: EntityId) => void;
  onDragStart: (evt: DragEvent<HTMLElement>, itemId: EntityId) => void;
  onDragEnd: (evt: DragEvent<HTMLElement>, itemId: EntityId) => void;
  onDragEnter: (evt: DragEvent<HTMLElement>, itemId: EntityId) => void;
  onDragLeave: (evt: DragEvent<HTMLElement>, itemId: EntityId) => void;
  onDragOver: (evt: DragEvent<HTMLElement>, itemId: EntityId) => void;
  onDrop: (evt: DragEvent<HTMLElement>, itemId: EntityId) => void;
  onEditName: (itemId: EntityId, newName: string) => void;
  onFinishEditName: (itemId: EntityId) => void;
}

export function useWorkflowSwitcherItemViewModel(props: WorkflowSwitcherItemProps) {
  const {
    id, name, isEditMode, isCurrent, onClick,
    isDropArea, onDragStart, onDragEnd, onDragEnter, onDragLeave,
    onDragOver, onDrop, actionBarActions, isEditNameMode, onEditName, onFinishEditName } = props;

  const onClickHandler = useCallback((evt: MouseEvent<HTMLElement>) => {
    onClick(evt, id);
  }, [id, onClick])

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

  const refNameInput = useRef<HTMLInputElement>(null);

  const onNameBlurHandler = useCallback(() => {
    onFinishEditName(id);
  }, [id, onFinishEditName])

  const onNameKeyDownHandler = useCallback((evt: React.KeyboardEvent<HTMLInputElement>) => {
    if (evt.key === 'Enter') {
      onFinishEditName(id);
    }
  }, [id, onFinishEditName])

  const onNameChangeHandler = useCallback((evt: React.ChangeEvent<HTMLInputElement>) => {
    onEditName(id, evt.target.value)
  }, [id, onEditName])

  useEffect(() => {
    if (isEditNameMode && refNameInput && refNameInput.current) {
      refNameInput.current.focus();
      refNameInput.current.select();
    }
  }, [isEditNameMode])

  const actionBarItemsEditMode = useMemo<ActionBarItems>(() => [{
    enabled: true,
    icon: settings14Svg,
    id: 'WORKFLOW-SETTINGS',
    title: 'Workflow Settings',
    doAction: async () => {
      actionBarActions.openSettings(id);
    }
  }, {
    enabled: true,
    icon: delete14Svg,
    id: 'DELETE-WORKFLOW',
    title: 'Delete Workflow',
    doAction: async () => {
      actionBarActions.delete(id);
    }
  }], [actionBarActions, id])

  const actionBarItems = useMemo(() => isEditMode ? actionBarItemsEditMode : [], [actionBarItemsEditMode, isEditMode]);

  return {
    id,
    name,
    isEditMode,
    isCurrent,
    isDropArea,
    onClickHandler,
    onDragStartHandler,
    onDragEndHandler,
    onDragEnterHandler,
    onDragLeaveHandler,
    onDragOverHandler,
    onDropHandler,
    onNameBlurHandler,
    onNameChangeHandler,
    onNameKeyDownHandler,
    refNameInput,
    isEditNameMode,
    actionBarItems,
  }
}
