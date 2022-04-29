import { Outlet, Link } from 'react-router-dom'
import { Page, Drawer } from '../../components'

const Shared = () => {
  return (
    <Page title="dashboard">
      <Drawer>
        <Outlet />
      </Drawer>
    </Page>
  );
};

export default Shared;