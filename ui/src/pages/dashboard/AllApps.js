import axios from 'axios'
import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'

const initialState = {
  apps: [],
  isPM: false
}

const AllApps = () => {
  const [values, setValues] = useState(initialState)
<<<<<<< HEAD
  const [isPM, setIsPM] = useState(false)

  const fetchApps = async () => {
    console.log('fetching Apps')
    const res = await axios.get('api/v1/applications/')
    setValues({...values, apps: res.data.apps})
  }
  useEffect(()=>{
    fetchApps()
    // checkPM()
=======
  
  const fetchData = async () => {
    console.log('fetching Apps and checking if PM')
    try {
      const resApps = await axios.get('/api/v1/applications')
      const resPM= await axios.get('/api/v1/groups/checkGeneralPM')
      setValues({apps: resApps.data.apps, isPM: resPM.data.result})
    } catch (error) {
      console.log(error.response)
    }
  }
  useEffect(()=>{
   fetchData()
>>>>>>> 738ccfc19c38aa49ef5b17fca811bc08ffe2657a
  },[])

  const appList = values.apps.map((app) => {
    const { App_Acronym, startDate, endDate } = app
<<<<<<< HEAD
    return(
    <Link to={`/applications/${App_Acronym}`}>
=======
    return( 
    <Link key={App_Acronym} to={`/applications/${App_Acronym}`}>
>>>>>>> 738ccfc19c38aa49ef5b17fca811bc08ffe2657a
      <div className="card bg-base-100 shadow-xl">
        <div className="card-body">
          <h2 className="card-title">{App_Acronym}</h2>
          <div className="card-actions justify-between">
            <div>
              <p>Start Date: {startDate}</p>
              <p>End Date: {endDate}</p>
            </div>
            <button className="btn btn-primary">View</button>
          </div>
        </div>
      </div>
    </Link>
    )
  })

  return (
    <>
      <div className='py-10 px-6 border-b-4 flex justify-between'>
        <h1 className='font-bold text-3xl'>All Applications</h1>
        {values.isPM &&
        <Link className='btn btn-primary' to='/applications/new'>Create new app</Link>
        }
      </div>
      <div className='m-6'>
        <div className='grid grid-cols-4 gap-4'>
          {appList}
        </div>
      </div>
    </>
  );
};

export default AllApps;
