import React, { useState } from 'react';
import { NavLink } from 'react-router-dom';
import LoginFormModal from '../LoginFormModal';

function MainNavMenu({}){
  const [showMenu, setShowMenu] = useState(false);

  return (
    <div id="main-nav-menu">
      <button id="main-nav-menu-button" onClick={() => setShowMenu(!showMenu)}>
        <div id="three-bars">
          <i class="fa-solid fa-bars"></i>
        </div>
        <div id="user-image">
          <i class="fa-solid fa-user"></i>
        </div>
      </button>
      {showMenu && (
        <div id='login-signup-wrapper'>
          <div id="login-wrapper">
            <NavLink id="signup-button" to="/signup">Sign up</NavLink>
            <LoginFormModal />
          </div>
        </div>
      )}
    </div>
  );
}

export default MainNavMenu;
