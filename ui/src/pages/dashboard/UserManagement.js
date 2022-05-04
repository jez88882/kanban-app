import { Outlet, Link } from 'react-router-dom'
import { Drawer } from '../../components'

const UserManagement = () => {
  return (
    <div className="p-14">
      <h1 className='font-bold text-3xl py-10 px-6 border-b-4'>User Management</h1>
      <Drawer>
        <Outlet />
      </Drawer>
    </div>
  );
};

export default UserManagement;