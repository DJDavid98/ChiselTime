import React from 'react';
import { Metadata, NextPage } from 'next';
import styles from '../scss/Index.module.scss';
import logoImage from '../public/logos/app.svg';
import Image from 'next/image';
import { SITE_TITLE } from '../config';
import { env } from '../env';

const openGraph: Metadata['openGraph'] = {
  title: 'ChiselTime',
  description:
    'An application that helps with automating Discord message updates',
  images: '/social.png',
};

export const metadata: Metadata = {
  metadataBase: new URL(env.NEXT_PUBLIC_HOST),
  title: openGraph.title,
  description: openGraph.description,
  openGraph,
};

const Page: NextPage = () => {
  return (
    <div className={styles.index}>
      <h1>
        <Image
          src={logoImage}
          width={120}
          height={120}
          alt={`${SITE_TITLE} logo`}
        />
        <span>ChiselTime</span>
      </h1>
      <p>Coming soon…</p>
    </div>
  );
};

export default Page;
