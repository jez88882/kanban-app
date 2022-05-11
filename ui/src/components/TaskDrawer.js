import { Link } from 'react-router-dom'

const Drawer = (props) => {
  return (
    <div className="drawer drawer-mobile">
      <input id="my-drawer-2" type="checkbox" className="drawer-toggle"/>
      <div className="drawer-content flex flex-col">
        {/* <!-- Page content here --> */}
        <label htmlFor="my-drawer-2" className="btn btn-primary drawer-button lg:hidden">Open drawer</label>
        {props.children}
      </div> 
      <div className="drawer-side border-r-2 bg-neutral">
        <label htmlFor="my-drawer-2" className="drawer-overlay"></label> 
        <ul className="menu p-4 overflow-y-auto w-60 bg-base-100 text-base-content">
          {/* <!-- Sidebar content here --> */}
          <li><Link to="" className="no-underline">All Apps</Link></li>
          <li><Link to="new-app" className="no-underline">Create App</Link></li>
        </ul>
      </div>
    </div>
  );
};

export default Drawer;