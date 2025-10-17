/* src/types.ts */

export type TaskPriority = 'baixa' | 'media' | 'alta';
export type TaskStatus = 'pendente' | 'concluida';

// 1. NOVO TIPO PARA ORDENAÇÃO
export type SortCriteria = 
  'criacao-recente' | 
  'criacao-antiga' | 
  'prioridade-alta' | 
  'vencimento-proximo';

export interface Task {
  id: string;
  title: string;
  description: string;
  status: TaskStatus;
  priority: TaskPriority;
  tags: string[];
  createdAt: string;
  dueDate?: string; // Este campo já deve existir da Etapa 1
}

export type NewTaskData = Omit<Task, 'id' | 'status' | 'createdAt'>;