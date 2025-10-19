// src/types.ts

export type TaskPriority = 'baixa' | 'media' | 'alta';
export type TaskStatus = 'pendente' | 'concluida';

export type SortCriteria = 
  'criacao-recente' | 
  'criacao-antiga' | 
  'prioridade-alta' | 
  'vencimento-proximo';

// Tipo para uma subtarefa individual
export interface Subtask {
  id: string;
  title: string;
  status: TaskStatus;
}

// Interface principal da Tarefa, agora com subtarefas
export interface Task {
  id: string;
  title: string;
  description: string;
  status: TaskStatus;
  priority: TaskPriority;
  tags: string[];
  createdAt: string;
  dueDate?: string;
  subtasks?: Subtask[]; // Array opcional de subtarefas
}

export type NewTaskData = Omit<Task, 'id' | 'status' | 'createdAt'>;