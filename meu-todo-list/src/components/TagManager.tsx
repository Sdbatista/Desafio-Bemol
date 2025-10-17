// src/components/TagManager.tsx

import { useState } from 'react';
import type { FormEvent } from 'react';
import styles from './TagManager.module.css';
import { FaTimes, FaPlus } from 'react-icons/fa';

interface TagManagerProps {
  isOpen: boolean;
  onClose: () => void;
  tags: string[];
  onAddTag: (tag: string) => void;
  onRemoveTag: (tag: string) => void;
}

export function TagManager({ 
  isOpen, onClose, tags, onAddTag, onRemoveTag 
}: TagManagerProps) {
  const [newTag, setNewTag] = useState('');
  const [error, setError] = useState<string | null>(null);

  const handleAddTag = (e: FormEvent) => {
    e.preventDefault();
    setError(null);
    if (!newTag.trim()) {
      setError('O nome da tag não pode ser vazio.');
      return;
    }
    if (tags.includes(newTag.trim())) {
      setError('Essa tag já existe.');
      return;
    }
    onAddTag(newTag);
    setNewTag('');
  };

  if (!isOpen) {
    return null; // Não renderiza nada se estiver fechado
  }

  return (
    <div className={styles.modalOverlay} onClick={onClose}>
      <div 
        className={styles.modalContent} 
        onClick={(e) => e.stopPropagation()} // Impede de fechar ao clicar no modal
        role="dialog" 
        aria-modal="true" 
        aria-labelledby="tag-manager-title"
      >
        <h2 id="tag-manager-title">Gerenciar Tags</h2>
        
        {/* Formulário para Adicionar Nova Tag */}
        <form onSubmit={handleAddTag} className={styles.addForm}>
          <div className={styles.formGroup}>
            <label htmlFor="new-tag-input">Nova Tag</label>
            <div className={styles.inputWrapper}>
              <input
                id="new-tag-input"
                type="text"
                value={newTag}
                onChange={(e) => setNewTag(e.target.value)}
                placeholder="Ex: Pessoal"
              />
              <button type="submit" aria-label="Adicionar nova tag"><FaPlus /></button>
            </div>
            {error && <p className={styles.errorText}>{error}</p>}
          </div>
        </form>

        {/* Lista de Tags Existentes */}
        <div className={styles.tagList}>
          <h3>Tags Existentes</h3>
          {tags.map(tag => (
            <div key={tag} className={styles.tagItem}>
              <span>{tag}</span>
              <button onClick={() => onRemoveTag(tag)} aria-label={`Remover tag ${tag}`}>
                <FaTimes />
              </button>
            </div>
          ))}
        </div>

        <div className={styles.formActions}>
          <button type="button" className={styles.buttonSecondary} onClick={onClose}>
            Fechar
          </button>
        </div>
      </div>
    </div>
  );
}