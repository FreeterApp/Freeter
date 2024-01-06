/*
 * Copyright: (c) 2024, Alex Kaul
 * GNU General Public License v3.0 or later (see COPYING or https://www.gnu.org/licenses/gpl-3.0.txt)
 */

import { Entity } from '@/base/entity';
import { makeFixture } from '@utils/makeFixture';

interface EntityWithProps extends Entity {
  propNum: number;
  propStr: string;
  propBool: boolean;
}

const entity: Entity[] = [{
  id: 'A'
}, {
  id: 'B'
}, {
  id: 'C'
}, {
  id: 'D'
}]
const entityWithProps: EntityWithProps[] = [{
  id: 'A',
  propNum: 1,
  propStr: 'text1',
  propBool: true
}, {
  id: 'B',
  propNum: 2,
  propStr: 'text2',
  propBool: false
}, {
  id: 'C',
  propNum: 3,
  propStr: 'text3',
  propBool: true
}, {
  id: 'D',
  propNum: 4,
  propStr: 'text4',
  propBool: false
}]

export const fixtureEntityA = makeFixture(entity[0]);
export const fixtureEntityB = makeFixture(entity[1]);
export const fixtureEntityC = makeFixture(entity[2]);
export const fixtureEntityD = makeFixture(entity[3]);
export const fixtureEntityWithPropsA = makeFixture(entityWithProps[0]);
export const fixtureEntityWithPropsB = makeFixture(entityWithProps[1]);
export const fixtureEntityWithPropsC = makeFixture(entityWithProps[2]);
export const fixtureEntityWithPropsD = makeFixture(entityWithProps[3]);
