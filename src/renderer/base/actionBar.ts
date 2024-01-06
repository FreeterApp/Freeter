/*
 * Copyright: (c) 2024, Alex Kaul
 * GNU General Public License v3.0 or later (see COPYING or https://www.gnu.org/licenses/gpl-3.0.txt)
 */

import { Entity } from '@/base/entity';
import { EntityList } from '@/base/entityList';

export interface ActionBarItem extends Entity {
  readonly title: string;
  readonly icon: string;
  readonly enabled?: boolean;
  readonly pressed?: boolean;
  readonly doAction: () => Promise<void>;
}

export type ActionBarItems = EntityList<ActionBarItem>;
