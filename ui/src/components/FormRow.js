import React from 'react';

const FormRow = ({type, name, value, handleChange, labelText, disabled}) => {
  return (
  <div>
    <label className='label label-text w-full max-w-xs'  htmlFor={name}>{labelText || name}</label>
    <input className='input input-bordered input-primary w-full'  type={type} value={value} name={name} onChange={handleChange} disabled={disabled}/>
  </div>
  );
};

export default FormRow;