/*
 * Copyright: (c) 2024, Alex Kaul
 * GNU General Public License v3.0 or later (see COPYING or https://www.gnu.org/licenses/gpl-3.0.txt)
 */

export interface SvgIconProps extends Pick<React.SVGProps<SVGSVGElement>, 'className' | 'style'> {
  svg: string;
}

export const SvgIcon = (props: SvgIconProps) => {
  const {svg, ...rest} = props;

  return (
    <svg {...rest}>
      <use href={svg}></use>
    </svg>
  )
}
