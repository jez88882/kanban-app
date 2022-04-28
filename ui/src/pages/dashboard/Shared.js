import { Outlet, Link } from 'react-router-dom'
import { Page, Drawer } from '../../components'

const Shared = () => {
  return (
    <Page title="dashboard">
      <Drawer>
        <Link to="organization">organization</Link>
        <Link to="user-management">user management</Link>
      </Drawer>
      <Outlet />
    </Page>
  );
};

export default Shared;