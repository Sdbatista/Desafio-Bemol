// src/lib/storage.ts

import type { Task } from '../types';

// --- ARMAZENAMENTO DE TAREFAS ---
const TASKS_STORAGE_KEY = 'my-todo-list:tasks-v1';

export function loadTasks(): Task[] {
  const tasksJson = localStorage.getItem(TASKS_STORAGE_KEY);
  if (!tasksJson) return [];
  try {
    return JSON.parse(tasksJson) as Task[];
  } catch (error) {
    console.error("Erro ao carregar tarefas:", error);
    return [];
  }
}

export function saveTasks(tasks: Task[]): void {
  try {
    const tasksJson = JSON.stringify(tasks);
    localStorage.setItem(TASKS_STORAGE_KEY, tasksJson);
  } catch (error) {
    console.error("Erro ao salvar tarefas:", error);
  }
}

// --- ARMAZENAMENTO DE TAGS (A PARTE NOVA) ---
const TAGS_STORAGE_KEY = 'my-todo-list:defined-tags-v1';
// Tags padrão se o usuário nunca mexeu
const DEFAULT_TAGS = ['React', 'Python', 'Maths', 'Trabalho', 'Estudo'];

export function loadDefinedTags(): string[] {
  const tagsJson = localStorage.getItem(TAGS_STORAGE_KEY);
  if (!tagsJson) {
    return DEFAULT_TAGS; // Retorna as tags padrão
  }
  try {
    const tags = JSON.parse(tagsJson) as string[];
    return tags.length > 0 ? tags : DEFAULT_TAGS; 
  } catch (error) {
    console.error("Erro ao carregar tags:", error);
    return DEFAULT_TAGS;
  }
}

export function saveDefinedTags(tags: string[]): void {
  try {
    const tagsJson = JSON.stringify(tags);
    localStorage.setItem(TAGS_STORAGE_KEY, tagsJson);
  } catch (error) {
    console.error("Erro ao salvar tags:", error);
  }
}