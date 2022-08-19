import React from 'react';
import { NavLink } from 'react-router-dom';
import { useSelector } from 'react-redux';
import ProfileButton from './ProfileButton';
import LoginFormModal from '../LoginFormModal';
import AirbnbLogo from './images/Airbnb_Logo.png'
import customLogo from './images/custom-logo.png'
import './Navigation.css';

function Navigation({ isLoaded }){
  const sessionUser = useSelector(state => state.session.user);

  let sessionLinks;
  if (sessionUser) {
    sessionLinks = (
      <ProfileButton user={sessionUser} />
    );
  } else {
    sessionLinks = (
      <>
        <LoginFormModal />
        <NavLink to="/signup">Sign Up</NavLink>
      </>
    );
  }

  return (
    <nav>
      {/* <li> */}
        {/* <NavLink exact to="/">Home</NavLink> */}
        <NavLink exact to="/">
          <img className="logo" src={customLogo} alt="airbnb-logo" />
        </NavLink>

        {isLoaded && sessionLinks}
      {/* </li> */}
    </nav>
  );
}

export default Navigation;
