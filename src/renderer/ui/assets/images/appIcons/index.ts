/*
 * Copyright: (c) 2024, Alex Kaul
 * GNU General Public License v3.0 or later (see COPYING or https://www.gnu.org/licenses/gpl-3.0.txt)
 */

// TS does not verify import paths for non-TS files (https://github.com/microsoft/TypeScript/issues/40450)
// To minimize issues caused by that, all paths to the image assets are collected in this file.
// Components should import the paths from this file instead of importing the image files.
// TODO: Switch to the direct imports when TS will be emitting errors for wrong asset file paths.

import add14Svg from './add-14.svg';
import arrDown14Svg from './arr-down-14.svg';
import browse14Svg from './browse-14.svg';
import delete14Svg from './delete-14.svg';
import duplicate14Svg from './duplicate-14.svg';
import more14Svg from './more-14.svg';
import settings14Svg from './settings-14.svg';

import editMode24Svg from './edit-mode-24.svg';
import manage24Svg from './manage-24.svg';

import logo150Svg from './logo-150.svg';

export {
  add14Svg,
  arrDown14Svg,
  browse14Svg,
  delete14Svg,
  duplicate14Svg,
  more14Svg,
  settings14Svg,

  editMode24Svg,
  manage24Svg,

  logo150Svg,
}
