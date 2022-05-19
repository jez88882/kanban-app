import React from 'react';

const FormRow = ({type, name, value, handleChange, labelText, disabled, placeholder, labelClasses, inputClasses}) => {
  return (
  <div>
    <label className={`label label-text w-full max-w-xs ${labelClasses}`}  htmlFor={name}>{labelText || name}</label>
    <input className={`input input-bordered input-primary w-full ${inputClasses}`}  type={type} value={value} name={name} onChange={handleChange} disabled={disabled} placeholder={placeholder}/>
  </div>
  );
};

export default FormRow;