import React from 'react';
import styles from './Modal.module.css';


const Modal = ({ active, setActive, children }) => {
  return (
    <div className={`${styles.modalOverlay} ${active ? styles.active : ''}`} onClick={() => setActive(false)}>
      <div className={styles.modalContent} onClick={e => e.stopPropagation()}>
        {children}
      </div>
    </div>
  );
};

export default Modal;