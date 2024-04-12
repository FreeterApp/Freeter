/*
 * Copyright: (c) 2024, Alex Kaul
 * GNU General Public License v3.0 or later (see COPYING or https://www.gnu.org/licenses/gpl-3.0.txt)
 */

declare module '*.png' { export default '' as string }
declare module '*.svg' {
  export const id: string;
  export const url: string;
  export const viewBox: string;
  export default url;
}
declare module '*.jpeg' { export default '' as string }
declare module '*.jpg' { export default '' as string }
declare module '*.mp3' { export default '' as string }
