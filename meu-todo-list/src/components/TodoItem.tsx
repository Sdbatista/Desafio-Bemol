// src/components/TodoItem.tsx

import React, { useState } from 'react';
import type { Task } from '../types';
import styles from './TodoItem.module.css';
import { 
  FaTrash, FaEdit, FaCheck, FaSave, FaTimes, FaCalendarAlt, FaPlus 
} from 'react-icons/fa';
import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { SubtaskItem } from './SubtaskItem';

type UpdateTaskFn = (id: string, updates: Partial<Omit<Task, 'id' | 'createdAt'>>) => void;

interface TodoItemProps {
  task: Task;
  onRemove: (id: string) => void;
  onToggleStatus: (id: string) => void;
  onUpdate: UpdateTaskFn;
  onAddSubtask: (parentId: string, title: string) => void;
  onRemoveSubtask: (parentId: string, subtaskId: string) => void;
  onToggleSubtaskStatus: (parentId: string, subtaskId: string) => void;
}

const formatDueDate = (dateString: string) => {
  const [year, month, day] = dateString.split('-').map(Number);
  const date = new Date(year, month - 1, day); 
  return date.toLocaleDateString(undefined, {
    day: '2-digit', month: '2-digit', year: 'numeric', timeZone: 'UTC',
  });
};

export function TodoItem({ 
  task, onRemove, onToggleStatus, onUpdate,
  onAddSubtask, onRemoveSubtask, onToggleSubtaskStatus 
}: TodoItemProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [editTitle, setEditTitle] = useState(task.title);
  const [editDescription, setEditDescription] = useState(task.description);
  const [newSubtaskTitle, setNewSubtaskTitle] = useState('');

  const {
    attributes, listeners, setNodeRef, transform, transition, isDragging
  } = useSortable({ id: task.id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1,
  };
  
  const tag = task.tags[0] || 'Geral'; 
  const cardClasses = `${styles.card} ${task.status === 'concluida' ? styles.completed : ''}`;
  
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
    }
  };

  const handleCancel = () => {
    setIsEditing(false);
    setEditTitle(task.title);
    setEditDescription(task.description);
  };

  const handleAddSubtask = (e: React.FormEvent) => {
    e.preventDefault();
    onAddSubtask(task.id, newSubtaskTitle);
    setNewSubtaskTitle('');
  };

  const subtasksProgress = task.subtasks && task.subtasks.length > 0
    ? (task.subtasks.filter(st => st.status === 'concluida').length / task.subtasks.length) * 100
    : 0;
  
  const toggleStatusTitle = `Marcar tarefa '${task.title}' como ${task.status === 'pendente' ? 'concluída' : 'pendente'}`;

  // ** A MUDANÇA ESTÁ AQUI **
  // Os 'listeners' agora vão para uma div interna (o "puxador"), e não para a div principal.
  return (
    <div ref={setNodeRef} style={style} {...attributes} className={cardClasses}>
      <div style={cardStyle}>

        {/* --- INÍCIO DA ÁREA DE ARRASTAR (DRAG HANDLE) --- */}
        <div className={styles.dragHandle} {...listeners}>
          {isEditing ? (
            <div className={styles.cardContent}>
              <input type="text" value={editTitle} onChange={(e) => setEditTitle(e.target.value)} className={styles.editInput} aria-label="Editar título"/>
              <textarea value={editDescription} onChange={(e) => setEditDescription(e.target.value)} className={styles.editInput} aria-label="Editar descrição"/>
            </div>
          ) : (
            <div className={styles.cardContent}>
              <span className={styles.tag}>{tag}</span>
              <h3 className={styles.title}>{task.title}</h3>
              <p className={styles.description}>{task.description}</p>
            </div>
          )}

          {task.dueDate && !isEditing && (
            <div className={styles.dueDateContainer}>
              <FaCalendarAlt />
              <span>Vencimento: {formatDueDate(task.dueDate)}</span>
            </div>
          )}
        </div>
        {/* --- FIM DA ÁREA DE ARRASTAR --- */}


        {/* --- INÍCIO DA ÁREA INTERATIVA (NÃO ARRASTÁVEL) --- */}
        <div className={styles.interactiveSection}>
          <div className={styles.subtaskSection}>
            {task.subtasks && task.subtasks.length > 0 && (
              <div className={styles.progressContainer}>
                <span className={styles.progressLabel}>Subtarefas</span>
                <div className={styles.progressBar}><div style={{ width: `${subtasksProgress}%` }}></div></div>
              </div>
            )}
            <div className={styles.subtaskList}>
              {task.subtasks?.map(sub => (
                <SubtaskItem 
                  key={sub.id} 
                  subtask={sub} 
                  onToggle={() => onToggleSubtaskStatus(task.id, sub.id)}
                  onRemove={() => onRemoveSubtask(task.id, sub.id)}
                />
              ))}
            </div>
            <form onSubmit={handleAddSubtask} className={styles.addSubtaskForm}>
              <input 
                type="text" 
                value={newSubtaskTitle}
                onChange={(e) => setNewSubtaskTitle(e.target.value)}
                placeholder="Adicionar subtarefa..."
              />
              <button type="submit" aria-label="Adicionar subtarefa"><FaPlus/></button>
            </form>
          </div>

          <div className={styles.cardActions}>
            {isEditing ? (
              <>
                <button className={`${styles.iconButton} ${styles.cancelBtn}`} onClick={handleCancel} title="Cancelar edição"> <FaTimes /> </button>
                <button className={`${styles.iconButton} ${styles.saveBtn}`} onClick={handleSave} title="Salvar alterações"> <FaSave /> </button>
              </>
            ) : (
              <>
                <button className={`${styles.iconButton} ${styles.editBtn}`} onClick={() => setIsEditing(true)} title="Editar tarefa"> <FaEdit /> </button>
                <button className={`${styles.iconButton} ${styles.toggleBtn}`} onClick={() => onToggleStatus(task.id)} title={toggleStatusTitle}> <FaCheck /> </button>
                <button className={`${styles.iconButton} ${styles.deleteBtn}`} onClick={() => onRemove(task.id)} title="Remover tarefa"> <FaTrash /> </button>
              </>
            )}
          </div>
        </div>
        {/* --- FIM DA ÁREA INTERATIVA --- */}
      </div>
    </div>
  );
}