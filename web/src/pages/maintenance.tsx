import { NextPage } from 'next';
import Head from 'next/head';
import MaintenanceMode from '@/components/MaintenanceMode';

const MaintenancePage: NextPage = () => {
  return (
    <>
      <Head>
        <title>Maintenance - aclue</title>
        <meta name="description" content="aclue is currently undergoing maintenance. We'll be back soon with exciting new features." />
        <meta name="robots" content="noindex, nofollow" />
      </Head>
      <MaintenanceMode />
    </>
  );
};

export default MaintenancePage;