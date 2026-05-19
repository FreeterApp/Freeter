/*
 * Copyright: (c) 2024, Alex Kaul
 * GNU General Public License v3.0 or later (see COPYING or https://www.gnu.org/licenses/gpl-3.0.txt)
 */

import { ProjectSwitcherViewModelHook } from '@/ui/components/projectSwitcher/projectSwitcherViewModel';
import clsx from 'clsx';
import styles from './projectSwitcher.module.scss';

type Deps = {
  useProjectSwitcherViewModel: ProjectSwitcherViewModelHook
}

export type ProjectSwitcherProps = React.PropsWithChildren<React.DetailedHTMLProps<React.HTMLAttributes<HTMLSelectElement>, HTMLSelectElement>>;

export function createProjectSwitcherComponent({
  useProjectSwitcherViewModel
}: Deps) {
  function ProjectSwitcher({
    className
  }: ProjectSwitcherProps) {
    const {
      currentProjectId,
      projects,
      noProjects,
      handleChange,
    } = useProjectSwitcherViewModel();

    return (
      <select
        value={currentProjectId}
        className={clsx(styles['project-switcher'], className)}
        disabled={noProjects}
        onChange={handleChange}
      >
        {
          noProjects
          ? <option>No projects</option>
          : <option value="" disabled={true}>Select Project</option>
        }
        {
          projects.map(project => (
            <option key={project.id} value={project.id}>{project.settings.name}</option>
          ))
        }
      </select>
    )
  }

  return ProjectSwitcher;
}
