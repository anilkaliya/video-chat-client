// Modal.tsx

import React, { FC, ReactNode } from 'react';
import ReactDOM from 'react-dom';
import '../styles/modal.css';

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  title:string;
 children: ReactNode; 

}

const Modal: FC<ModalProps> = ({ isOpen, onClose,children }) => {
  if (!isOpen) return null;

  return ReactDOM.createPortal(
    <div className="modal-overlay">
      <div className="modal-content">
        {children}
      </div>
    </div>,
    document.getElementById('modal-root')!
  );
};

export default Modal;
