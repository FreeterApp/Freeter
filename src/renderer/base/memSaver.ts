/*
 * Copyright: (c) 2024, Alex Kaul
 * GNU General Public License v3.0 or later (see COPYING or https://www.gnu.org/licenses/gpl-3.0.txt)
 */

interface MemSaverConfig {
  /**
   * -1 - Project Switch
   *  0 - Project/Workflow Switch
   *  X - X secs after Project/Workflow Switch
   */
  workflowInactiveAfter: number;
  activateWorkflowsOnProjectSwitch: boolean;
}

export type MemSaverConfigApp = MemSaverConfig;
export type MemSaverConfigPrj = Partial<MemSaverConfig>;
export type MemSaverConfigWfl = Partial<MemSaverConfig>;

const memSaverConfigInactiveAfterVals = [
  -1,
  0,
  5,
  15,
  30,
  60,
  120,
  240,
  480,
  960,
  1440
] as const;

const memSaverConfigInactiveAfterValsNameByVal: Record<typeof memSaverConfigInactiveAfterVals[number], string> = {
  [-1]: 'Switching Project',
  [0]: 'Switching Project or Workflow',
  [5]: '5 minutes',
  [15]: '15 minutes',
  [30]: '30 minutes',
  [60]: '1 hour',
  [120]: '2 hours',
  [240]: '4 hours',
  [480]: '8 hours',
  [960]: '16 hours',
  [1440]: '1 day',
}

export const memSaverConfigAppInactiveAfterOptions = memSaverConfigInactiveAfterVals.map(val => ({
  val,
  name: memSaverConfigInactiveAfterValsNameByVal[val]
}));
export const memSaverConfigAppActivateOnProjectSwitchOptions = [
  { val: true, name: 'Turned On' },
  { val: false, name: 'Turned Off' },
];
export const memSaverConfigPrjInactiveAfterOptions = [
  { val: undefined, name: '(Use Application Settings value)' },
  ...memSaverConfigAppInactiveAfterOptions
]
export const memSaverConfigPrjActivateOnProjectSwitchOptions = [
  { val: undefined, name: '(Use Application Settings value)' },
  ...memSaverConfigAppActivateOnProjectSwitchOptions
];
export const memSaverConfigWflInactiveAfterOptions = [
  { val: undefined, name: '(Use Project Settings value)' },
  ...memSaverConfigAppInactiveAfterOptions
]
export const memSaverConfigWflActivateOnProjectSwitchOptions = [
  { val: undefined, name: '(Use Project Settings value)' },
  ...memSaverConfigAppActivateOnProjectSwitchOptions
];

export function calcMemSaverConfig(app: MemSaverConfigApp, prj: MemSaverConfigPrj, wfl: MemSaverConfigWfl): MemSaverConfig {
  return {
    ...app,
    ...prj,
    ...wfl
  }
}

export function sanitizeWorkflowInactiveAfter(val: unknown): number {
  if (typeof val !== 'number') {
    return -1;
  }
  return Math.max(-1, val);
}

export function sanitizeActivateWorkflowsOnProjectSwitch(val: unknown): boolean {
  if (typeof val !== 'boolean') {
    return true;
  }
  return val;
}
