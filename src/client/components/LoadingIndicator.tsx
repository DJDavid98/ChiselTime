import styles from '../scss/LoadingIndicator.module.scss';
import { CSSProperties, FC, useMemo } from 'react';

interface LoadingIndicatorProps {
  size?: number;
}

export const LoadingIndicator: FC<LoadingIndicatorProps> = ({ size = 32 }) => {
  const style = useMemo(
    () => ({ '--size': `${size / 16}rem` } as CSSProperties),
    [size],
  );
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      xmlSpace="preserve"
      className={styles.indicator}
      viewBox="0 0 64 64"
      style={style}
    >
      <circle cx="32" cy="32" r="29" className={styles.face} />
      <path
        d="M35 32a3.001 3.001 0 0 1-6 0l3-26.074L35 32Z"
        className={styles.minute}
      />
      <path
        d="M35 32a3.001 3.001 0 0 1-6 0l3-13.037L35 32Z"
        className={styles.hour}
      />
      <path d="M32 3v7m0 44v7m22-29h7M3 32h7" className={styles.ticking} />
    </svg>
  );
};
