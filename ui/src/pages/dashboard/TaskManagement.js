import { useEffect } from 'react';
import { Outlet, useNavigate } from 'react-router-dom'
import { TaskDrawer, Page } from '../../components'
import { useAppContext } from '../../context/appContext';

const UserManagement = () => {
  const { user, is_admin } = useAppContext()
  const navigate = useNavigate()


  return (
    <Page title="User Management">
      <h1 className='font-bold text-3xl py-10 px-6 border-b-4'>User Management</h1>
      <TaskDrawer>
        <Outlet />
      </TaskDrawer>
    </Page>
  );
};

export default UserManagement;