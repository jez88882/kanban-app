import { useEffect } from 'react';
import { Outlet, useNavigate } from 'react-router-dom'
import { Drawer, Page } from '../../components'
import { useAppContext } from '../../context/appContext';

const UserManagement = () => {
  const { user } = useAppContext()
  const navigate = useNavigate()

  useEffect(() => {
    if (!user.is_admin) {
      navigate('/')
    }
  }, [user, navigate])

  return (
    <Page title="User Management">
      <h1 className='font-bold text-3xl py-10 px-6 border-b-4'>User Management</h1>
      <Drawer>
        <Outlet />
      </Drawer>
    </Page>
  );
};

export default UserManagement;