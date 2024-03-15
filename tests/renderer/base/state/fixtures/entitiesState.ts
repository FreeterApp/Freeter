/*
 * Copyright: (c) 2024, Alex Kaul
 * GNU General Public License v3.0 or later (see COPYING or https://www.gnu.org/licenses/gpl-3.0.txt)
 */

import { Entity } from '@/base/entity';
import { fixtureProjectA, fixtureProjectB, fixtureProjectC, fixtureProjectD } from '@tests/base/fixtures/project';
import { fixtureWidgetA, fixtureWidgetB, fixtureWidgetC, fixtureWidgetD, fixtureWidgetE } from '@tests/base/fixtures/widget';
import { fixtureWidgetTypeA, fixtureWidgetTypeB, fixtureWidgetTypeC, fixtureWidgetTypeD } from '@tests/base/fixtures/widgetType';
import { fixtureWorkflowA, fixtureWorkflowB, fixtureWorkflowC, fixtureWorkflowD } from '@tests/base/fixtures/workflow';
import { deepFreeze } from '@common/helpers/deepFreeze';
import { EntitiesState } from '@/base/state/entities';
import { makeFixture } from '@utils/makeFixture';

const entitiesState: EntitiesState = {
  projects: {},
  widgets: {},
  widgetTypes: {},
  workflows: {}
}

const makeEntityInCollFixture = <T extends Entity, Y>(fixtureEntity: (testData?: Y) => T) => (testData?: Y): { [id: string]: T } => {
  const entity = fixtureEntity(testData);
  return deepFreeze({
    [entity.id]: entity
  })
}

export const fixtureProjectAInColl = makeEntityInCollFixture(fixtureProjectA);
export const fixtureProjectBInColl = makeEntityInCollFixture(fixtureProjectB);
export const fixtureProjectCInColl = makeEntityInCollFixture(fixtureProjectC);
export const fixtureProjectDInColl = makeEntityInCollFixture(fixtureProjectD);

export const fixtureWidgetAInColl = makeEntityInCollFixture(fixtureWidgetA);
export const fixtureWidgetBInColl = makeEntityInCollFixture(fixtureWidgetB);
export const fixtureWidgetCInColl = makeEntityInCollFixture(fixtureWidgetC);
export const fixtureWidgetDInColl = makeEntityInCollFixture(fixtureWidgetD);
export const fixtureWidgetEInColl = makeEntityInCollFixture(fixtureWidgetE);

export const fixtureWidgetTypeAInColl = makeEntityInCollFixture(fixtureWidgetTypeA);
export const fixtureWidgetTypeBInColl = makeEntityInCollFixture(fixtureWidgetTypeB);
export const fixtureWidgetTypeCInColl = makeEntityInCollFixture(fixtureWidgetTypeC);
export const fixtureWidgetTypeDInColl = makeEntityInCollFixture(fixtureWidgetTypeD);

export const fixtureWorkflowAInColl = makeEntityInCollFixture(fixtureWorkflowA);
export const fixtureWorkflowBInColl = makeEntityInCollFixture(fixtureWorkflowB);
export const fixtureWorkflowCInColl = makeEntityInCollFixture(fixtureWorkflowC);
export const fixtureWorkflowDInColl = makeEntityInCollFixture(fixtureWorkflowD);

export const fixtureEntitiesState = makeFixture(entitiesState);
