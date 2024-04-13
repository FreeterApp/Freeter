/*
 * Copyright: (c) 2024, Alex Kaul
 * GNU General Public License v3.0 or later (see COPYING or https://www.gnu.org/licenses/gpl-3.0.txt)
 */

import { useEffect, useMemo } from 'react';

export function useAudioFile(file: string, volume: number) {
  const soundPlayer = useMemo(() => file !== '' ? new Audio() : null, [file]);
  useEffect(() => {
    if (soundPlayer) {
      soundPlayer.src = file;
      soundPlayer.volume = volume / 100;
      soundPlayer.load();
      return () => soundPlayer.pause();
    }
    return undefined;
  }, [soundPlayer, file, volume])
  return useMemo(() => ({
    play: () => {
      if (soundPlayer) {
        soundPlayer.currentTime = 0;
        soundPlayer.play();
      }
    }
  }), [soundPlayer])
}
