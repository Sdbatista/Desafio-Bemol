// src/components/SubtaskItem.tsx

import type { Subtask } from '../types';
import styles from './SubtaskItem.module.css';
import { FaTrash, FaCheckCircle, FaRegCircle } from 'react-icons/fa';

interface SubtaskItemProps {
  subtask: Subtask;
  onToggle: () => void;
  onRemove: () => void;
}

export function SubtaskItem({ subtask, onToggle, onRemove }: SubtaskItemProps) {
  const isCompleted = subtask.status === 'concluida';
  const itemClasses = `${styles.subtaskItem} ${isCompleted ? styles.completed : ''}`;

  return (
    <div className={itemClasses}>
      <button onClick={onToggle} className={styles.statusButton} aria-label={`Marcar subtarefa '${subtask.title}' como ${isCompleted ? 'pendente' : 'concluída'}`}>
        {isCompleted ? <FaCheckCircle /> : <FaRegCircle />}
      </button>
      <span className={styles.title}>{subtask.title}</span>
      <button onClick={onRemove} className={styles.removeButton} aria-label={`Remover subtarefa '${subtask.title}'`}>
        <FaTrash />
      </button>
    </div>
  );
}