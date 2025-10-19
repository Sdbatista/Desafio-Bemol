// src/components/KanbanBoard.tsx

import { useState, useMemo } from 'react';
import type { Task, TaskStatus } from '../types';
import { KanbanColumn } from './KanbanColumn';
import { TodoItem } from './TodoItem';
import { 
  DndContext, 
  type DragEndEvent, 
  type DragStartEvent,
  DragOverlay,
  PointerSensor,
  KeyboardSensor,
  useSensor,
  useSensors,
} from '@dnd-kit/core';
import { sortableKeyboardCoordinates } from '@dnd-kit/sortable';
import styles from './KanbanBoard.module.css';

interface KanbanBoardProps {
  tasks: Task[];
  onUpdateTaskStatus: (taskId: string, newStatus: TaskStatus) => void;
  onRemove: (id: string) => void;
  onToggleStatus: (id: string) => void;
  onUpdate: (id: string, updates: Partial<Omit<Task, 'id' | 'createdAt'>>) => void;
  onAddSubtask: (parentId: string, title: string) => void;
  onRemoveSubtask: (parentId: string, subtaskId: string) => void;
  onToggleSubtaskStatus: (parentId: string, subtaskId: string) => void;
}

const columns: { id: TaskStatus; title: string }[] = [
  { id: 'pendente', title: 'A Fazer' },
  { id: 'concluida', title: 'Concluído' },
];

export function KanbanBoard({ tasks, onUpdateTaskStatus, ...itemProps }: KanbanBoardProps) {
  const [activeTask, setActiveTask] = useState<Task | null>(null);

  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 8,
      },
    }),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  const tasksByColumn = useMemo(() => {
    const pendente = tasks.filter(task => task.status === 'pendente');
    const concluida = tasks.filter(task => task.status === 'concluida');
    return { pendente, concluida };
  }, [tasks]);

  function handleDragStart(event: DragStartEvent) {
    const { active } = event;
    const task = tasks.find(t => t.id === active.id);
    setActiveTask(task || null);
  }

  // --- FUNÇÃO DE ARRASTE FINAL E CORRIGIDA ---
  function handleDragEnd(event: DragEndEvent) {
    setActiveTask(null);
    const { active, over } = event;

    if (!over) return;

    const activeId = String(active.id);
    const overId = String(over.id);

    if (activeId === overId) return;

    const activeTask = tasks.find(t => t.id === activeId);
    if (!activeTask) return;

    // Lógica explícita para encontrar a coluna de destino
    const sourceColumn = activeTask.status;
    let destinationColumn: TaskStatus;

    // Caso 1: A tarefa foi solta diretamente em uma coluna (na área vazia)
    if (overId === 'pendente' || overId === 'concluida') {
        destinationColumn = overId;
    } else {
        // Caso 2: A tarefa foi solta em cima de OUTRA tarefa.
        // Precisamos encontrar a qual coluna essa outra tarefa pertence.
        const overTask = tasks.find(t => t.id === overId);
        if (!overTask) return; // Se não encontrar a tarefa de destino, cancela.
        destinationColumn = overTask.status;
    }

    // Só dispara a atualização se a coluna realmente mudou
    if (sourceColumn !== destinationColumn) {
        onUpdateTaskStatus(activeId, destinationColumn);
    }
  }

  return (
    <DndContext 
      sensors={sensors} 
      onDragStart={handleDragStart}
      onDragEnd={handleDragEnd} 
    >
      <div className={styles.board}>
        {columns.map(column => (
          <KanbanColumn
            key={column.id}
            id={column.id}
            title={column.title}
            tasks={tasksByColumn[column.id]}
            {...itemProps}
          />
        ))}
      </div>

      <DragOverlay>
        {activeTask ? <TodoItem task={activeTask} {...itemProps} /> : null}
      </DragOverlay>
    </DndContext>
  );
}