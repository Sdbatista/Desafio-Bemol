// src/components/TodoList.tsx

import type { Task } from '../types';
import { useMemo } from 'react'; // <-- Importar o useMemo
import { TodoItem } from './TodoItem';
import styles from './TodoList.module.css';
import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  type DragEndEvent
} from '@dnd-kit/core';
import {
  arrayMove,
  SortableContext,
  sortableKeyboardCoordinates,
  verticalListSortingStrategy,
} from '@dnd-kit/sortable';

type UpdateTaskFn = (id: string, updates: Partial<Omit<Task, 'id' | 'createdAt'>>) => void;

interface TodoListProps {
  tasks: Task[];
  setTasks: (tasks: Task[]) => void;
  onRemove: (id: string) => void;
  onToggleStatus: (id: string) => void;
  onUpdate: UpdateTaskFn;
  onAddSubtask: (parentId: string, title: string) => void;
  onRemoveSubtask: (parentId: string, subtaskId: string) => void;
  onToggleSubtaskStatus: (parentId: string, subtaskId: string) => void;
}

export function TodoList({ tasks, setTasks, ...itemProps }: TodoListProps) {
  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  // ** A CORREÇÃO ESTÁ AQUI **
  // Criamos uma lista memorizada apenas com os IDs das tarefas
  const taskIds = useMemo(() => tasks.map(task => task.id), [tasks]);

  function handleDragEnd(event: DragEndEvent) {
    const { active, over } = event;
    if (over && active.id !== over.id) {
      const oldIndex = tasks.findIndex((task) => task.id === active.id);
      const newIndex = tasks.findIndex((task) => task.id === over.id);
      setTasks(arrayMove(tasks, oldIndex, newIndex));
    }
  }

  if (tasks.length === 0) {
    return (
      <div className={styles.emptyState}>
        <h3>Nenhuma tarefa encontrada.</h3>
        <p>Use os filtros ou crie uma nova tarefa!</p>
      </div>
    );
  }

  return (
    <DndContext
      sensors={sensors}
      collisionDetection={closestCenter}
      onDragEnd={handleDragEnd}
    >
      {/* Usamos a lista de IDs no SortableContext */}
      <SortableContext items={taskIds} strategy={verticalListSortingStrategy}>
        <div className={styles.grid}>
          {tasks.map((task) => (
            <TodoItem
              key={task.id}
              task={task}
              {...itemProps}
            />
          ))}
        </div>
      </SortableContext>
    </DndContext>
  );
}