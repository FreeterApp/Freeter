/*
 * Copyright: (c) 2024, Alex Kaul
 * GNU General Public License v3.0 or later (see COPYING or https://www.gnu.org/licenses/gpl-3.0.txt)
 */

import { ManageProjectsButtonViewModelHook } from './manageProjectsButtonViewModel';
import { Button } from '@/ui/components/basic/button';
import { manage24Svg } from '@/ui/assets/images/appIcons';

type Deps = {
  useManageProjectsButtonViewModel: ManageProjectsButtonViewModelHook;
}

export function createManageProjectsButtonComponent({
  useManageProjectsButtonViewModel,
}: Deps) {
  function Component() {
    const {
      onButtonClickHandler,
    } = useManageProjectsButtonViewModel();

    return <Button iconSvg={manage24Svg} size='L' title="Manage Projects" onClick={onButtonClickHandler}></Button>
  }

  return Component;
}

export type ManageProjectsButtonComponent = ReturnType<typeof createManageProjectsButtonComponent>;
