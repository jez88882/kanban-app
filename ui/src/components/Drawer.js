import Navbar from "./Navbar"
import { Link } from 'react-router-dom'

const Drawer = (props) => {
  return (
    <div class="drawer drawer-mobile">
      <input id="my-drawer-2" type="checkbox" class="drawer-toggle"/>
      <div class="drawer-content flex flex-col">
        {/* <!-- Page content here --> */}
        <label for="my-drawer-2" class="btn btn-primary drawer-button lg:hidden">Open drawer</label>
        {props.children}
      
      </div> 
      <div class="drawer-side border-r-2 bg-neutral">
        <label for="my-drawer-2" class="drawer-overlay"></label> 
        <ul class="menu p-4 overflow-y-auto w-60 bg-base-100 text-base-content">
          {/* <!-- Sidebar content here --> */}
          <li><Link to="" className="no-underline">All Users</Link></li>
          <li><Link to="new" className="no-underline">Create User</Link></li>
        </ul>
      
      </div>
    </div>
  );
};

export default Drawer;