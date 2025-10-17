// src/components/TodoItem.tsx (FINAL - Com Data de Vencimento)

import { useState } from 'react';
import type { Task } from '../types';
import styles from './TodoItem.module.css';
// 1. IMPORTAR O ÍCONE DE CALENDÁRIO
import { 
  FaTrash, FaEdit, FaCheck, FaSave, FaTimes, FaCalendarAlt 
} from 'react-icons/fa';

type UpdateTaskFn = (id: string, updates: Partial<Omit<Task, 'id' | 'createdAt'>>) => void;

interface TodoItemProps {
  task: Task;
  onRemove: (id: string) => void;
  onToggleStatus: (id: string) => void;
  onUpdate: UpdateTaskFn;
}

// 2. FUNÇÃO AJUDANTE PARA FORMATAR A DATA (Fora do componente)
const formatDueDate = (dateString: string) => {
  const [year, month, day] = dateString.split('-').map(Number);
  const date = new Date(year, month - 1, day); 
  return date.toLocaleDateString(undefined, {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
    timeZone: 'UTC', // Garante que a data seja tratada como inserida
  });
};


export function TodoItem({ task, onRemove, onToggleStatus, onUpdate }: TodoItemProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [editTitle, setEditTitle] = useState(task.title);
  const [editDescription, setEditDescription] = useState(task.description);

  // Agora, 'tag' é a primeira da lista, se houver
  const tag = task.tags[0] || 'Geral'; 
  const cardClasses = `${styles.card} ${task.status === 'concluida' ? styles.completed : ''}`;
  
  // (Funções de cor, salvar, cancelar e acessibilidade - completas)
  const getPriorityColor = () => {
    switch (task.priority) {
      case 'alta': return 'var(--color-icon-delete)';
      case 'media': return 'var(--color-icon-edit)';
      case 'baixa': return 'var(--color-icon-save)';
      default: return 'var(--color-border)';
    }
  };
  const cardStyle = { borderTop: `4px solid ${getPriorityColor()}` };

  const handleSave = () => {
    if (editTitle.trim()) {
      onUpdate(task.id, { title: editTitle, description: editDescription });
      setIsEditing(false);
    } else {
      alert('O título não pode ficar vazio.');
    }
  };

  const handleCancel = () => {
    setIsEditing(false);
    setEditTitle(task.title);
    setEditDescription(task.description);
  };

  const toggleStatusTitle = task.status === 'pendente' 
    ? `Marcar tarefa '${task.title}' como concluída`
    : `Marcar tarefa '${task.title}' como pendente`;
  const editButtonTitle = `Editar tarefa '${task.title}'`;
  const removeTitle = `Remover tarefa '${task.title}'`;
  const saveTitle = `Salvar alterações da tarefa '${task.title}'`;
  const cancelTitle = `Cancelar edição da tarefa '${task.title}'`;

  return (
    <div className={cardClasses} style={cardStyle}>
      
      {isEditing ? (
        <div className={styles.cardContent}>
          <input type="text" value={editTitle} onChange={(e) => setEditTitle(e.target.value)} className={styles.editInput} aria-label={`Editar título...`} />
          <textarea value={editDescription} onChange={(e) => setEditDescription(e.target.value)} className={styles.editInput} aria-label={`Editar descrição...`} />
        </div>
      ) : (
        <div className={styles.cardContent}>
          {/* 3. Mostrar a tag (ou tags, se quiser fazer um map) */}
          <span className={styles.tag}>{tag}</span>
          <h3 className={styles.title}>{task.title}</h3>
          <p className={styles.description}>{task.description}</p>
        </div>
      )}

      {/* --- 4. EXIBIR A DATA DE VENCIMENTO --- */}
      {task.dueDate && !isEditing && (
        <div className={styles.dueDateContainer}>
          <FaCalendarAlt />
          <span>Vencimento: {formatDueDate(task.dueDate)}</span>
        </div>
      )}
      {/* --- FIM DA MUDANÇA --- */}


      {/* Rodapé com Ações */}
      <div className={styles.cardActions}>
        {isEditing ? (
          <>
            <button className={`${styles.iconButton} ${styles.cancelBtn}`} onClick={handleCancel} title={cancelTitle} aria-label={cancelTitle}> <FaTimes /> </button>
            <button className={`${styles.iconButton} ${styles.saveBtn}`} onClick={handleSave} title={saveTitle} aria-label={saveTitle}> <FaSave /> </button>
          </>
        ) : (
          <>
            <button className={`${styles.iconButton} ${styles.editBtn}`} title={editButtonTitle} aria-label={editButtonTitle} onClick={() => setIsEditing(true)}> <FaEdit /> </button>
            <button className={`${styles.iconButton} ${styles.toggleBtn}`} onClick={() => onToggleStatus(task.id)} title={toggleStatusTitle} aria-label={toggleStatusTitle}> <FaCheck /> </button>
            <button className={`${styles.iconButton} ${styles.deleteBtn}`} onClick={() => onRemove(task.id)} title={removeTitle} aria-label={removeTitle}> <FaTrash /> </button>
          </>
        )}
      </div>
    </div>
  );
}