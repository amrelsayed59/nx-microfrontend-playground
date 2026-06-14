import { ReactNode, useEffect } from 'react';
import styles from './modal.module.scss';

export interface ModalProps {
  title: string;
  onClose: () => void;
  children: ReactNode;
}

/**
 * Generic, framework-agnostic modal. Lives in `shared/` because it carries no
 * product-domain knowledge and is reusable by any feature in this remote.
 */
export function Modal({ title, onClose, children }: ModalProps) {
  useEffect(() => {
    function onKeyDown(event: KeyboardEvent): void {
      if (event.key === 'Escape') {
        onClose();
      }
    }
    document.addEventListener('keydown', onKeyDown);
    return () => document.removeEventListener('keydown', onKeyDown);
  }, [onClose]);

  return (
    <div
      className={styles['overlay']}
      role="dialog"
      aria-modal="true"
      aria-label={title}
      onClick={onClose}
    >
      <div
        className={styles['panel']}
        onClick={(event) => event.stopPropagation()}
      >
        <header className={styles['header']}>
          <h2 className={styles['title']}>{title}</h2>
          <button
            type="button"
            className={styles['close']}
            onClick={onClose}
            aria-label="Close dialog"
          >
            <svg
              width="18"
              height="18"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              aria-hidden="true"
            >
              <path d="M18 6 6 18" />
              <path d="m6 6 12 12" />
            </svg>
          </button>
        </header>
        <div className={styles['body']}>{children}</div>
      </div>
    </div>
  );
}

export default Modal;
