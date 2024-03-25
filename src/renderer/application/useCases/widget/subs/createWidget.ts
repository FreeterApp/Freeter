/*
 * Copyright: (c) 2024, Alex Kaul
 * GNU General Public License v3.0 or later (see COPYING or https://www.gnu.org/licenses/gpl-3.0.txt)
 */

import { IdGenerator } from '@/application/interfaces/idGenerator';
import { Widget, createWidget } from '@/base/widget';
import { WidgetType } from '@/base/widgetType';

type Deps = {
  idGenerator: IdGenerator;
}
export function createCreateWidgetSubCase({
  idGenerator,
}: Deps) {
  function subCase(type: WidgetType, name: string): Widget {
    return createWidget(type, idGenerator(), name);
  }

  return subCase;
}

export type CreateWidgetSubCase = ReturnType<typeof createCreateWidgetSubCase>;
