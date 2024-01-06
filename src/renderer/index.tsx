/*
 * Copyright: (c) 2024, Alex Kaul
 * GNU General Public License v3.0 or later (see COPYING or https://www.gnu.org/licenses/gpl-3.0.txt)
 */

import {createRoot} from 'react-dom/client';
import { init } from './init';

async function main() {
  const { App } = await init();

  const root = createRoot(document.getElementById('app') as HTMLElement);

  root.render(<App />);
}

main();
