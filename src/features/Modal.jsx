import React from 'react';
import ReactDOM from 'react-dom';
import styles from './Modal.module.css';
import { FiX } from 'react-icons/fi'


const Modal = ({ active, setActive, children }) => {
      const modalRoot = document.getElementById('modal-root'); 
  if (!active) return null;
  if (document.getElementById('modal-root')?.contains(document.activeElement)) {
  console.warn('Avoid nesting <Modal> inside <Modal>');
}


  return ReactDOM.createPortal(
    <div className={`${styles.modalOverlay} ${styles.active}`} onClick={() => setActive(false)}>
      <div className={styles.modalContent} onClick={(e) => e.stopPropagation()}>
        {children}
      </div>
    </div>,
    document.getElementById('modal-root')
  );
};

export default Modal;
