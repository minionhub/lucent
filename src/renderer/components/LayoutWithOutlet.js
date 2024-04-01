import React from 'react';
import { Outlet } from 'react-router-dom';
import Layout from './Layout';

const LayoutWithOutlet = () => {
  return (
    <Layout>
        <div className='h-full min-h-[100vh] bg-background'>
            <Outlet />
        </div>
    </Layout>
  );
};

export default LayoutWithOutlet;
