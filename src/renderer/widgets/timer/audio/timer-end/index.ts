/*
 * Copyright: (c) 2024, Alex Kaul
 * GNU General Public License v3.0 or later (see COPYING or https://www.gnu.org/licenses/gpl-3.0.txt)
 */

import a8BitArpeggioMp3 from './8-bit-arpeggio.mp3';
import airHornMp3 from './air-horn.mp3';
import angryBoatMp3 from './angry-boat.mp3';
import bikesBellRingMp3 from './bike-s-bell-ring.mp3';
import bouncingDownMp3 from './bouncing-down.mp3';
import cuckooClockMp3 from './cuckoo-clock.mp3';
import drumAndBassHardcoreMp3 from './drum-and-bass-hardcore.mp3';
import drumAndBassMp3 from './drum-and-bass.mp3';
import dubstepWobblesMp3 from './dubstep-wobbles.mp3';
import glassDingMp3 from './glass-ding.mp3';
import glockenspielArpeggioMp3 from './glockenspiel-arpeggio.mp3';
import guitarArpeggioMp3 from './guitar-arpeggio.mp3';
import guitarChimesMp3 from './guitar-chimes.mp3';
import guitarChordMp3 from './guitar-chord.mp3';
import guitarDubMp3 from './guitar-dub.mp3';
import guitarGrooveMp3 from './guitar-groove.mp3';
import guitarHarmonicsMp3 from './guitar-harmonics.mp3';
import guitarSlideMp3 from './guitar-slide.mp3';
import hardstyleKickMp3 from './hardstyle-kick.mp3';
import hoverScooterMp3 from './hover-scooter.mp3';
import metalDingMp3 from './metal-ding.mp3';
import movieSwellMp3 from './movie-swell.mp3';
import pianoAttackMp3 from './piano-attack.mp3';
import pianoPlinksMp3 from './piano-plinks.mp3';
import pianoReelMp3 from './piano-reel.mp3';
import pluckedSynthMp3 from './plucked-synth.mp3';
import reversedDoorBellMp3 from './reversed-door-bell.mp3';
import reversedTransformMp3 from './reversed-transform.mp3';
import satelliteFlybyMp3 from './satellite-flyby.mp3';
import scienceBellsMp3 from './science-bells.mp3';
import synthBellMp3 from './synth-bell.mp3';
import synthTuneMp3 from './synth-tune.mp3';
import timeTravelMp3 from './time-travel.mp3';
import transformerMp3 from './transformer.mp3';
import upliftingSynthMp3 from './uplifting-synth.mp3';
import xylophoneTonesMp3 from './xylophone-tones.mp3';

const glockenspielArpeggioId = 'glockenspiel-arpeggio';
const timerEndSoundFiles: { id: string, name: string, path: string }[] = [
  { id: 'a-8bit-arpeggio', name: '8 Bit Arpeggio', path: a8BitArpeggioMp3 },
  { id: 'air-horn', name: 'Air Horn', path: airHornMp3 },
  { id: 'angry-boat', name: 'Angry Boat', path: angryBoatMp3 },
  { id: 'bikes-bell-ring', name: 'Bike\'s Bell Ring', path: bikesBellRingMp3 },
  { id: 'bouncing-down', name: 'Bouncing Down', path: bouncingDownMp3 },
  { id: 'cuckoo-clock', name: 'Cuckoo Clock', path: cuckooClockMp3 },
  { id: 'drum-and-bass', name: 'Drum And Bass', path: drumAndBassMp3 },
  { id: 'drum-and-bass-hardcore', name: 'Drum And Bass Hardcore', path: drumAndBassHardcoreMp3 },
  { id: 'dubstep-wobbles', name: 'Dubstep Wobbles', path: dubstepWobblesMp3 },
  { id: 'glass-ding', name: 'Glass Ding', path: glassDingMp3 },
  { id: glockenspielArpeggioId, name: 'Glockenspiel Arpeggio', path: glockenspielArpeggioMp3 },
  { id: 'guitar-arpeggio', name: 'Guitar Arpeggio', path: guitarArpeggioMp3 },
  { id: 'guitar-chimes', name: 'Guitar Chimes', path: guitarChimesMp3 },
  { id: 'guitar-chord', name: 'Guitar Chord', path: guitarChordMp3 },
  { id: 'guitar-dub', name: 'Guitar Dub', path: guitarDubMp3 },
  { id: 'guitar-groove', name: 'Guitar Groove', path: guitarGrooveMp3 },
  { id: 'guitar-harmonics', name: 'Guitar Harmonics', path: guitarHarmonicsMp3 },
  { id: 'guitar-slide', name: 'Guitar Slide', path: guitarSlideMp3 },
  { id: 'hardstyle-kick', name: 'Hardstyle Kick', path: hardstyleKickMp3 },
  { id: 'hover-scooter', name: 'Hover Scooter', path: hoverScooterMp3 },
  { id: 'metal-ding', name: 'Metal Ding', path: metalDingMp3 },
  { id: 'movie-swell', name: 'Movie Swell', path: movieSwellMp3 },
  { id: 'piano-attack', name: 'Piano Attack', path: pianoAttackMp3 },
  { id: 'piano-plinks', name: 'Piano Plinks', path: pianoPlinksMp3 },
  { id: 'piano-reel', name: 'Piano Reel', path: pianoReelMp3 },
  { id: 'plucked-synth', name: 'Plucked Synth', path: pluckedSynthMp3 },
  { id: 'reversed-door-bell', name: 'Reversed Door Bell', path: reversedDoorBellMp3 },
  { id: 'reversed-transform', name: 'Reversed Transform', path: reversedTransformMp3 },
  { id: 'satellite-fly-by', name: 'Satellite Flyby', path: satelliteFlybyMp3 },
  { id: 'science-bells', name: 'Science Bells', path: scienceBellsMp3 },
  { id: 'synth-bell', name: 'Synth Bell', path: synthBellMp3 },
  { id: 'synth-tune', name: 'Synth Tune', path: synthTuneMp3 },
  { id: 'time-travel', name: 'Time Travel', path: timeTravelMp3 },
  { id: 'transformer', name: 'Transformer', path: transformerMp3 },
  { id: 'uplifting-synth', name: 'Uplifting Synth', path: upliftingSynthMp3 },
  { id: 'xylophone-tones', name: 'Xylophone Tones', path: xylophoneTonesMp3 },
]

const timerEndSoundFilesById = Object.fromEntries(timerEndSoundFiles.map(item => [item.id, item]))

export {
  glockenspielArpeggioId,
  timerEndSoundFiles,
  timerEndSoundFilesById
}
