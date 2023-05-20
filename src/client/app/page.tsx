import React, { Fragment } from 'react';
import { Metadata, NextPage } from 'next';
import styles from '../scss/Index.module.scss';
import logoImage from '../public/static/logos/app.svg';
import Image from 'next/image';
import { SITE_TITLE } from '../config';
import { clientEnv } from '../client-env';
import { publicAssetPath } from '../utils/public-asset-path';
import { UserInfo } from '../components/shell/UserInfo';
import { TemplateList } from '../components/templates/TemplateList';

const openGraph: Metadata['openGraph'] = {
  title: SITE_TITLE,
  description:
    'An application that helps with automating Discord message updates',
  images: publicAssetPath('/social.png'),
  type: 'website',
  siteName: SITE_TITLE,
  url: '/',
};

export const metadata: Metadata = {
  metadataBase: new URL(clientEnv.PUBLIC_HOST),
  title: openGraph.title,
  description: openGraph.description,
  openGraph,
  icons: publicAssetPath('/logos/logo.png'),
};

const Page: NextPage = () => {
  return (
    <Fragment>
      <div className={styles.index}>
        <h1>
          <Image
            src={logoImage}
            width={120}
            height={120}
            alt={`${SITE_TITLE} logo`}
          />
          <span>{SITE_TITLE}</span>
        </h1>
        <TemplateList />
      </div>
      <UserInfo />
    </Fragment>
  );
};

export default Page;
