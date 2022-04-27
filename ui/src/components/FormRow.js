import React from 'react';

const FormRow = ({type, name, value, handleChange, labelText}) => {
  return (
  <div>
    <label className='label label-text w-full max-w-xs'  htmlFor={name}>{labelText || name}</label>
    <input className='input input-bordered input-primary w-full max-w-xs'  type={type} value={value} name={name} onChange={handleChange}/>
  </div>
  );
};

export default FormRow;