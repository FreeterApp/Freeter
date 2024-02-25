/*
 * Copyright: (c) 2024, Alex Kaul
 * GNU General Public License v3.0 or later (see COPYING or https://www.gnu.org/licenses/gpl-3.0.txt)
 */

import { CloseAboutUseCase } from '@/application/useCases/about/closeAbout';
import { GetAboutInfoUseCase } from '@/application/useCases/about/getAboutInfo';
import { OpenSponsorshipUrlUseCase } from '@/application/useCases/about/openSponsorshipUrl';
import { useCallback, useMemo } from 'react';

type Deps = {
  closeAboutUseCase: CloseAboutUseCase;
  getAboutInfoUseCase: GetAboutInfoUseCase;
  openSponsorshipUrlUseCase: OpenSponsorshipUrlUseCase;
}

export function createAboutViewModelHook({
  closeAboutUseCase,
  getAboutInfoUseCase,
  openSponsorshipUrlUseCase,
}: Deps) {
  function useViewModel() {
    const onCloseClick = useCallback(() => {
      closeAboutUseCase();
    }, []);

    const onSponsorshipClick = useCallback(() => {
      openSponsorshipUrlUseCase();
    }, []);

    const aboutInfo = useMemo(() => getAboutInfoUseCase(), []);

    return {
      onCloseClick,
      onSponsorshipClick,
      aboutInfo,
    }
  }

  return useViewModel;
}

export type AboutViewModelHook = ReturnType<typeof createAboutViewModelHook>;
export type AboutViewModel = ReturnType<AboutViewModelHook>;
