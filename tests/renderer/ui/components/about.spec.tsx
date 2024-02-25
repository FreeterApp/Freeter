/*
 * Copyright: (c) 2024, Alex Kaul
 * GNU General Public License v3.0 or later (see COPYING or https://www.gnu.org/licenses/gpl-3.0.txt)
 */

import { render, screen, fireEvent } from '@testing-library/react';
import { createAboutComponent, createAboutViewModelHook} from '@/ui/components/about'
import { fixtureProcessInfoBrowser } from '@testscommon/base/fixtures/process';
import { GetAboutInfoUseCase } from '@/application/useCases/about/getAboutInfo';
import { fixtureProductInfo, fixtureProductInfoBackers } from '@tests/base/fixtures/productInfo';


async function setup(
  opts?: {
    aboutInfo?: ReturnType<GetAboutInfoUseCase>
  }
) {

  const closeAboutUseCase = jest.fn();
  const getAboutInfoUseCase = jest.fn();
  const openSponsorshipUrlUseCase = jest.fn();
  getAboutInfoUseCase.mockImplementation(
    opts?.aboutInfo
    ? ()=>opts.aboutInfo
    : ()=>({
      browser: fixtureProcessInfoBrowser(),
      productInfo: fixtureProductInfo()
    })
  )

  const useAboutViewModel = createAboutViewModelHook({
    closeAboutUseCase,
    getAboutInfoUseCase,
    openSponsorshipUrlUseCase,
  })

  const About = createAboutComponent({
    useAboutViewModel
  })
  const comp = render(
    <About />
  );

  return {
    comp,
    getAboutInfoUseCase,
    closeAboutUseCase,
    openSponsorshipUrlUseCase,
  }
}

describe('<About />', () => {
  it('should call a right usecase when clicking the close button', async () => {
    const {closeAboutUseCase} = await setup();

    const elButton = screen.getByRole('button', {
      name: /close/i
    });

    expect(closeAboutUseCase).toBeCalledTimes(0);

    fireEvent.click(elButton);

    expect(closeAboutUseCase).toBeCalledTimes(1);
  })

  it('should display the version info returned by getAboutInfoUseCase', async () => {
    const browserVer = 'TEST-BROWSER-VER';
    const builtAt = 'TEST-BUILT-AT';
    const commitHash = 'TEST-COMMIT-HASH';
    const version = 'TEST-VERSION';

    await setup({
      aboutInfo: {
        browser: fixtureProcessInfoBrowser({ver: browserVer}),
        productInfo: fixtureProductInfo({
          builtAt,
          commitHash,
          version
        })
      }
    });

    expect(screen.queryByText(browserVer)).toBeInTheDocument();
    expect(screen.queryByText(builtAt)).toBeInTheDocument();
    expect(screen.queryByText(commitHash)).toBeInTheDocument();
    expect(screen.queryByText(version)).toBeInTheDocument();
  })

  it('should display backers returned by getAboutInfoUseCase', async () => {
    const nameA = 'TEST NAME A';
    const nameB = 'TEST NAME B';
    const nameC = 'TEST NAME C';

    await setup({
      aboutInfo: {
        browser: fixtureProcessInfoBrowser(),
        productInfo: fixtureProductInfo({
          backers: fixtureProductInfoBackers({
            backers: [[nameA]],
            backersPlus: [[nameB]],
            bronzeSponsors: [[nameC]],
          })
        })
      }
    });

    expect(screen.queryByText(nameA)).toBeInTheDocument();
    expect(screen.queryByText(nameB)).toBeInTheDocument();
    expect(screen.queryByText(nameC)).toBeInTheDocument();
  })
})
