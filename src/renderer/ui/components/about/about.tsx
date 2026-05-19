/*
 * Copyright: (c) 2024, Alex Kaul
 * GNU General Public License v3.0 or later (see COPYING or https://www.gnu.org/licenses/gpl-3.0.txt)
 */

import { AboutViewModelHook } from '@/ui/components/about/aboutViewModel';
import { ModalScreen } from '@/ui/components/basic/modalScreen';
import styles from '@/ui/components/about/about.module.scss'
import { SvgIcon } from '@/ui/components/basic/svgIcon';
import { logo150Svg } from '@/ui/assets/images/appIcons';

type Deps = {
  useAboutViewModel: AboutViewModelHook;
}

export function createAboutComponent({
  useAboutViewModel,
}: Deps) {
  function Component() {
    const {
      onCloseClick,
      onSponsorshipClick,
      aboutInfo,
    } = useAboutViewModel();

    return (
      <ModalScreen
        buttons={[
          {id: 'close', caption: 'Close', primary: true, onClick: onCloseClick},
        ]}
        title="About Freeter"
      >
        <div className={styles['about-left']}>
          <div className={styles['app-logo']}>
            <SvgIcon svg={logo150Svg} className={styles['app-logo-svg']}></SvgIcon>
          </div>
          <div className={styles['app-name']}>Freeter</div>
          <div className={styles['app-about']}>
            <span><b>Version:</b> {aboutInfo.productInfo.version}</span>
            <span><b>Date:</b> {aboutInfo.productInfo.builtAt}</span>
            <span><b>Commit:</b> {aboutInfo.productInfo.commitHash}</span>
            <span><b>Chromium:</b> {aboutInfo.browser.ver}</span>
          </div>
        </div>
        <div className={styles['about-right']}>
          <h2>{'Sponsors & Backers'}</h2>
          <p>
            {`Freeter is a free and open-source software with its ongoing development made possible entirely
              by the support of these awesome sponsors & backers. If you'd like to join them, please consider `}
            <a href='#' onClick={onSponsorshipClick}>{'sponsoring Freeter\'s development'}</a>.
          </p>

          {
            aboutInfo.productInfo.backers.bronzeSponsors.length>0 &&
            <>
              <h3>Bronze Sponsors</h3>
              <ul className={styles['list-sponsors']}>
                {aboutInfo.productInfo.backers.bronzeSponsors.map((item, idx) => (
                  <li key={idx}>{item[0]}</li>
                ))}
              </ul>
            </>
          }

          {
            (aboutInfo.productInfo.backers.backersPlus.length>0 || aboutInfo.productInfo.backers.backers.length>0) &&
            <>
              <h3>Backers</h3>
              <ul className={styles['list-backers']}>
                {aboutInfo.productInfo.backers.backersPlus.map((item, idx) => (
                  <li key={idx}><b>{item[0]}</b></li>
                ))}
                {aboutInfo.productInfo.backers.backers.map((item, idx) => (
                  <li key={idx}>{item[0]}</li>
                ))}
              </ul>
            </>
          }

        </div>
      </ModalScreen>
    )
  }

  return Component;
}

export type AboutComponent = ReturnType<typeof createAboutComponent>;
