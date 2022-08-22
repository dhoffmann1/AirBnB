import React, { useState } from 'react';
import { Modal } from '../../context/Modal';
import SignupForm from './SignupForm';

function SignupFormModal({ setShowSignupModal }) {
  // const [showModal, setShowModal] = useState(false);

  return (
    <>
      {/* <div id="signup-button" onClick={() => setShowModal(true)}>Log in</div> */}
      <Modal onClose={() => setShowSignupModal(false)}>
        <SignupForm setShowSignupModal={setShowSignupModal}/>
      </Modal>
    </>
  );
}

export default SignupFormModal;
