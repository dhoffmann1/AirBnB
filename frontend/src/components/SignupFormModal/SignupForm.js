import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Redirect } from "react-router-dom";
import * as sessionActions from "../../store/session";
import './SignupForm.css';

function SignupFormPage({ setShowSignupModal }) {
  const dispatch = useDispatch();
  const sessionUser = useSelector((state) => state.session.user);
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [errors, setErrors] = useState([]);

  if (sessionUser) return <Redirect to="/" />;

  const handleSubmit = (e) => {
    e.preventDefault();
    if (password === confirmPassword) {
      setErrors([]);
      return dispatch(sessionActions.signup({ firstName, lastName, email, username, password }))
        .then(() => setShowSignupModal(false))
        .catch(async (res) => {
          const data = await res.json();
          if (data && data.errors) setErrors(data.errors);
        });
    }
    return setErrors(['Confirm Password field must be the same as the Password field']);
  };

  return (
    <form id='signup-form' onSubmit={handleSubmit}>
      <ul className='error-messages-handling'>
        {errors.map((error, idx) => <li key={idx}>{error}</li>)}
      </ul>
      <div id='welcome-title-signup'>Welcome to Airbnb-Prime</div>
      {/* <div style={{paddingLeft: '10px', paddingTop: '5px'}}>Signup</div> */}
      <br />
      <div id='form-input-fields-div-signup'>
        <label>
          {/* First Name */}
          <input
            type="text"
            value={firstName}
            onChange={(e) => setFirstName(e.target.value)}
            required
            placeholder="First Name"
            className="label-input-fields-signup"
          />
        </label>
        <label>
          {/* Last Name */}
          <input
            type="text"
            value={lastName}
            onChange={(e) => setLastName(e.target.value)}
            required
            placeholder="Last Name"
            className="label-input-fields-signup"
          />
        </label>
        <label>
          {/* Email */}
          <input
            type="text"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            placeholder="Email"
            className="label-input-fields-signup"
          />
        </label>
        <label>
          {/* Username */}
          <input
            type="text"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            required
            placeholder="Username"
            className="label-input-fields-signup"
          />
        </label>
        <label>
          {/* Password */}
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            placeholder="Password"
            className="label-input-fields-signup"
          />
        </label>
        <label>
          {/* Confirm Password */}
          <input
            type="password"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            required
            placeholder="Confirm Password"
            className="label-input-fields-signup"
          />
        </label>
      </div>
      <br />
      <div id='signup-buttons-div'>
        <button id='signup-submit-button' type="submit">Sign Up</button>
      </div>
    </form>
  );
}

export default SignupFormPage;
