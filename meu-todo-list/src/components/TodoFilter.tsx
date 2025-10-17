// src/components/TodoFilter.tsx

import styles from './TodoFilter.module.css';
import type { FilterState } from '../hooks/useTodos';
import type { SortCriteria } from '../types'; // 1. IMPORTAR O TIPO

interface TodoFilterProps {
  filters: FilterState;
  allTags: string[];
  onFilterChange: (key: keyof FilterState, value: string) => void;
  // 2. NOVAS PROPS PARA ORDENAÇÃO
  sortCriteria: SortCriteria;
  onSortChange: (criteria: SortCriteria) => void;
}

export function TodoFilter({ 
  filters, 
  allTags, 
  onFilterChange, 
  sortCriteria, 
  onSortChange 
}: TodoFilterProps) {
  return (
    <div className={styles.filterBar}>
      <input
        type="text"
        placeholder="Buscar por título ou descrição..."
        className={styles.searchInput}
        value={filters.search}
        onChange={(e) => onFilterChange('search', e.target.value)}
        aria-label="Buscar tarefas por título ou descrição"
      />

      <div className={styles.selectors}>
        {/* --- 3. NOVO SELECT DE ORDENAÇÃO --- */}
        <select
          value={sortCriteria}
          onChange={(e) => onSortChange(e.target.value as SortCriteria)}
          aria-label="Ordenar tarefas por"
        >
          <option value="criacao-recente">Ordenar: Mais Recentes</option>
          <option value="criacao-antiga">Ordenar: Mais Antigas</option>
          <option value="prioridade-alta">Ordenar: Prioridade</option>
          <option value="vencimento-proximo">Ordenar: Vencimento</option>
        </select>
        
        {/* Filtros existentes */}
        <select
          value={filters.status}
          onChange={(e) => onFilterChange('status', e.target.value)}
          aria-label="Filtrar tarefas por status"
        >
          <option value="todas">Status: Todos</option>
          <option value="pendente">Status: Pendentes</option>
          <option value="concluida">Status: Concluídas</option>
        </select>

        <select
          value={filters.priority}
          onChange={(e) => onFilterChange('priority', e.target.value)}
          aria-label="Filtrar tarefas por prioridade"
        >
          <option value="todas">Prioridade: Todas</option>
          <option value="baixa">Prioridade: Baixa</option>
          <option value="media">Prioridade: Média</option>
          <option value="alta">Prioridade: Alta</option>
        </select>

        <select
          value={filters.tag}
          onChange={(e) => onFilterChange('tag', e.target.value)}
          aria-label="Filtrar tarefas por tag"
        >
          <option value="todas">Tags: Todas</option>
          {allTags.map((tag) => (
            <option key={tag} value={tag}>
              Tag: {tag}
            </option>
          ))}
        </select>
      </div>
    </div>
  );
}