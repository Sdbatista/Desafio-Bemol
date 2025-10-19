// src/hooks/useTodos.ts

import { useState, useEffect, useMemo, useCallback } from 'react';
import type { 
  Task, 
  NewTaskData,
  Subtask,
  TaskPriority, 
  TaskStatus, 
  SortCriteria 
} from '../types';
import { 
  loadTasks, saveTasks, loadDefinedTags, saveDefinedTags 
} from '../lib/storage';

// Hook customizado para gerenciar o histórico de estados (para Undo/Redo)
function useHistory(initialState: Task[]) {
  const [index, setIndex] = useState(0);
  const [history, setHistory] = useState([initialState]);

  const setState = useCallback((action: (prevState: Task[]) => Task[], overwrite = false) => {
    setHistory(currentHistory => {
      const newHistory = currentHistory.slice(0, index + 1);
      const newState = action(newHistory[index]);
      
      if (overwrite) {
        newHistory[index] = newState;
        return newHistory;
      }
      
      setIndex(newHistory.length);
      return [...newHistory, newState];
    });
  }, [index]);

  const undo = () => setIndex(prev => Math.max(0, prev - 1));
  const redo = () => setIndex(prev => Math.min(history.length - 1, prev + 1));

  return {
    state: history[index] || [],
    setState,
    undo,
    redo,
    canUndo: index > 0,
    canRedo: index < history.length - 1,
  };
}


export interface FilterState {
  search: string;
  status: 'todas' | TaskStatus;
  priority: 'todas' | TaskPriority;
  tag: 'todas' | string;
}

const priorityMap: Record<TaskPriority, number> = { 'alta': 3, 'media': 2, 'baixa': 1 };

export function useTodos() {
  const { state: tasks, setState, undo, redo, canUndo, canRedo } = useHistory(loadTasks());
  
  const [definedTags, setDefinedTags] = useState<string[]>(() => loadDefinedTags());
  const [filters, setFilters] = useState<FilterState>({
    search: '', status: 'todas', priority: 'todas', tag: 'todas',
  });
  const [sortCriteria, setSortCriteria] = useState<SortCriteria>('criacao-recente');

  useEffect(() => { saveTasks(tasks); }, [tasks]);
  useEffect(() => { saveDefinedTags(definedTags); }, [definedTags]);

  const filteredTasks = useMemo(() => {
    const currentTasks = tasks || [];
    const filtered = currentTasks.filter((task) => {
      const searchLower = filters.search.toLowerCase();
      if (filters.status !== 'todas' && task.status !== filters.status) return false;
      if (filters.priority !== 'todas' && task.priority !== filters.priority) return false;
      if (filters.tag !== 'todas' && !task.tags.includes(filters.tag)) return false;
      if (searchLower && !task.title.toLowerCase().includes(searchLower) && !task.description.toLowerCase().includes(searchLower)) return false;
      return true;
    });

    if (sortCriteria) {
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
    }
    return filtered;
  }, [tasks, filters, sortCriteria]);

  const allTags = useMemo(() => {
    const currentTasks = tasks || [];
    const tagsSet = new Set<string>();
    currentTasks.forEach((task) => { task.tags.forEach((tag) => tagsSet.add(tag)); });
    definedTags.forEach(tag => tagsSet.add(tag));
    return Array.from(tagsSet).sort();
  }, [tasks, definedTags]);

  const setTasks = (newTasks: Task[]) => {
    setState(() => newTasks, false);
  };

  const addTask = (data: NewTaskData) => {
    setState(prevTasks => {
      const newTask: Task = { ...data, id: crypto.randomUUID(), status: 'pendente', createdAt: new Date().toISOString(), subtasks: [] };
      return [newTask, ...(prevTasks || [])];
    });
  };

  const removeTask = (id: string) => {
    setState(prevTasks => (prevTasks || []).filter((task) => task.id !== id));
  };
  
  const toggleTaskStatus = (id: string) => {
    setState(prevTasks => (prevTasks || []).map((task) => task.id === id ? { ...task, status: task.status === 'pendente' ? 'concluida' : 'pendente' } : task ));
  };
  
  const updateTaskStatus = (id: string, newStatus: TaskStatus) => {
    setState(prevTasks => (prevTasks || []).map((task) => task.id === id ? { ...task, status: newStatus } : task ));
  };

  const updateTask = (id: string, updates: Partial<Omit<Task, 'id' | 'createdAt'>>) => {
    setState(prevTasks => (prevTasks || []).map((task) => task.id === id ? { ...task, ...updates } : task ));
  };

  // --- CORREÇÃO APLICADA AQUI ---
  const addSubtask = useCallback((parentId: string, title: string) => {
    if (!title.trim()) return;
    const newSubtask: Subtask = { id: crypto.randomUUID(), title, status: 'pendente' };
    setState(currentTasks => (currentTasks || []).map(t => t.id === parentId ? { ...t, subtasks: [...(t.subtasks || []), newSubtask] } : t));
  }, [setState]); // <-- BUG CORRIGIDO: Adicionado 'setState' na dependência

  const removeSubtask = useCallback((parentId: string, subtaskId: string) => {
    setState(currentTasks => (currentTasks || []).map(t => t.id === parentId ? { ...t, subtasks: t.subtasks?.filter(st => st.id !== subtaskId) } : t));
  }, [setState]); // <-- BUG CORRIGIDO: Adicionado 'setState' na dependência

  const toggleSubtaskStatus = useCallback((parentId: string, subtaskId: string) => {
    setState(currentTasks => (currentTasks || []).map(t => t.id === parentId ? { ...t, subtasks: t.subtasks?.map(st => st.id === subtaskId ? { ...st, status: st.status === 'pendente' ? 'concluida' : 'pendente' } : st) } : t));
  }, [setState]); // <-- BUG CORRIGIDO: Adicionado 'setState' na dependência
  
  const addDefinedTag = (newTag: string) => {
    const formattedTag = newTag.trim();
    if (formattedTag && !definedTags.includes(formattedTag)) {
      setDefinedTags((prevTags) => [...prevTags, formattedTag].sort());
    }
  };

  const removeDefinedTag = (tagToRemove: string) => {
    setDefinedTags((prevTags) => prevTags.filter((tag) => tag !== tagToRemove));
    setState((prevTasks) =>
      (prevTasks || []).map((task) => ({
        ...task,
        tags: task.tags.filter((tag) => tag !== tagToRemove),
      }))
    );
  };
  
  const updateFilter = (key: keyof FilterState, value: string) => { setFilters((prevFilters) => ({ ...prevFilters, [key]: value })); };
  const updateSort = (criteria: SortCriteria) => { setSortCriteria(criteria); };

  return {
    tasks: filteredTasks,
    setTasks,
    addTask, removeTask, toggleTaskStatus, updateTask, updateTaskStatus,
    addSubtask, removeSubtask, toggleSubtaskStatus,
    filters, updateFilter,
    sortCriteria, updateSort,
    allTags,
    definedTags, addDefinedTag, removeDefinedTag,
    undo, redo, canUndo, canRedo,
  };
}