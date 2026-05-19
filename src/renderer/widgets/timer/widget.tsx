/*
 * Copyright: (c) 2024, Alex Kaul
 * GNU General Public License v3.0 or later (see COPYING or https://www.gnu.org/licenses/gpl-3.0.txt)
 */

import { Button, ReactComponent, WidgetReactComponentProps } from '@/widgets/appModules';
import { Settings } from './settings';
import { useCallback, useEffect, useMemo, useState } from 'react';
import styles from './widget.module.scss';
import { useAudioFile } from '@/widgets/timer/useAudioFile';
import { timerEndSoundFilesById } from '@/widgets/timer/audio/timer-end';

function padTime(time: number) {
  return ('0' + time).slice(-2);
}

function msecsToMMSS(msecs: number) {
  const secs = Math.floor(msecs/1000);
  const m = Math.floor(secs/60);
  const s = Math.floor(secs-m*60);
  return `${padTime(m)}:${padTime(s)}`;
}

function WidgetComp({settings}: WidgetReactComponentProps<Settings>) {
  const [endMsecs, setEndMsecs] = useState(0);
  const [mmss, setMmss] = useState(msecsToMMSS(0));

  const msecs = settings.mins*60000

  const endSound = useAudioFile(timerEndSoundFilesById[settings.endSound]?.path || '', settings.endSoundVol);

  const tick = useCallback(() => {
    const msecsLeft = endMsecs - Date.now();
    setMmss(msecsToMMSS(msecsLeft));
    if(msecsLeft<=0) {
      setEndMsecs(0);
      endSound.play();
    }
  }, [endMsecs, endSound])

  useEffect(() => {
    if (endMsecs>0) {
      const interval = setInterval(tick, 1000);
      return () => clearInterval(interval);
    }
    return undefined;
  }, [endMsecs, tick])

  const totalMmss = useMemo(()=>msecsToMMSS(msecs), [msecs])
  const start = useCallback(() => {
    setEndMsecs(Date.now() + msecs + 500 /* A bit more to not have -2secs mmss on a first tick */ );
    setMmss(msecsToMMSS(msecs));
  }, [msecs])

  const reset = useCallback(() => {
    setEndMsecs(0);
  }, [])

  return endMsecs===0
    ? <Button
        onClick={start}
        caption={totalMmss}
        title='Start'
        size='Fill'
        className={styles['timer-button']}
      />
    : <div className={styles['timer-run-screen']}>
        <div className={styles['timer-run-screen-mmss']}>{mmss}</div>
        <Button caption='Reset' onClick={reset} size='M'/>
      </div>
}

export const widgetComp: ReactComponent<WidgetReactComponentProps<Settings>> = {
  type: 'react',
  Comp: WidgetComp
}
