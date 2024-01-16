/*
 * Copyright: (c) 2024, Alex Kaul
 * GNU General Public License v3.0 or later (see COPYING or https://www.gnu.org/licenses/gpl-3.0.txt)
 */

import { ShellProvider } from '@/application/interfaces/shellProvider';

type Deps = {
  shellProvider: ShellProvider;
}

const sponsorshipUrl = 'https://freeter.io/v2/sponsor/'

export function createOpenSponsorshipUrlUseCase({
  shellProvider,
}: Deps) {
  const useCase = () => {
    shellProvider.openExternal(sponsorshipUrl);
  }

  return useCase;
}

export type OpenSponsorshipUrlUseCase = ReturnType<typeof createOpenSponsorshipUrlUseCase>;
