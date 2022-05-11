import axios from 'axios'
import { useState, useEffect } from 'react';

const initialState = {
  apps: []
}

const AllApps = () => {
  const [values, setValues] = useState(initialState)

  const fetchApps = async () => {
    const res = await axios.get('api/v1/applications/')
    setValues({...values, apps: res.data.apps})
  }
  useEffect(()=>{
    fetchApps()
  },[])

  const handleChange = (e) => {
    setValues({ ...values, [e.target.name]: e.target.value })
  }

  const handleSubmit = (e) => {
    e.preventDefault();
  }

  const appList = values.apps.map((app) => {
    const { app_Acronym, app_Description } = app
    return( <div className="card bg-base-100 shadow-xl">
              <div className="card-body">
                <h2 className="card-title">{app_Acronym}</h2>
                <p>{app_Description}</p>
                <div className="card-actions justify-end">
                  <button className="btn btn-primary">View</button>
                </div>
              </div>
            </div>
    )
  })

  return (
    <div className='p-4'>
      <h2 className='font-bold text-2xl'>All Apps</h2>
      <div className='grid grid-cols-4 gap-4'>
        {appList}
      </div>
    </div>
  );
};

export default AllApps;