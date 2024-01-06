/*
 * Copyright: (c) 2024, Alex Kaul
 * GNU General Public License v3.0 or later (see COPYING or https://www.gnu.org/licenses/gpl-3.0.txt)
 */

import { WidgetLayout } from '@/base/widgetLayout';
import { createWorkflow, updateWorkflowLayout, updateWorkflowSettings, Workflow } from '@/base/workflow';
import { fixtureWidgetLayoutItemA } from '@tests/base/fixtures/widgetLayout';
import { fixtureWorkflowA, fixtureWorkflowSettingsB } from '@tests/base/fixtures/workflow';

describe('Workflow', () => {
  describe('createWorkflow()', () => {
    it('should return a new workflow object with specified props', () => {
      const id = 'ID';
      const workflowName = 'WORKFLOWN NAME';

      const workflow = createWorkflow(id, workflowName);

      expect(workflow.id).toBe(id);
      expect(workflow.settings.name).toBe(workflowName);
    })
  })

  describe('updateWorkflowSettings()', () => {
    it('should return a new workflow object with updated settings', () => {
      const currentWorkflow = fixtureWorkflowA();
      const newSettings = fixtureWorkflowSettingsB({ name: 'Test Name' });
      const expectedWorkflow: Workflow = {
        ...currentWorkflow,
        settings: newSettings
      }

      const updatedWorkflow = updateWorkflowSettings(currentWorkflow, newSettings);

      expect(updatedWorkflow).toEqual(expectedWorkflow);
    })
  })

  describe('updateWorkflowLayout()', () => {
    it('should return a new workflow object with updated layout', () => {
      const currentWorkflow = fixtureWorkflowA();
      const newLayout: WidgetLayout = ([fixtureWidgetLayoutItemA({ id: 'NEW-ID' })]);

      const updatedWorkflow = updateWorkflowLayout(currentWorkflow, newLayout);

      const expectedWorkflow: Workflow = {
        ...currentWorkflow,
        layout: newLayout
      }
      expect(updatedWorkflow).toEqual(expectedWorkflow);
    })
  })
})
