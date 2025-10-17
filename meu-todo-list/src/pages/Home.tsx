// src/pages/Home.tsx

import { useState } from 'react'; // 1. IMPORTAR useState
import { useTodos } from '../hooks/useTodos';
import { TodoInput } from '../components/TodoInput';
import { TodoList } from '../components/TodoList';
import { TodoFilter } from '../components/TodoFilter';
import { ThemeToggle } from '../components/ThemeToggle';
import { TagManager } from '../components/TagManager'; // 2. IMPORTAR O NOVO MODAL
import { FaReact, FaTags } from 'react-icons/fa'; // 3. IMPORTAR ÍCONE DE TAG
import styles from './Home.module.css';

export function Home() {
  const [isTagModalOpen, setIsTagModalOpen] = useState(false); // 4. ESTADO DO NOVO MODAL

  const {
    tasks, addTask, removeTask, toggleTaskStatus, updateTask,
    filters, updateFilter, allTags,
    sortCriteria, updateSort,
    definedTags, addDefinedTag, removeDefinedTag, // 5. PEGAR AS NOVAS FUNÇÕES
  } = useTodos();

  return (
    <div className={styles.container}>
      <header className={styles.header}>
        <div className={styles.logoContainer}>
          <FaReact className={styles.logo} />
          <span>PART 1</span>
        </div>
        
        <div className={styles.titleContainer}>
          <h1>Todo List</h1>
          {/* 6. PASSAR 'definedTags' PARA O INPUT */}
          <TodoInput onAddTask={addTask} definedTags={definedTags} />
        </div>
        
        <div className={styles.headerActions}>
          {/* 7. NOVO BOTÃO DE GERENCIAR TAGS */}
          <button 
            className={styles.tagButton} 
            onClick={() => setIsTagModalOpen(true)}
            aria-label="Gerenciar tags"
          >
            <FaTags /> Modificar Tags
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

      {/* 8. RENDERIZAR O NOVO MODAL */}
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