// features/Modal.jsx
import React from 'react';
import ReactDOM from 'react-dom';
import styles from './Modal.module.css';

const Modal = ({ active, setActive, children }) => {
  if (!active) return null;

  return ReactDOM.createPortal(
    <div className={`${styles.modalOverlay} ${active ? styles.active : ''}`} onClick={() => setActive(false)}>
      <div className={styles.modalContent} onClick={(e) => e.stopPropagation()}>
        {children}
      </div>
    </div>,
    document.getElementById('modal-root')
  );
};

export default Modal;
