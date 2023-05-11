import React from 'react'
import { useState, lazy, Suspense } from 'react';
import Menu from './Menu'
import { Outlet, useParams } from 'react-router-dom';

const Layout = () => {
  const { userid } = useParams();

  return (
    <div>
      <Menu userID={userid} />
      {/* <Suspense fallback={<h1>Loading...</h1>}>
        <Outlet />
      </Suspense> */}

      <Outlet />
      {/* <div className='footer'>
        Footer
      </div> */}
    </div>
  )
}

export default Layout