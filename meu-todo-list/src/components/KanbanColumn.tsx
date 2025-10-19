// src/components/KanbanColumn.tsx

import type { Task } from '../types';
import { useMemo } from 'react'; // <-- Importar o useMemo
import { useDroppable } from '@dnd-kit/core';
import { SortableContext, verticalListSortingStrategy } from '@dnd-kit/sortable';
import { TodoItem } from './TodoItem';
import styles from './KanbanColumn.module.css';

interface KanbanColumnProps {
  id: string;
  title: string;
  tasks: Task[];
  onRemove: (id: string) => void;
  onToggleStatus: (id: string) => void;
  onUpdate: (id: string, updates: Partial<Omit<Task, 'id' | 'createdAt'>>) => void;
  onAddSubtask: (parentId: string, title: string) => void;
  onRemoveSubtask: (parentId: string, subtaskId: string) => void;
  onToggleSubtaskStatus: (parentId: string, subtaskId: string) => void;
}

export function KanbanColumn({ id, title, tasks, ...itemProps }: KanbanColumnProps) {
  const { setNodeRef } = useDroppable({ id });

  // ** A CORREÇÃO ESTÁ AQUI **
  // Criamos uma lista memorizada apenas com os IDs das tarefas desta coluna
  const taskIds = useMemo(() => tasks.map(t => t.id), [tasks]);

  return (
    <div ref={setNodeRef} className={styles.column}>
      <h3 className={styles.title}>{title} ({tasks.length})</h3>
      {/* Usamos a lista de IDs no SortableContext */}
      <SortableContext items={taskIds} strategy={verticalListSortingStrategy}>
        <div className={styles.taskList}>
          {tasks.map(task => (
            <TodoItem key={task.id} task={task} {...itemProps} />
          ))}
           {tasks.length === 0 && (
            <div className={styles.emptyColumn}>
              Arraste tarefas para cá
            </div>
          )}
        </div>
      </SortableContext>
    </div>
  );
}