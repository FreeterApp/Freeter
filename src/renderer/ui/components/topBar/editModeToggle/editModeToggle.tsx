/*
 * Copyright: (c) 2024, Alex Kaul
 * GNU General Public License v3.0 or later (see COPYING or https://www.gnu.org/licenses/gpl-3.0.txt)
 */

import { EditModeToggleViewModelHook } from './editModeToggleViewModel';
import { Button } from '@/ui/components/basic/button';
import { editMode24Svg } from '@/ui/assets/images/appIcons';

type Deps = {
  useEditModeToggleViewModel: EditModeToggleViewModelHook;
}

export function createEditModeToggleComponent({
  useEditModeToggleViewModel,
}: Deps) {
  function Component() {
    const {
      editMode,
      onToggleClickHandler,
    } = useEditModeToggleViewModel();

    return <Button iconSvg={editMode24Svg} size='L' title={editMode?'Disable Edit Mode':'Enable Edit Mode'} pressed={editMode} onClick={onToggleClickHandler}></Button>
  }

  return Component;
}

export type EditModeToggleComponent = ReturnType<typeof createEditModeToggleComponent>;
