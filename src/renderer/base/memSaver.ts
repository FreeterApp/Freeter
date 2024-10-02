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

export function calcMemSaverConfig(app: MemSaverConfigApp, prj: MemSaverConfigPrj, wfl: MemSaverConfigWfl): MemSaverConfig {
  return {
    ...app,
    ...prj,
    ...wfl
  }
}

export function sanitizeWorkflowInactiveAfter(val: number): number {
  return Math.max(-1, val);
}
