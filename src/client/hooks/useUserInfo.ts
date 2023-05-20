import useSWR from 'swr';
import { UserInfoDto } from '../../server/users/dto/user-info.dto';

export const useUserInfo = () =>
  useSWR(
    '/users/me',
    (key) =>
      fetch(key).then<UserInfoDto>((r) =>
        r.ok ? r.json() : Promise.reject(r),
      ),
    {
      refreshInterval: 10e3,
      refreshWhenHidden: false,
      errorRetryCount: 3,
      keepPreviousData: true,
    },
  );
