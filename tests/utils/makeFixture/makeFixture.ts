/*
 * Copyright: (c) 2024, Alex Kaul
 * GNU General Public License v3.0 or later (see COPYING or https://www.gnu.org/licenses/gpl-3.0.txt)
 */

import { deepFreeze } from '@common/helpers/deepFreeze';

export const makeFixture = <T extends object>(fixtureData: T) => (testData?: Partial<T>): T => deepFreeze({ ...fixtureData, ...testData });
