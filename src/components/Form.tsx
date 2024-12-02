import React from 'react';
function Form() {
  return (
    <div className='form-container'>
      <div className="content-section-title">Company Details</div>
      <div className='form'>
        <input type="text" placeholder="First name" />
        <input type="text" placeholder="Last name" />
        <input type="text" placeholder="Company name" />
        <input type="text" placeholder="Company size" />
      </div>
    </div>
  );
}

export default Form;