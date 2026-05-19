/*
 * Copyright: (c) 2024, Alex Kaul
 * GNU General Public License v3.0 or later (see COPYING or https://www.gnu.org/licenses/gpl-3.0.txt)
 */

import { useCallback, useEffect, useRef } from 'react';

export function useAudioFile(file: string, volume: number) {
  const audioRef = useRef<HTMLAudioElement | null>(null);

  useEffect(() => {
    let audio: HTMLAudioElement;
    if (file) {
      audio = new Audio(file);
      audio.volume = volume / 100;
      audio.load();

      audioRef.current = audio;
    } else {
      audioRef.current?.pause();
      audioRef.current = null;
    }

    return () => {
      if (audio) {
        audio.pause();
      }
    };
  }, [file, volume]);

  const play = useCallback(() => {
    const audio = audioRef.current;
    if (!audio) {
      return;
    }

    audio.currentTime = 0;
    audio.play();
  }, []);

  return { play };

  // const soundPlayer = useMemo(() => file !== '' ? new Audio() : null, [file]);
  // useEffect(() => {
  //   if (soundPlayer) {
  //     soundPlayer.src = file;
  //     soundPlayer.volume = volume / 100;
  //     soundPlayer.load();
  //     return () => soundPlayer.pause();
  //   }
  //   return undefined;
  // }, [soundPlayer, file, volume])
  // return useMemo(() => ({
  //   play: () => {
  //     if (soundPlayer) {
  //       soundPlayer.currentTime = 0;
  //       soundPlayer.play();
  //     }
  //   }
  // }), [soundPlayer])
}
