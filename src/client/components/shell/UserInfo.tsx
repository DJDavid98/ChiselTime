'use client';

import styles from '../../scss/UserInfo.module.scss';
import { FC, useMemo } from 'react';
import { UserAvatar } from '../common/UserAvatar';
import { LoadingIndicator } from '../common/LoadingIndicator';
import { useUserInfo } from '../../hooks/useUserInfo';

interface TierData {
  className?: string;
  label: string;
  supportLevel?: number;
}

export const UserInfo: FC = () => {
  const result = useUserInfo();

  const tierData: TierData = useMemo(() => {
    return { label: 'Free' };
  }, []);

  return (
    <div className={styles.info}>
      {!result.error && result.data ? (
        <>
          <UserAvatar userData={result.data} />
          <span className={styles.username}>{result.data.name}</span>
          <span
            className={`${styles.tier}${
              tierData.className ? ` ${tierData.className}` : ''
            }`}
          >
            {tierData.label}
          </span>
          <span className={styles.divider} />
          <form action="/auth/logout" method="POST" className={styles.logout}>
            <button>Logout</button>
          </form>
        </>
      ) : result.isLoading ? (
        <LoadingIndicator />
      ) : (
        <a href="/auth/login/discord">Login</a>
      )}
    </div>
  );
};
