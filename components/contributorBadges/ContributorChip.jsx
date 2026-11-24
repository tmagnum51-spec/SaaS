'use client';

import styles from './ContributorChip.module.css';

export default function ContributorChip({
  name,
  onRemove,
  disabled = false,
}) {
  const displayName = name?.trim() || 'Membre';

  return (
    <span className={styles.chip}>
      <span>{displayName}</span>
      {onRemove && (
        <button
          type="button"
          className={styles.removeBtn}
          onClick={onRemove}
          disabled={disabled}
          aria-label={`Retirer ${displayName}`}
        >
          ×
        </button>
      )}
    </span>
  );
}