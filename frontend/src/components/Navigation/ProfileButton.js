import React, { useState, useEffect } from "react";
import { useDispatch } from 'react-redux';
import { useHistory } from 'react-router-dom';
import * as sessionActions from '../../store/session';
import './Navigation.css'

function ProfileButton({ user }) {
  const dispatch = useDispatch();
  const [showMenu, setShowMenu] = useState(false);
  const history = useHistory();

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

  const logout = (e) => {
    e.preventDefault();
    dispatch(sessionActions.logout());
    history.push('/');
  };

  return (
    <div id="main-logged-in-menu">
      <button id="main-logged-in-menu-button" onClick={openMenu}>
        <div id="three-bars">
          <i class="fa-solid fa-bars"></i>
        </div>
        <div id="user-image">
          {/* <i class="fa-solid fa-user"></i> */}
          <i class="fa-solid fa-user-check"></i>
          {/* <i class="fa-solid fa-user-astronaut"></i> */}
        </div>
      </button>
        {showMenu && (
          <div id='login-logout-wrapper'>
            <div id='logout-wrapper'>
              <div id='logout-button' onClick={logout}>Log Out</div>
            </div>
          </div>
        )}
    </div>
  );
}

export default ProfileButton;
