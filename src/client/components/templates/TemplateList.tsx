'use client';

import React, { FC } from 'react';
import { useUserInfo } from '../../hooks/useUserInfo';
import { Templates } from './Templates';

export const TemplateList: FC = () => {
  const userInfo = useUserInfo();

  return !userInfo.data ? (
    <p>Coming soon…</p>
  ) : (
    <Templates
      userId={userInfo.data.id}
      maxCount={userInfo.data.maxTemplates}
    />
  );
};
