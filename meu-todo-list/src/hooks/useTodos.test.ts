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
    const { result } = renderHook(() => useTodos());

    act(() => {
      result.current.addTask(mockTask);
    });

    expect(result.current.tasks.length).toBe(1);
    expect(result.current.tasks[0].title).toBe('Test Task');
    expect(result.current.tasks[0].status).toBe('pendente');
  });

  it('deve remover uma tarefa', () => {
    const { result } = renderHook(() => useTodos());
    act(() => { result.current.addTask(mockTask); });
    const taskId = result.current.tasks[0].id;

    act(() => { result.current.removeTask(taskId); });

    expect(result.current.tasks.length).toBe(0);
  });

  it('deve alternar o status da tarefa', () => {
    const { result } = renderHook(() => useTodos());
    act(() => { result.current.addTask(mockTask); });
    const taskId = result.current.tasks[0].id;

    act(() => { result.current.toggleTaskStatus(taskId); });
    expect(result.current.tasks[0].status).toBe('concluida');

    act(() => { result.current.toggleTaskStatus(taskId); });
    expect(result.current.tasks[0].status).toBe('pendente');
  });

  // --- TESTES ATUALIZADOS ---

  describe('Subtasks', () => {
    it('deve adicionar uma subtarefa a uma tarefa', () => {
      const { result } = renderHook(() => useTodos());
      act(() => { result.current.addTask(mockTask); });
      const taskId = result.current.tasks[0].id;

      act(() => { result.current.addSubtask(taskId, 'New Subtask'); });

      expect(result.current.tasks[0].subtasks).toBeDefined();
      expect(result.current.tasks[0].subtasks?.length).toBe(1);
      expect(result.current.tasks[0].subtasks?.[0].title).toBe('New Subtask');
    });

    it('deve remover uma subtarefa', () => {
      const { result } = renderHook(() => useTodos());
      act(() => { result.current.addTask(mockTask); });
      const taskId = result.current.tasks[0].id;
      act(() => { result.current.addSubtask(taskId, 'Subtask to remove'); });
      const subtaskId = result.current.tasks[0].subtasks![0].id;

      act(() => { result.current.removeSubtask(taskId, subtaskId); });

      expect(result.current.tasks[0].subtasks?.length).toBe(0);
    });

    it('deve alternar o status de uma subtarefa', () => {
      const { result } = renderHook(() => useTodos());
      act(() => { result.current.addTask(mockTask); });
      const taskId = result.current.tasks[0].id;
      act(() => { result.current.addSubtask(taskId, 'My Subtask'); });
      const subtaskId = result.current.tasks[0].subtasks![0].id;

      expect(result.current.tasks[0].subtasks![0].status).toBe('pendente');

      act(() => { result.current.toggleSubtaskStatus(taskId, subtaskId); });
      expect(result.current.tasks[0].subtasks![0].status).toBe('concluida');

      act(() => { result.current.toggleSubtaskStatus(taskId, subtaskId); });
      expect(result.current.tasks[0].subtasks![0].status).toBe('pendente');
    });
  });

  describe('Undo/Redo', () => {
    it('deve desfazer a adição de uma tarefa', () => {
      const { result } = renderHook(() => useTodos());
      expect(result.current.canUndo).toBe(false);

      act(() => { result.current.addTask(mockTask); });
      expect(result.current.tasks.length).toBe(1);
      expect(result.current.canUndo).toBe(true);

      act(() => { result.current.undo(); });
      expect(result.current.tasks.length).toBe(0);
      expect(result.current.canRedo).toBe(true);
    });

    it('deve refazer a adição de uma tarefa', () => {
      const { result } = renderHook(() => useTodos());
      act(() => { result.current.addTask(mockTask); });
      act(() => { result.current.undo(); });
      expect(result.current.tasks.length).toBe(0);
      
      act(() => { result.current.redo(); });
      expect(result.current.tasks.length).toBe(1);
      expect(result.current.tasks[0].title).toBe('Test Task');
    });

    it('deve desfazer a remoção de uma tarefa', () => {
        const { result } = renderHook(() => useTodos());
        act(() => { result.current.addTask(mockTask); });
        const taskId = result.current.tasks[0].id;
        
        act(() => { result.current.removeTask(taskId); });
        expect(result.current.tasks.length).toBe(0);

        act(() => { result.current.undo(); });
        expect(result.current.tasks.length).toBe(1);
    });
  });
});