/*
 * Copyright: (c) 2024, Alex Kaul
 * GNU General Public License v3.0 or later (see COPYING or https://www.gnu.org/licenses/gpl-3.0.txt)
 */

import { SvgIcon } from '@/ui/components/basic/svgIcon';
import styles from './button.module.scss';
import clsx from 'clsx';

export interface ButtonProps extends Omit<React.DetailedHTMLProps<React.ButtonHTMLAttributes<HTMLButtonElement>, HTMLButtonElement>, 'aria-pressed'> {
  size?: 'S' | 'M' | 'L' | 'Fill';
  iconSvg?: string;
  caption?: string;
  pressed?: boolean | undefined;
  primary?: boolean | undefined;
}

export const Button = ({
  caption,
  iconSvg,
  size = 'M',
  pressed,
  primary,
  className,
  title,
  'aria-label': ariaLabel,
  ...restProps
}: ButtonProps) => (
  <button
    className={clsx(
      styles['button'],
      size === 'L' && styles['size-l'],
      size === 'M' && styles['size-m'],
      size === 'S' && styles['size-s'],
      size === 'Fill' && styles['size-fill'],
      primary && styles['primary'],
      !iconSvg && caption && styles['only-caption'],
      iconSvg && !caption && styles['only-icon'],
      className
    )}
    aria-pressed={pressed}
    title={title || caption}
    aria-label={ariaLabel || title || caption}
    {...restProps}
  >
    {iconSvg && <SvgIcon svg={iconSvg} className={styles['button-icon']}></SvgIcon>}
    {caption && <span>{caption}</span>}
  </button>
)
