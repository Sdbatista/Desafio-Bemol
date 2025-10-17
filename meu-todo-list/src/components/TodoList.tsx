// src/components/TodoList.tsx

import type { Task } from '../types';
import { TodoItem } from './TodoItem';
import styles from './TodoList.module.css';

// 1. Defina o tipo para a função 'onUpdate'
type UpdateTaskFn = (id: string, updates: Partial<Omit<Task, 'id' | 'createdAt'>>) => void;

// Propriedades que a Lista recebe
interface TodoListProps {
  tasks: Task[];
  onRemove: (id: string) => void;
  onToggleStatus: (id: string) => void;
  onUpdate: UpdateTaskFn; // <--- 2. ADICIONE A PROP AQUI
}

export function TodoList({ tasks, onRemove, onToggleStatus, onUpdate }: TodoListProps) {
  
  // Feedback visual para lista vazia (Requisito Funcional)
  if (tasks.length === 0) {
    return (
      <div className={styles.emptyState}>
        <h3>Nenhuma tarefa encontrada.</h3>
        <p>Clique em "Create Task" para adicionar sua primeira tarefa!</p>
      </div>
    );
  }

  return (
    <div className={styles.grid}>
      {tasks.map((task) => (
        <TodoItem
          key={task.id} // Chave é essencial para o React
          task={task}
          onRemove={onRemove}
          onToggleStatus={onToggleStatus}
          onUpdate={onUpdate} // <--- 3. PASSE A FUNÇÃO PARA O ITEM
        />
      ))}
    </div>
  );
}