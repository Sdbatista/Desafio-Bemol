import { describe, it, expect, beforeEach } from 'vitest';
import { renderHook, act } from '@testing-library/react';
import { useTodos } from './useTodos';
import type { NewTaskData } from '../types';

// Mock do LocalStorage antes de cada teste
beforeEach(() => {
  localStorage.clear();
});

// Mock da tarefa de exemplo
const mockTask: NewTaskData = {
  title: 'Test Task',
  description: 'Test Description',
  tags: ['test'],
  priority: 'media',
};

describe('useTodos Hook', () => {

  it('deve adicionar uma nova tarefa', () => {
    // 1. Renderiza o hook
    const { result } = renderHook(() => useTodos());

    // 2. Executa a ação (dentro de 'act')
    act(() => {
      result.current.addTask(mockTask);
    });

    // 3. Verifica o resultado
    expect(result.current.tasks.length).toBe(1);
    expect(result.current.tasks[0].title).toBe('Test Task');
    expect(result.current.tasks[0].status).toBe('pendente');
  });

  it('deve remover uma tarefa', () => {
    const { result } = renderHook(() => useTodos());

    // Adiciona uma tarefa primeiro
    act(() => {
      result.current.addTask(mockTask);
    });
    
    // Pega o ID da tarefa adicionada
    const taskId = result.current.tasks[0].id;

    // Remove a tarefa
    act(() => {
      result.current.removeTask(taskId);
    });

    // Verifica se a lista está vazia
    expect(result.current.tasks.length).toBe(0);
  });

  it('deve alternar o status da tarefa (toggle)', () => {
    const { result } = renderHook(() => useTodos());
    act(() => {
      result.current.addTask(mockTask);
    });
    const taskId = result.current.tasks[0].id;

    // 1. Verifica se começou como 'pendente'
    expect(result.current.tasks[0].status).toBe('pendente');

    // 2. Executa o toggle
    act(() => {
      result.current.toggleTaskStatus(taskId);
    });

    // 3. Verifica se mudou para 'concluida'
    expect(result.current.tasks[0].status).toBe('concluida');

    // 4. Executa o toggle novamente
    act(() => {
      result.current.toggleTaskStatus(taskId);
    });

    // 5. Verifica se voltou para 'pendente'
    expect(result.current.tasks[0].status).toBe('pendente');
  });
  
  it('deve persistir no LocalStorage', () => {
    // 1. Primeiro render, adiciona uma tarefa
    const { result } = renderHook(() => useTodos());
    act(() => {
      result.current.addTask(mockTask);
    });
    
    // Verifica se salvou (indiretamente, pela lista de tarefas)
    expect(result.current.tasks.length).toBe(1);

    // 2. Segundo render, simula recarregar a página
    // O hook 'loadTasks' (dentro do 'useState') deve ser chamado
    const { result: result2 } = renderHook(() => useTodos());
    
    // Verifica se a tarefa foi carregada do LocalStorage
    expect(result2.current.tasks.length).toBe(1);
    expect(result2.current.tasks[0].title).toBe('Test Task');
  });
});