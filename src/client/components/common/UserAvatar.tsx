import { FC, memo, useMemo } from 'react';
import { UserInfoDto } from '../../../server/users/dto/user-info.dto';
import styles from '../../scss/UserAvatar.module.scss';
import { LoadingIndicator } from './LoadingIndicator';
import { usePreloadedImage } from '../../hooks/usePreloadedImage';

const UserAvatarComponent: FC<{ userData: UserInfoDto }> = ({ userData }) => {
  const avatarUrl: string | undefined = useMemo(() => {
    if (userData.discordUsers.length > 0) {
      const discordAvatar = userData.discordUsers.find((du) => du.avatarUrl);
      if (discordAvatar) {
        return discordAvatar.avatarUrl;
      }
    }
    if (userData.patreonUsers.length > 0) {
      const patreonAvatar = userData.patreonUsers.find((pu) => pu.avatarUrl);
      if (patreonAvatar) {
        return patreonAvatar.avatarUrl;
      }
    }
  }, [userData.discordUsers, userData.patreonUsers]);

  const { src, loading } = usePreloadedImage(avatarUrl);

  if (loading) return <LoadingIndicator />;

  if (!src) return null;

  return (
    // eslint-disable-next-line @next/next/no-img-element
    <img src={src} alt="avatar image" className={styles.avatar} />
  );
};

export const UserAvatar = memo(UserAvatarComponent);
