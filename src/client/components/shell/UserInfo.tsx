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
    if (
      result.data &&
      result.data.patreonUsers &&
      result.data.patreonUsers.length > 0
    ) {
      // TODO Check tiers and return appropriate level
      return {
        // className: styles.supporter,
        label: 'Free',
        supportLevel: 0,
      };
    }

    return { label: 'Free' };
  }, [result.data]);

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
          {typeof tierData.supportLevel === 'undefined' && (
            <>
              <span className={styles.divider} />
              <a href="/auth/login/patreon">Link Patreon account</a>
            </>
          )}
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
