// src/pages/Home.tsx (Traduzido e limpo)

import { useState } from 'react';
import { useTodos } from '../hooks/useTodos';
import { TodoInput } from '../components/TodoInput';
import { TodoList } from '../components/TodoList';
import { TodoFilter } from '../components/TodoFilter';
import { ThemeToggle } from '../components/ThemeToggle';
import { TagManager } from '../components/TagManager';
import { FaReact, FaTags } from 'react-icons/fa';
import styles from './Home.module.css';

export function Home() {
  const [isTagModalOpen, setIsTagModalOpen] = useState(false);

  const {
    tasks, addTask, removeTask, toggleTaskStatus, updateTask,
    filters, updateFilter, allTags,
    sortCriteria, updateSort,
    definedTags, addDefinedTag, removeDefinedTag,
  } = useTodos();

  return (
    <div className={styles.container}>
      <header className={styles.header}>
        <div className={styles.logoContainer}>
          <FaReact className={styles.logo} />
          {/* "PART 1" FOI REMOVIDO DAQUI */}
        </div>
        
        <div className={styles.titleContainer}>
          <h1>Todo List</h1>
          <TodoInput onAddTask={addTask} definedTags={definedTags} />
        </div>
        
        <div className={styles.headerActions}>
          <button 
            className={styles.tagButton} 
            onClick={() => setIsTagModalOpen(true)}
            aria-label="Manage Tags"
          >
            <FaTags /> <span>Manage Tags</span>
          </button>
          <ThemeToggle />
        </div>
      </header>
      
      <section className={styles.tasksSection}>
        <div className={styles.tasksHeader}>
          <h2>All Tasks</h2>
          <TodoFilter
            filters={filters}
            allTags={allTags}
            onFilterChange={updateFilter}
            sortCriteria={sortCriteria}
            onSortChange={updateSort}
          />
        </div>
        <TodoList
          tasks={tasks}
          onRemove={removeTask}
          onToggleStatus={toggleTaskStatus}
          onUpdate={updateTask}
        />
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