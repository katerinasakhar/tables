import React from 'react';
import ReactDOM from 'react-dom';
import styles from './Modal.module.css';

const Modal = ({ active, setActive, children }) => {
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
