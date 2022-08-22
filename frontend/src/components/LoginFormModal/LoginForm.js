import React, { useState } from "react";
import * as sessionActions from "../../store/session";
import { useDispatch } from "react-redux";
import './LoginForm.css'

function LoginForm() {
  const dispatch = useDispatch();
  const [credential, setCredential] = useState("");
  const [password, setPassword] = useState("");
  const [errors, setErrors] = useState([]);

  const handleSubmit = (e) => {
    e.preventDefault();
    setErrors([]);
    return dispatch(sessionActions.login({ credential, password })).catch(
      async (res) => {
        const data = await res.json();
        if (data && data.errors) setErrors(data.errors);
      }
    );
  };

  return (
    <form onSubmit={handleSubmit}>
      <ul>
        {errors.map((error, idx) => (
          <li key={idx}>{error}</li>
        ))}
      </ul>
      <div id='welcome-title'>Welcome to Airbnb-Prime</div>
      <br />
      <div id='form-input-fields-div'>
        <label>
          {/* {'Username or Email '} */}
          <input
            type="text"
            value={credential}
            onChange={(e) => setCredential(e.target.value)}
            required
            placeholder="Username or Email"
            className="label-input-fields"
          />
        </label>
        {/* <br /> */}
        <label>
        {/* {'Password '} */}
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            placeholder="Password"
            className="label-input-fields"
          />
        </label>
      </div>
      <br />
      <div id='login-buttons-div'>
        <button className="login-submit-buttons" type="submit">Log In</button>
        <br />
        <span>or</span>
        <br />
        <button className="login-submit-buttons" type="submit" onClick={(e) => {
          setCredential('Demo-lition')
          setPassword('password')
        }}>Log In as Demo User</button>
      </div>
    </form>
  );
}

export default LoginForm;
