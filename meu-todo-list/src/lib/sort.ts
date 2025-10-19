// src/lib/sort.ts - COMPLETO

import type { Task, SortCriteria } from '../types';

/**
 * Funções de Comparação para Array.sort()
 */
const comparators = {
  // Ordena do mais recente para o mais antigo (maior número `createdAt` para menor)
  'criacao-recente': (a: Task, b: Task) => b.createdAt.localeCompare(a.createdAt),
  
  // Ordena do mais antigo para o mais recente
  'criacao-antiga': (a: Task, b: Task) => a.createdAt.localeCompare(b.createdAt),

  // Prioridade (Alta > Média > Baixa)
  'prioridade-alta': (a: Task, b: Task) => {
    const priorityOrder: Record<string, number> = { 'alta': 3, 'media': 2, 'baixa': 1 };
    return priorityOrder[b.priority] - priorityOrder[a.priority];
  },

  // Vencimento (Próximo > Distante)
  'vencimento-proximo': (a: Task, b: Task) => {
    // Trata tarefas sem data de vencimento, colocando-as no final
    if (!a.dueDate) return 1;
    if (!b.dueDate) return -1;
    
    // Converte datas para serem comparáveis (ex: "2025-10-30")
    return a.dueDate.localeCompare(b.dueDate);
  }
};

/**
 * Função principal para ordenar tarefas
 * @param tasks O array de tarefas a ser ordenado
 * @param criteria O critério de ordenação (ex: 'criacao-recente')
 * @returns Um novo array de tarefas ordenado
 */
export function sortTasks(tasks: Task[], criteria: SortCriteria): Task[] {
  const comparator = comparators[criteria];
  
  // Cria uma cópia para não modificar o array original do React
  return [...tasks].sort(comparator);
}