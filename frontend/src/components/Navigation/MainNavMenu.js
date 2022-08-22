import React, { useState, useEffect } from 'react';
// import { NavLink } from 'react-router-dom';
// import LoginFormModal from '../LoginFormModal';
// import SignupFormModal from '../SignupFormModal';

function MainNavMenu({ setShowSignupModal, setShowLoginModal }){
  const [showMenu, setShowMenu] = useState(false);

  const openMenu = () => {
    if (showMenu) return;
    setShowMenu(true);
  };

  useEffect(() => {
    if (!showMenu) return;

    const closeMenu = () => {
      setShowMenu(false);
    };

    document.addEventListener('click', closeMenu);

    return () => document.removeEventListener("click", closeMenu);
  }, [showMenu]);

  return (
    <div id="main-nav-menu">
      <button id="main-nav-menu-button" onClick={openMenu}>
        <div id="three-bars">
          <i class="fa-solid fa-bars"></i>
        </div>
        <div id="user-image">
          <i class="fa-solid fa-user"></i>
        </div>
      </button>
      {showMenu && (
        <div id='login-logout-wrapper'>
          <div id='login-wrapper'>
            <div id='signup-button' onClick={() => setShowSignupModal(true)}>Signup</div>
            <div id='login-button' onClick={() => setShowLoginModal(true)}>Log In</div>
          </div>
        </div>
      )}
    </div>
  );
}

export default MainNavMenu;
