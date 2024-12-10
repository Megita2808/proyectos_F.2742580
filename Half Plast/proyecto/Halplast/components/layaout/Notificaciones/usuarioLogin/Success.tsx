import React from 'react';
import styles from '../../../../styles/notificacion.module.css';

interface NotificationProps {
  type: 'success' | 'error';
  message: string;
  onClose: () => void;
}

const Notification: React.FC<NotificationProps> = ({ type, message, onClose }) => {
  return (
    <div className={`${styles.notification} ${styles[type]}`}>
      <span>{message}</span>
      <button className={styles.closeButton} onClick={onClose}>×</button>
    </div>
  );
};

export default Notification;
