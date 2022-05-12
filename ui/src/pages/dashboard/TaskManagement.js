import { useEffect } from 'react';
import { Outlet, useNavigate } from 'react-router-dom'
import { TaskDrawer, Page } from '../../components'
import { useAppContext } from '../../context/appContext';

const UserManagement = () => {

  return (
    <Page title="Task Management">
      <Outlet />
    </Page>
  );
};

export default UserManagement;