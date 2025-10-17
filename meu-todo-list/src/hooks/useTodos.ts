// src/hooks/useTodos.ts (FINAL CORRIGIDO - COM TUDO)

import { useState, useEffect, useMemo } from 'react';
import type { 
  Task, 
  NewTaskData, // <-- Corrigido
  TaskPriority, 
  TaskStatus, 
  SortCriteria 
} from '../types';
import { 
  loadTasks, saveTasks, loadDefinedTags, saveDefinedTags 
} from '../lib/storage';

export interface FilterState {
  search: string;
  status: 'todas' | TaskStatus;
  priority: 'todas' | TaskPriority;
  tag: 'todas' | string;
}

const priorityMap: Record<TaskPriority, number> = { 'alta': 3, 'media': 2, 'baixa': 1 };

export function useTodos() {
  // --- ESTADOS ---
  const [tasks, setTasks] = useState<Task[]>(() => loadTasks());
  const [definedTags, setDefinedTags] = useState<string[]>(() => loadDefinedTags());
  const [filters, setFilters] = useState<FilterState>({
    search: '', status: 'todas', priority: 'todas', tag: 'todas',
  });
  const [sortCriteria, setSortCriteria] = useState<SortCriteria>('criacao-recente');

  // --- EFEITOS (Para salvar no LocalStorage) ---
  useEffect(() => { saveTasks(tasks); }, [tasks]);
  useEffect(() => { saveDefinedTags(definedTags); }, [definedTags]);

  // --- LÓGICA MEMORIZADA (Filtro e Ordenação) ---
  const filteredTasks = useMemo(() => {
    const filtered = tasks.filter((task) => {
      const searchLower = filters.search.toLowerCase();
      if (filters.status !== 'todas' && task.status !== filters.status) return false;
      if (filters.priority !== 'todas' && task.priority !== filters.priority) return false;
      if (filters.tag !== 'todas' && !task.tags.includes(filters.tag)) return false;
      if (searchLower && !task.title.toLowerCase().includes(searchLower) && !task.description.toLowerCase().includes(searchLower)) return false;
      return true;
    });

    filtered.sort((a, b) => {
      switch (sortCriteria) {
        case 'prioridade-alta': return priorityMap[b.priority] - priorityMap[a.priority];
        case 'vencimento-proximo':
          if (!a.dueDate) return 1; if (!b.dueDate) return -1;
          return new Date(a.dueDate).getTime() - new Date(b.dueDate).getTime();
        case 'criacao-antiga': return new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime();
        case 'criacao-recente': default: return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
      }
    });
    return filtered;
  }, [tasks, filters, sortCriteria]);

  // Lista de tags para o filtro (combina tags em uso + tags definidas)
  const allTags = useMemo(() => {
    const tagsSet = new Set<string>();
    tasks.forEach((task) => { task.tags.forEach((tag) => tagsSet.add(tag)); });
    definedTags.forEach(tag => tagsSet.add(tag));
    return Array.from(tagsSet).sort();
  }, [tasks, definedTags]);


  // --- FUNÇÕES CRUD DE TAREFAS ---
  const addTask = (data: NewTaskData) => { // <-- Corrigido
    const newTask: Task = { ...data, id: crypto.randomUUID(), status: 'pendente', createdAt: new Date().toISOString() };
    setTasks((prevTasks) => [newTask, ...prevTasks]);
  };
  const removeTask = (id: string) => { setTasks((prevTasks) => prevTasks.filter((task) => task.id !== id)); };
  const toggleTaskStatus = (id: string) => { setTasks((prevTasks) => prevTasks.map((task) => task.id === id ? { ...task, status: task.status === 'pendente' ? 'concluida' : 'pendente' } : task )); };
  const updateTask = (id: string, updates: Partial<Omit<Task, 'id' | 'createdAt'>>) => { setTasks((prevTasks) => prevTasks.map((task) => task.id === id ? { ...task, ...updates } : task )); };

  // --- FUNÇÕES CRUD DE TAGS ---
  const addDefinedTag = (newTag: string) => {
    const formattedTag = newTag.trim();
    if (formattedTag && !definedTags.includes(formattedTag)) {
      setDefinedTags((prevTags) => [...prevTags, formattedTag].sort());
    }
  };

  const removeDefinedTag = (tagToRemove: string) => {
    setDefinedTags((prevTags) => prevTags.filter((tag) => tag !== tagToRemove));
    setTasks((prevTasks) =>
      prevTasks.map((task) => ({
        ...task,
        tags: task.tags.filter((tag) => tag !== tagToRemove),
      }))
    );
  };
  
  // --- FUNÇÕES DE CONTROLE ---
  const updateFilter = (key: keyof FilterState, value: string) => { setFilters((prevFilters) => ({ ...prevFilters, [key]: value })); };
  const updateSort = (criteria: SortCriteria) => { setSortCriteria(criteria); };

  // --- RETORNO (CORRIGIDO) ---
  return {
    tasks: filteredTasks,
    addTask, removeTask, toggleTaskStatus, updateTask,
    
    filters, updateFilter,
    sortCriteria, updateSort,

    allTags, // Para o filtro
    
    // A PARTE QUE FALTAVA:
    definedTags,
    addDefinedTag,
    removeDefinedTag,
  };
}