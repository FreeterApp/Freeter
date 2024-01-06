/*
 * Copyright: (c) 2024, Alex Kaul
 * GNU General Public License v3.0 or later (see COPYING or https://www.gnu.org/licenses/gpl-3.0.txt)
 */

import { fixtureAppState } from '@tests/base/state/fixtures/appState';
import { entityStateActions } from '@/base/state/actions';
import { fixtureProjectA, fixtureProjectB, fixtureProjectC } from '@tests/base/fixtures/project';
import { fixtureWidgetTypeA, fixtureWidgetTypeB, fixtureWidgetTypeC } from '@tests/base/fixtures/widgetType';
import { fixtureWidgetA, fixtureWidgetB, fixtureWidgetC } from '@tests/base/fixtures/widget';
import { fixtureWorkflowA, fixtureWorkflowB, fixtureWorkflowC } from '@tests/base/fixtures/workflow';
import { Project } from '@/base/project';
import { AppState } from '@/base/state/app';

const fixtures = {
  'projects': [fixtureProjectA, fixtureProjectB, fixtureProjectC],
  'widgetTypes': [fixtureWidgetTypeA, fixtureWidgetTypeB, fixtureWidgetTypeC],
  'widgets': [fixtureWidgetA, fixtureWidgetB, fixtureWidgetC],
  'workflows': [fixtureWorkflowA, fixtureWorkflowB, fixtureWorkflowC]
}

// These types are used for typecasting from union types to a specific one in the
// describe.each loop to overcome the "Each member of the union type '...' has signatures,
// but none of those signatures are compatible with each other.ts(2349)" issue
type StateActions = typeof entityStateActions.projects;
type Fixtures = typeof fixtures.projects;

describe.each([
  ['projects', entityStateActions.projects, fixtures.projects],
  ['widgetTypes', entityStateActions.widgetTypes, fixtures.widgetTypes],
  ['widgets', entityStateActions.widgets, fixtures.widgets],
  ['workflows', entityStateActions.workflows, fixtures.workflows]
] as [keyof typeof fixtures, StateActions, Fixtures][])('entityStateActions.%s', (entityName, actions, fixtures) => {
  const fixtureEntityA = fixtures[0];
  const fixtureEntityB = fixtures[1];
  const fixtureEntityC = fixtures[2];

  it('should allow to get one entity from the state', () => {
    const entityA = fixtureEntityA();
    const entityB = fixtureEntityB();
    const state = fixtureAppState({
      entities: {
        [entityName]: {
          [entityA.id]: entityA,
          [entityB.id]: entityB
        }
      }
    })

    const got = actions.getOne(state, entityB.id);

    expect(got).toBe(entityB);
  })

  it('should allow to get many entities from the state', () => {
    const entityA = fixtureEntityA();
    const entityB = fixtureEntityB();
    const entityC = fixtureEntityC();
    const state = fixtureAppState({
      entities: {
        [entityName]: {
          [entityA.id]: entityA,
          [entityB.id]: entityB,
          [entityC.id]: entityC,
        }
      }
    })

    const got = actions.getMany(state, [entityB.id, entityA.id]);

    expect(got).toEqual([entityB, entityA]);
  })

  it('should allow to get all entities from the state as array', () => {
    const entityA = fixtureEntityA();
    const entityB = fixtureEntityB();
    const entityC = fixtureEntityC();
    const state = fixtureAppState({
      entities: {
        [entityName]: {
          [entityA.id]: entityA,
          [entityB.id]: entityB,
          [entityC.id]: entityC,
        }
      }
    })

    const got = actions.getAsArray(state);

    expect(got).toEqual([entityA, entityB, entityC]);
  })

  it('should allow to get all entities from the state as collection', () => {
    const entityA = fixtureEntityA();
    const entityB = fixtureEntityB();
    const entityC = fixtureEntityC();
    const state = fixtureAppState({
      entities: {
        [entityName]: {
          [entityA.id]: entityA,
          [entityB.id]: entityB,
          [entityC.id]: entityC,
        }
      }
    })

    const got = actions.get(state);

    expect(got).toEqual({
      [entityA.id]: entityA,
      [entityB.id]: entityB,
      [entityC.id]: entityC,
    });
  })

  it('should allow to add one entity to the state', () => {
    const entityA = fixtureEntityA();
    const entityB = fixtureEntityB();
    const state = fixtureAppState({
      entities: {
        [entityName]: {
          [entityA.id]: entityA,
        }
      }
    })

    const stateAfterAdd = actions.addOne(state, entityB);

    const expectSate: AppState = {
      ...state,
      entities: {
        ...state.entities,
        [entityName]: {
          ...state.entities[entityName],
          [entityB.id]: entityB,
        }
      }
    };
    expect(stateAfterAdd).toEqual(expectSate)
  })

  it('should not change state when re-add an entity', () => {
    const entityA = fixtureEntityA();
    const state = fixtureAppState({
      entities: {
        [entityName]: {
          [entityA.id]: entityA,
        }
      }
    })

    const stateAfterAdd = actions.addOne(state, entityA);

    expect(stateAfterAdd).toBe(state)
  })

  it('should allow to add many entities to the state', () => {
    const entityA = fixtureEntityA();
    const entityB = fixtureEntityB();
    const entityC = fixtureEntityC();
    const state = fixtureAppState({
      entities: {
        [entityName]: {
          [entityA.id]: entityA,
        }
      }
    })

    const stateAfterAdd = actions.addMany(state, [entityB, entityC]);

    const expectSate: AppState = {
      ...state,
      entities: {
        ...state.entities,
        [entityName]: {
          ...state.entities[entityName],
          [entityB.id]: entityB,
          [entityC.id]: entityC,
        }
      }
    };
    expect(stateAfterAdd).toEqual(expectSate)
  })

  it('should allow to add many entities to the state from an entity collection', () => {
    const entityA = fixtureEntityA();
    const entityB = fixtureEntityB();
    const entityC = fixtureEntityC();
    const state = fixtureAppState({
      entities: {
        [entityName]: {
          [entityA.id]: entityA,
        }
      }
    })

    const stateAfterAdd = actions.addMany(state, {
      [entityB.id]: entityB,
      [entityC.id]: entityC,
    });

    const expectSate: AppState = {
      ...state,
      entities: {
        ...state.entities,
        [entityName]: {
          ...state.entities[entityName],
          [entityB.id]: entityB,
          [entityC.id]: entityC,
        }
      }
    };
    expect(stateAfterAdd).toEqual(expectSate)
  })

  it('should allow to remove existing and add new entities with setAll', () => {
    const entityA = fixtureEntityA();
    const entityB = fixtureEntityB();
    const entityC = fixtureEntityC();
    const state = fixtureAppState({
      entities: {
        [entityName]: {
          [entityA.id]: entityA,
        }
      }
    })

    const stateAfterSet = actions.setAll(state, [entityB, entityC]);

    const expectSate = {
      ...state,
      entities: {
        ...state.entities,
        [entityName]: {
          [entityB.id]: entityB,
          [entityC.id]: entityC,
        }
      }
    };
    expect(stateAfterSet).toEqual(expectSate)
  })

  it('should allow to remove existing and add new entities with setAll by passing in an entity collection', () => {
    const entityA = fixtureEntityA();
    const entityB = fixtureEntityB();
    const entityC = fixtureEntityC();
    const state = fixtureAppState({
      entities: {
        [entityName]: {
          [entityA.id]: entityA,
        }
      }
    })

    const stateAfterSet = actions.setAll(state, {
      [entityB.id]: entityB,
      [entityC.id]: entityC,
    })

    const expectSate: AppState = {
      ...state,
      entities: {
        ...state.entities,
        [entityName]: {
          [entityB.id]: entityB,
          [entityC.id]: entityC,
        }
      }
    };
    expect(stateAfterSet).toEqual(expectSate)
  })

  it('should allow to remove an entity from the state', () => {
    const entityA = fixtureEntityA();
    const entityB = fixtureEntityB();
    const state = fixtureAppState({
      entities: {
        [entityName]: {
          [entityA.id]: entityA,
          [entityB.id]: entityB,
        }
      }
    })

    const stateAfterRemove = actions.removeOne(state, entityA.id);

    const expectSate: AppState = {
      ...state,
      entities: {
        ...state.entities,
        [entityName]: {
          [entityB.id]: entityB,
        }
      }
    };
    expect(stateAfterRemove).toEqual(expectSate)
  })

  it('should allow to remove many entities from the state', () => {
    const entityA = fixtureEntityA();
    const entityB = fixtureEntityB();
    const entityC = fixtureEntityC();
    const state = fixtureAppState({
      entities: {
        [entityName]: {
          [entityA.id]: entityA,
          [entityB.id]: entityB,
          [entityC.id]: entityC,
        }
      }
    })

    const stateAfterRemove = actions.removeMany(state, [entityA.id, entityB.id]);

    const expectSate: AppState = {
      ...state,
      entities: {
        ...state.entities,
        [entityName]: {
          [entityC.id]: entityC,
        }
      }
    }
    expect(stateAfterRemove).toEqual(expectSate)
  })

  it('should allow to remove all entities from the state', () => {
    const entityA = fixtureEntityA();
    const entityB = fixtureEntityB();
    const entityC = fixtureEntityC();
    const state = fixtureAppState({
      entities: {
        [entityName]: {
          [entityA.id]: entityA,
          [entityB.id]: entityB,
          [entityC.id]: entityC,
        }
      }
    })

    const stateAfterRemove = actions.removeAll(state);

    const expectState: AppState = {
      ...state,
      entities: {
        ...state.entities,
        [entityName]: {}
      }
    }
    expect(stateAfterRemove).toEqual(expectState);
  })

  it('should allow to update an entity in the state', () => {
    const entityA = fixtureEntityA();
    const changes = { str: 'Changed Str' } as Partial<Project>;
    const state = fixtureAppState({
      entities: {
        [entityName]: {
          [entityA.id]: entityA,
        }
      }
    })

    const stateAfterUpdate = actions.updateOne(state, {
      id: entityA.id,
      changes,
    });

    const expectState: AppState = {
      ...state,
      entities: {
        ...state.entities,
        [entityName]: {
          ...state.entities[entityName],
          [entityA.id]: {
            ...entityA,
            ...changes
          }
        }
      }
    }
    expect(stateAfterUpdate).toEqual(expectState)
  })

  it('should not change state when trying to update an entity that has not been added', () => {
    const entityA = fixtureEntityA();
    const changes = { str: 'New Str' } as Partial<Project>;
    const state = fixtureAppState({
      entities: {
        [entityName]: {}
      }
    })

    const stateAfterUpdate = actions.updateOne(state, {
      id: entityA.id,
      changes,
    });

    expect(stateAfterUpdate).toBe(state);
  })

  it('should replace an existing entity if the ID is changed while updating', () => {
    const entityA = fixtureEntityA();
    const entityB = fixtureEntityB();
    const entityC = fixtureEntityC();
    const state = fixtureAppState({
      entities: {
        [entityName]: {
          [entityA.id]: entityA,
          [entityB.id]: entityB,
          [entityC.id]: entityC,
        }
      }
    })

    const stateAfterUpdate = actions.updateOne(state, {
      id: entityB.id,
      changes: {
        id: entityC.id
      }
    });

    const expectState: AppState = {
      ...state,
      entities: {
        ...state.entities,
        [entityName]: {
          [entityA.id]: entityA,
          [entityC.id]: {
            ...entityB,
            id: entityC.id
          }
        }
      }
    }
    expect(stateAfterUpdate).toEqual(expectState)
  })

  it('should allow to update the id of entity', () => {
    const entityA = fixtureEntityA();
    const changes = { id: 'New Id' }
    const state = fixtureAppState({
      entities: {
        [entityName]: {
          [entityA.id]: entityA,
        }
      }
    })

    const stateAfterUpdate = actions.updateOne(state, {
      id: entityA.id,
      changes
    });

    const expectState: AppState = {
      ...state,
      entities: {
        ...state.entities,
        [entityName]: {
          [changes.id]: {
            ...entityA,
            ...changes
          }
        }
      }
    }
    expect(stateAfterUpdate).toEqual(expectState)
  })

  it('should allow to update many entities by id in the state', () => {
    const entityA = fixtureEntityA();
    const entityB = fixtureEntityB();
    const changes1 = { str: 'New Str' } as Partial<Project>;
    const changes2 = { num: 12345678 } as Partial<Project>;
    const state = fixtureAppState({
      entities: {
        [entityName]: {
          [entityA.id]: entityA,
          [entityB.id]: entityB,
        }
      }
    })

    const stateAfterUpdate = actions.updateMany(state, [
      { id: entityA.id, changes: changes1 },
      { id: entityB.id, changes: changes2 },
    ]);

    const expectSate: AppState = {
      ...state,
      entities: {
        ...state.entities,
        [entityName]: {
          ...state.entities[entityName],
          [entityA.id]: {
            ...entityA,
            ...changes1
          },
          [entityB.id]: {
            ...entityB,
            ...changes2
          },
        }
      }
    }
    expect(stateAfterUpdate).toEqual(expectSate)
  })

  it('should allow to add a new entity in the state with setOne()', () => {
    const entityA = fixtureEntityA();
    const entityB = fixtureEntityB();
    const entityC = fixtureEntityC();
    const state = fixtureAppState({
      entities: {
        [entityName]: {
          [entityA.id]: entityA,
          [entityB.id]: entityB,
        }
      }
    })

    const stateAfterSet = actions.setOne(state, entityC);

    const expectState: AppState = {
      ...state,
      entities: {
        ...state.entities,
        [entityName]: {
          ...state.entities[entityName],
          [entityC.id]: entityC,
        }
      }
    }
    expect(stateAfterSet).toEqual(expectState)
  })

  it('should allow to replace an entity in the state with setOne()', () => {
    const entityA = fixtureEntityA();
    const state = fixtureAppState({
      entities: {
        [entityName]: {
          [entityA.id]: entityA,
        }
      }
    })

    const updatedEntityA = fixtureEntityB({ id: entityA.id })
    const stateAfterSet = actions.setOne(state, updatedEntityA);

    const expectState: AppState = {
      ...state,
      entities: {
        ...state.entities,
        [entityName]: {
          [entityA.id]: updatedEntityA,
        }
      }
    }
    expect(stateAfterSet).toEqual(expectState)
  })

  it('should do nothing when setMany is given an empty array', () => {
    const entityA = fixtureEntityA();
    const state = fixtureAppState({
      entities: {
        [entityName]: {
          [entityA.id]: entityA,
        }
      }
    })

    const stateAfterSet = actions.setMany(state, []);

    expect(stateAfterSet).toBe(state)
  })

  it('should allow to set many entities in the state', () => {
    const entityA = fixtureEntityA();
    const state = fixtureAppState({
      entities: {
        [entityName]: {
          [entityA.id]: entityA,
        }
      }
    })

    const updatedEntityA = fixtureEntityB({ id: entityA.id })
    const entityC = fixtureEntityC();
    const stateAfterSet = actions.setMany(state, [updatedEntityA, entityC]);

    const expectState: AppState = {
      ...state,
      entities: {
        ...state.entities,
        [entityName]: {
          ...state.entities[entityName],
          [entityA.id]: updatedEntityA,
          [entityC.id]: entityC
        }
      }
    }
    expect(stateAfterSet).toEqual(expectState)
  })

  it('should allow to set many entities in the state when passing in an entity collection', () => {
    const entityA = fixtureEntityA();
    const state = fixtureAppState({
      entities: {
        [entityName]: {
          [entityA.id]: entityA,
        }
      }
    })

    const updatedEntityA = fixtureEntityB({ id: entityA.id })
    const entityC = fixtureEntityC();
    const stateAfterSet = actions.setMany(state, {
      [entityA.id]: updatedEntityA,
      [entityC.id]: entityC,
    });

    const expectState: AppState = {
      ...state,
      entities: {
        ...state.entities,
        [entityName]: {
          ...state.entities[entityName],
          [entityA.id]: updatedEntityA,
          [entityC.id]: entityC
        }
      }
    }
    expect(stateAfterSet).toEqual(expectState)
  })
})
