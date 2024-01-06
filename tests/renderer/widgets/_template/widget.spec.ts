/*
 * Copyright: (c) 2024, Alex Kaul
 * GNU General Public License v3.0 or later (see COPYING or https://www.gnu.org/licenses/gpl-3.0.txt)
 */

import { Settings } from '@/widgets/_template/settings';
import { widgetComp } from '@/widgets/_template/widget'
import { screen } from '@testing-library/react';
import { setupWidgetSut } from '@tests/widgets/setupSut'

describe('Template Widget', () => {
  it('should show text specified in the settings', () => {
    const settings: Settings = { text: 'SOME TEXT VALUE' };
    setupWidgetSut(widgetComp, settings);

    expect(screen.getByText(settings.text)).toBeInTheDocument();
  })
})
