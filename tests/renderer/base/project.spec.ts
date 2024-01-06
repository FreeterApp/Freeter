/*
 * Copyright: (c) 2024, Alex Kaul
 * GNU General Public License v3.0 or later (see COPYING or https://www.gnu.org/licenses/gpl-3.0.txt)
 */

import { createProject, Project, updateProjectSettings, updateProjectWorkflows } from '@/base/project';
import { fixtureProjectA, fixtureProjectSettingsA } from '@tests/base/fixtures/project';

describe('Project', () => {
  describe('createProject()', () => {
    it('should return a new project object with specified props', () => {
      const id = 'ID';
      const projectName = 'PROJECT NAME';

      const project = createProject(id, projectName);

      expect(project.id).toBe(id);
      expect(project.settings.name).toBe(projectName);
      expect(project.workflowIds).toEqual([]);
      expect(project.currentWorkflowId).toBe('');
    })
  })

  describe('updateProjectSettings()', () => {
    it('should return a new project object with updated settings', () => {
      const currentProject = fixtureProjectA();
      const newSettings = fixtureProjectSettingsA({ name: 'NEW NAME' });
      const expectedProject = {
        ...currentProject,
        settings: newSettings
      }

      const updatedProject = updateProjectSettings(currentProject, newSettings);

      expect(updatedProject).toEqual(expectedProject);
    })
  })

  describe('updateProjectWorkflows()', () => {
    it('should return a new project object with updated workflow ids', () => {
      const currentProject = fixtureProjectA();
      const newWorkflowIds = ['NEW-WORKFLOW'];
      const expectedProject: Project = {
        ...currentProject,
        workflowIds: newWorkflowIds
      }

      const updatedProject = updateProjectWorkflows(currentProject, newWorkflowIds);

      expect(updatedProject).toEqual(expectedProject);
    })
  })
})
