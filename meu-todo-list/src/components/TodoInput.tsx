// src/components/TodoInput.tsx (FINAL CORRIGIDO)

import { useState, useEffect } from 'react'; // <-- Importar useEffect
import type { FormEvent } from 'react';
import type { NewTaskData, TaskPriority } from '../types'; // <-- Corrigido
import styles from './TodoInput.module.css';

interface TodoInputProps {
  onAddTask: (taskData: NewTaskData) => void; // <-- Corrigido
  definedTags: string[];
}

export function TodoInput({ onAddTask, definedTags }: TodoInputProps) {
  const [isModalOpen, setIsModalOpen] = useState(false);

  // Estados dos campos
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [tag, setTag] = useState(definedTags[0] || '');
  const [priority, setPriority] = useState<TaskPriority>('media');
  const [dueDate, setDueDate] = useState('');
  const [error, setError] = useState<string | null>(null);

  const today = new Date().toISOString().split('T')[0];

  // Efeito para atualizar a tag padrão se a lista de tags mudar
  useEffect(() => {
    if (!definedTags.includes(tag)) {
      setTag(definedTags[0] || '');
    }
  }, [definedTags, tag]);

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!title.trim() || !description.trim()) {
      setError('Por favor, preencha Título e Descrição.');
      return;
    }
    if (!tag) {
      setError('Nenhuma tag definida. Crie uma em "Modificar Tags".');
      return;
    }

    const taskData: NewTaskData = { // <-- Corrigido
      title,
      description,
      tags: [tag],
      priority,
      dueDate: dueDate || undefined,
    };
    
    onAddTask(taskData);
    
    // Limpa o formulário
    setTitle('');
    setDescription('');
    setTag(definedTags[0] || '');
    setPriority('media');
    setDueDate('');
    setError(null);
    setIsModalOpen(false);
  };
  
  const handleOpenModal = () => {
    setError(null);
    setTag(definedTags[0] || '');
    setIsModalOpen(true);
  };

  return (
    <>
      <button className={styles.createButton} onClick={handleOpenModal} aria-label="Criar nova tarefa">
        Create Task
      </button>

      {isModalOpen && (
        <div className={styles.modalOverlay}>
          <div className={styles.modalContent} role="dialog" aria-modal="true" aria-labelledby="modal-title">
            <h2 id="modal-title">Nova Tarefa</h2>
            <form onSubmit={handleSubmit}>
              <div className={styles.formGroup}><label htmlFor="title">Título</label><input id="title" type="text" value={title} onChange={(e) => setTitle(e.target.value)} placeholder="Ex: Corrigir bug no login" aria-required="true" /></div>
              <div className={styles.formGroup}><label htmlFor="description">Descrição</label><textarea id="description" value={description} onChange={(e) => setDescription(e.target.value)} placeholder="Ex: O bug ocorre ao usar senhas longas..." aria-required="true" /></div>

              <div className={styles.formRow}>
                <div className={styles.formGroup}>
                  <label htmlFor="tag">Tag (Categoria)</label>
                  <select id="tag" value={tag} onChange={(e) => setTag(e.target.value)} aria-required="true">
                    {definedTags.length === 0 ? (
                      <option value="">Crie uma tag...</option>
                    ) : (
                      definedTags.map((t) => (
                        <option key={t} value={t}>{t}</option>
                      ))
                    )}
                  </select>
                </div>
                
                <div className={styles.formGroup}>
                  <label htmlFor="priority">Prioridade</label>
                  <select id="priority" value={priority} onChange={(e) => setPriority(e.target.value as TaskPriority)} aria-required="true">
                    <option value="baixa">Baixa</option>
                    <option value="media">Média</option>
                    <option value="alta">Alta</option>
                  </select>
                </div>
              </div>

              <div className={styles.formGroup}>
                <label htmlFor="dueDate">Data de Vencimento (Opcional)</label>
                <input id="dueDate" type="date" value={dueDate} onChange={(e) => setDueDate(e.target.value)} min={today} />
              </div>

              {error && ( <p className={styles.errorText} role="alert">{error}</p> )}

              <div className={styles.formActions}>
                <button type="button" className={styles.buttonSecondary} onClick={() => setIsModalOpen(false)}>Cancelar</button>
                <button type="submit" className={styles.buttonPrimary}>Salvar Tarefa</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </>
  );
}