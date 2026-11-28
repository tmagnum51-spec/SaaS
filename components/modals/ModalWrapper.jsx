'use client';

import { useEffect } from 'react';
import styles from './ModalWrapper.module.css';

export default function ModalWrapper({
  isOpen,
  onClose,
  title,
  size = 'md',
  className = '',
  children,
}) {
  useEffect(() => {
    if (!isOpen) return;

    const handleKeyDown = (e) => {
      if (e.key === 'Escape') {
        onClose();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return (
    <div className={styles.backdrop} onClick={onClose}>
      <div
        className={`${styles.modalCard} ${size === 'lg' ? styles.modalLg : ''} ${className}`}
        onClick={(e) => e.stopPropagation()}
        role="dialog"
        aria-modal="true"
      >
        <button
          type="button"
          className={styles.closeButton}
          onClick={onClose}
          aria-label="Fermer"
        >
          ✕
        </button>

        {title && <h2 className={styles.modalTitle}>{title}</h2>}

        <div className={styles.modalBody}>{children}</div>
      </div>
    </div>
  );
}