import React from 'react';
import { NavLink } from 'react-router-dom';
import { useSelector } from 'react-redux';
import ProfileButton from './ProfileButton';
import LoginFormModal from '../LoginFormModal';

function MainNavMenu({}){


  return (
    <>
      <LoginFormModal />
      <NavLink to="/signup">Sign Up</NavLink>
    </>
  );
}

export default MainNavMenu;
