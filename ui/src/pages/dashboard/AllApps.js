import axios from 'axios'
import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'

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
    return( 
    <Link to={`/application/${app_Acronym}`}>
      <div className="card bg-base-100 shadow-xl">
        <div className="card-body">
          <h2 className="card-title">{app_Acronym}</h2>
          <p>{app_Description}</p>
          <div className="card-actions justify-end">
            <button className="btn btn-primary">View</button>
          </div>
        </div>
      </div>
    </Link>
    )
  })

  return (
    <>
      <h1 className='font-bold text-3xl py-10 px-6 border-b-4'>All Applications</h1>
      <div className='m-6'>
        <div className='grid grid-cols-4 gap-4'>
          {appList}
        </div>
      </div>
    </>
  );
};

export default AllApps;