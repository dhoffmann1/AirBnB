import React from 'react';
import { Modal } from '../../context/Modal';
import LoginForm from './LoginForm';

function LoginFormModal({ setShowLoginModal }) {
  // const [showModal, setShowModal] = useState(false);

  return (
    <>
      {/* <div id="login-button" onClick={() => setShowModal(true)}>Log in</div> */}
      <Modal onClose={() => setShowLoginModal(false)}>
        <LoginForm setShowLoginModal={setShowLoginModal} />
      </Modal>
    </>
  );
}

export default LoginFormModal;
