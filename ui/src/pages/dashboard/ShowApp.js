import { useParams } from "react-router-dom";

const plans = [
  {
    Plan_MVP_name: 'plan1',
    Plan_startDate: '11/05/2022',
    Plan_endDate: '15/05/2022'
  },
  {
    Plan_MVP_name: 'plan2',
    Plan_startDate: '17/05/2022',
    Plan_endDate: '22/05/2022'
  },
  {
    Plan_MVP_name: 'plan3',
    Plan_startDate: '23/05/2022',
    Plan_endDate: '30/05/2022'
  },
]

const tasks = [

]

const plansList = plans.map(plan=>
  <div class="bg-base-100 shadow-xl my-2 p-4 grid gap-2 grid-cols-2">
    <p class="font-bold text-lg">{plan.Plan_MVP_name}</p>
    <p class="text-lg">{plan.Plan_startDate} to {plan.Plan_endDate}</p>
  </div>
)


const ShowApp = () => {
  const params = useParams()

  return (
    <>
      <div className="flex border-b-4 py-8 px-6 items-center	">
        <h1 className='font-bold text-3xl'>Application: {params.app_Acronym}</h1>
        <button className="btn btn-primary mx-4">Edit App</button>
      </div>
      <div className="m-6">
        <div className="flex items-center	">
          <h2 className="font-bold text-2xl">Plans</h2>
          <button className="btn btn-primary mx-2">Create Plan</button>
        </div>
        <div className='my-2 p-6 w-9/12 border rounded-md w-4/12'>
          {plansList}
        </div>
        <h2 className="font-bold text-2xl">Tasks</h2>
        <div className='my-2 p-6 w-9/12 border rounded-md'>
        </div>
      </div>
    </>
  );
};

export default ShowApp;