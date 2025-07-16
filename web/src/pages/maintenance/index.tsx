import { NextPage } from 'next';
import Head from 'next/head';
import MaintenanceMode from '@/components/MaintenanceMode';

const MaintenanceIndexPage: NextPage = () => {
  return (
    <>
      <Head>
        <title>Maintenance - prznt</title>
        <meta name="description" content="prznt is currently undergoing maintenance. We'll be back soon with exciting new features." />
        <meta name="robots" content="noindex, nofollow" />
      </Head>
      <MaintenanceMode />
    </>
  );
};

export default MaintenanceIndexPage;