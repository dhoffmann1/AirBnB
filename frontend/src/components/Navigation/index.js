import React from 'react';
import { NavLink } from 'react-router-dom';
import { useSelector } from 'react-redux';
import ProfileButton from './ProfileButton';
// import LoginFormModal from '../LoginFormModal';
// import AirbnbLogo from './images/Airbnb_Logo.png';
import customLogo from './images/custom-logo.png';
import MainNavMenu from './MainNavMenu';
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
      <MainNavMenu />
    );
  }

  return (
    <header>
      <nav>
        <NavLink exact to="/">
          <img id="logo" src={customLogo} alt="airbnb-logo" />
        </NavLink>
        {isLoaded && sessionLinks}
      </nav>
    </header>
  );
}

export default Navigation;
