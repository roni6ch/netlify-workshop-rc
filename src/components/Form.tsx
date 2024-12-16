import React from 'react';

const Form = () => {
  return (
    <div className="container">
      <form>
        {/* Account Section */}
        <div className="row">
          <h4>Fill your company details</h4>

          <div className="input-group input-group-icon">
            <input type="text" placeholder="Full Name" />
            <div className="input-icon">
              <i className="fa fa-user"></i>
            </div>
          </div>

          <div className="input-group input-group-icon">
            <input type="email" placeholder="Email Address" />
            <div className="input-icon">
              <i className="fa fa-envelope"></i>
            </div>
          </div>

          <div className="input-group input-group-icon">
            <input type="password" placeholder="Password" />
            <div className="input-icon">
              <i className="fa fa-key"></i>
            </div>
          </div>
        </div>

        {/* Date of Birth and Gender Section */}
        <div className="row">
          <div className="col-half">
            <h4>Date of Birth</h4>
            <div className="input-group">
              <div className="col-third">
                <input type="text" placeholder="DD" />
              </div>
              <div className="col-third">
                <input type="text" placeholder="MM" />
              </div>
              <div className="col-third">
                <input type="text" placeholder="YYYY" />
              </div>
            </div>
          </div>

          <div className="col-half">
            <h4>Gender</h4>
            <div className="input-group">
              <input id="gender-male" type="radio" name="gender" value="male" />
              <label htmlFor="gender-male">Male</label>

              <input id="gender-female" type="radio" name="gender" value="female" />
              <label htmlFor="gender-female">Female</label>
            </div>
          </div>
        </div>

        <div className="row">
          <h4>Company size</h4>
          <div className="col-half">
            <div className="input-group">
              <select>
                <option>10 - 20</option>
                <option>20 - 100</option>
              </select>
            </div>
          </div>
        </div>

        <div className="row">
          <h4>Terms and Conditions</h4>
          <div className="input-group">
            <input id="terms" type="checkbox" />
            <label htmlFor="terms">
              I accept the terms and conditions for signing up to this service, and hereby
              confirm I have read the privacy policy.
            </label>
          </div>
        </div>
      </form>
    </div>
  );
};

export default Form;