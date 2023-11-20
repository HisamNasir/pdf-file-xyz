import React from 'react';
import Modal from 'react-modal';

Modal.setAppElement('#__next'); 
const CustomModal = ({ isOpen, onRequestClose, children }) => {
  return (
    <Modal
      isOpen={isOpen}
      onRequestClose={onRequestClose}
      className="modal"
      overlayClassName="modal-overlay"
    >
      {children}
    </Modal>
  );
};

export default CustomModal;
