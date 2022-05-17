<div className=' my-2 p-6 w-9/12 border rounded-md'>
<h2 className='font-bold text-lg'>Application: {app_Acronym ? app_Acronym : "please choose an app"}</h2>
<p>{app_Description || ""}</p>

<div class="overflow-x-auto">
  <table class="table w-full">
    {/* <!-- head --> */}
    <thead>
      <tr>
        <th>User</th>
        <th>Group</th>
      </tr>
    </thead>
    <tbody>
      {userGroupsList}
    </tbody>
  </table>
</div>
</div>


