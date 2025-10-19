// src/pages/Home.tsx

import { useState } from 'react';
import { useTodos } from '../hooks/useTodos';
import { TodoInput } from '../components/TodoInput';
import { TodoList } from '../components/TodoList';
import { KanbanBoard } from '../components/KanbanBoard';
import { TodoFilter } from '../components/TodoFilter';
import { ThemeToggle } from '../components/ThemeToggle';
import { TagManager } from '../components/TagManager';
import { FaReact, FaTags, FaUndo, FaRedo, FaList, FaTh } from 'react-icons/fa';
import styles from './Home.module.css';

type ViewMode = 'list' | 'kanban';

export function Home() {
  const [isTagModalOpen, setIsTagModalOpen] = useState(false);
  const [viewMode, setViewMode] = useState<ViewMode>('list');

  const {
    tasks, setTasks,
    addTask, removeTask, toggleTaskStatus, updateTask, updateTaskStatus,
    addSubtask, removeSubtask, toggleSubtaskStatus,
    filters, updateFilter, allTags,
    sortCriteria, updateSort,
    definedTags, addDefinedTag, removeDefinedTag,
    undo, redo, canUndo, canRedo,
  } = useTodos();

  const commonTaskProps = {
    onRemove: removeTask,
    onToggleStatus: toggleTaskStatus,
    onUpdate: updateTask,
    onAddSubtask: addSubtask,
    onRemoveSubtask: removeSubtask,
    onToggleSubtaskStatus: toggleSubtaskStatus,
  };

  return (
    <div className={styles.container}>
      <header className={styles.header}>
        <div className={styles.logoContainer}> <FaReact className={styles.logo} /> </div>
        
        <div className={styles.titleContainer}>
          <h1>Todo List</h1>
          <TodoInput onAddTask={addTask} definedTags={definedTags} />
        </div>
        
        <div className={styles.headerActions}>
          <button onClick={undo} disabled={!canUndo} className={styles.actionButton} aria-label="Desfazer"> <FaUndo /> </button>
          <button onClick={redo} disabled={!canRedo} className={styles.actionButton} aria-label="Refazer"> <FaRedo /> </button>
          <button className={styles.tagButton} onClick={() => setIsTagModalOpen(true)} aria-label="Gerenciar Tags"> <FaTags /> <span>Gerenciar Tags</span> </button>
          <ThemeToggle />
        </div>
      </header>
      
      <section className={styles.tasksSection}>
        <div className={styles.tasksHeader}>
          <div className={styles.tasksTitleContainer}>
            <h2>Minhas Tarefas</h2>
            <div className={styles.viewToggle}>
              <button onClick={() => setViewMode('list')} className={viewMode === 'list' ? styles.active : ''} aria-label="Visualização em Grade"> <FaTh /> </button>
              <button onClick={() => setViewMode('kanban')} className={viewMode === 'kanban' ? styles.active : ''} aria-label="Visualização Kanban"> <FaList /> </button>
            </div>
          </div>
          <TodoFilter
            filters={filters}
            allTags={allTags}
            onFilterChange={updateFilter}
            sortCriteria={sortCriteria}
            onSortChange={updateSort}
          />
        </div>

        {viewMode === 'list' ? (
          <TodoList
            tasks={tasks}
            setTasks={setTasks}
            {...commonTaskProps}
          />
        ) : (
          <KanbanBoard
            tasks={tasks}
            onUpdateTaskStatus={updateTaskStatus}
            {...commonTaskProps}
          />
        )}

      </section>

      <TagManager 
        isOpen={isTagModalOpen}
        onClose={() => setIsTagModalOpen(false)}
        tags={definedTags}
        onAddTag={addDefinedTag}
        onRemoveTag={removeDefinedTag}
      />
    </div>
  );
}