/*
 * Copyright: (c) 2024, Alex Kaul
 * GNU General Public License v3.0 or later (see COPYING or https://www.gnu.org/licenses/gpl-3.0.txt)
 */

type GetState<T extends object> = () => T;
type SetState<T extends object> = (newState: T) => void;

export type StateInStore<TState extends object> = TState & {
  isLoading?: true;
}

export interface Store<TState extends object> {
  get: GetState<StateInStore<TState>>;
  set: SetState<StateInStore<TState>>;
  subscribe: <U>(selector: (state: StateInStore<TState>) => U, listener: (selectedState: U, previousSelectedState: U) => void, options?: {
    fireImmediately?: boolean;
  }) => () => void;
  subscribeWithStrictEq: <U>(selector: (state: StateInStore<TState>) => U, listener: (selectedState: U, previousSelectedState: U) => void, options?: {
    fireImmediately?: boolean;
  }) => () => void;
  subscribeWithCustomEq: <U>(selector: (state: StateInStore<TState>) => U, listener: (selectedState: U, previousSelectedState: U) => void, options?: {
    equalityFn?: (a: U, b: U) => boolean;
    fireImmediately?: boolean;
  }) => () => void;
}
