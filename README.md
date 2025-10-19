# 🚀 React Power To-Do List:🚀

<h3 align="center">
  <a href="https://desafio-bemol.vercel.app" target="_blank">➡️ CLIQUE AQUI PARA ACESSAR A DEMONSTRAÇÃO AO VIVO ⬅️</a>
</h3>

<p align="center">
  <a href="https://desafio-bemol.vercel.app" target="_blank">
    <img src="https://img.shields.io/badge/Deploy-Live%20Demo-brightgreen?style=for-the-badge&logo=vercel" alt="Live Demo" />
  </a>
</p>

Este não é apenas mais um To-Do List. É uma aplicação de produtividade robusta e moderna construída com **React, TypeScript e Vite**, que demonstra a implementação de funcionalidades complexas e uma arquitetura de estado avançada. O projeto vai além de um simples CRUD, oferecendo uma experiência de usuário rica com fluxos de trabalho visuais como Kanban, histórico de ações e hierarquia de tarefas.


---

## ✅ Lista Completa de Funcionalidades

### Funcionalidades Essenciais
* [cite_start]**CRUD Completo de Tarefas:** Criar, Editar (inline), Remover e Marcar como Concluída[cite: 28].
* [cite_start]**Gerenciador de Tags:** Adicione e remova categorias de forma centralizada para manter a organização[cite: 26].
* [cite_start]**Filtros Avançados:** Filtre a visualização por status (pendente/concluída), Prioridade e Tags[cite: 29].
* [cite_start]**Busca Textual:** Encontre tarefas instantaneamente pesquisando por título ou descrição[cite: 30].
* [cite_start]**Ordenação Flexível:** Reordene a lista de tarefas por data de criação (recente/antiga), data de vencimento ou nível de prioridade[cite: 31].
* [cite_start]**Persistência de Dados:** O estado completo das tarefas, a lista de tags e a preferência de tema são salvos no `localStorage`, garantindo que nada seja perdido ao recarregar a página[cite: 32].
* [cite_start]**Acessibilidade (AA):** A aplicação é totalmente acessível, com `aria-labels` em todos os botões e inputs para navegação via teclado[cite: 34, 59].
* [cite_start]**Responsividade:** O layout se adapta perfeitamente a dispositivos mobile e desktop[cite: 25].

### 🌟 Diferenciais Implementados (Bônus)
* **Hierarquia com Subtarefas:** Quebre tarefas grandes em passos menores. [cite_start]Cada tarefa principal pode ter sua própria lista de subtarefas, com uma barra de progresso visual[cite: 36].
* **Drag & Drop Inteligente:**
    * [cite_start]**Reordene:** Na visualização em grade, arraste e solte tarefas para organizá-las na ordem que desejar[cite: 37].
    * [cite_start]**Mude o Status:** No **Modo Kanban**, arraste uma tarefa entre as colunas "A Fazer" e "Concluído" para atualizar seu status de forma visual e intuitiva[cite: 37].
* [cite_start]**Histórico de Ações (Undo/Redo):** Desfaça e refaça qualquer alteração no estado das tarefas (adição, remoção, mudança de status, reordenação), dando total controle ao usuário[cite: 40].
* [cite_start]**Modo Kanban Opcional:** Alterne com um clique para uma visualização em colunas, otimizada para gerenciamento de fluxo de trabalho[cite: 40].
* [cite_start]**Tema Claro/Escuro:** Suporte completo a Dark Mode para melhor conforto visual[cite: 38].
* [cite_start]**Testes Automatizados:** Testes unitários para a lógica de negócio no hook `useTodos`, garantindo a robustez das funcionalidades principais com Vitest e React Testing Library[cite: 39, 61].

## 🛠️ Principais Decisões Técnicas

* **Framework & Build:** **React 18+** (com Hooks) e **Vite** com **TypeScript** para uma base de desenvolvimento moderna, rápida e com tipagem segura.
* **Gerenciamento de Estado:**
    * **Hook Customizado (`useTodos`):** Toda a lógica de negócio (CRUDs, filtros, ordenação) foi centralizada em um único hook. Dentro dele, um **hook de histórico customizado (`useHistory`)** foi criado para gerenciar o estado do Undo/Redo de forma limpa e desacoplada.
    * **React Context (`ThemeContext`):** Utilizado para gerenciar o estado global do tema (claro/escuro) de forma eficiente.
* **Drag & Drop:**
    * **`dnd-kit`:** Escolhida por ser uma biblioteca de arrastar e soltar moderna, acessível e performática. Utilizamos estratégias como `DragOverlay` para garantir uma experiência de usuário fluida e sem bugs visuais ao mover tarefas entre diferentes contextos (colunas do Kanban).
* **Estilização:**
    * **CSS Modules & Variáveis CSS:** Estilos escopados por componente para evitar conflitos e uma arquitetura de cores baseada em variáveis que permite a troca de tema de forma instantânea e com código limpo.
* **Testes:** **Vitest + React Testing Library (RTL)** foram escolhidos pela integração nativa com o Vite e pela filosofia de testar o comportamento do hook `useTodos` (o "cérebro" da aplicação) de forma isolada e eficaz.

## 🚀 Como Rodar o Projeto

[cite_start]Siga os passos abaixo para executar a aplicação em modo de desenvolvimento[cite: 66].

1.  **Clone este repositório:**
    ```bash
    git clone [https://github.com/Sdbatista/Desafio-Bemol.git](https://github.com/Sdbatista/Desafio-Bemol.git)
    cd Desafio-Bemol/meu-todo-list
    ```
2.  **Instale as dependências:**
    ```bash
    npm install
    ```
3.  **Inicie o servidor de desenvolvimento (Vite):**
    ```bash
    npm run dev
    ```
    A aplicação estará disponível em `http://localhost:5173`.

4.  **Para rodar os testes automatizados:**
    ```bash
    npm run test
    ```

## 📸 Screenshots

**Tema Claro**
![Tema Claro](./meu-todo-list/images/tema-claro.png)

**Tema Escuro**
![Tema Escuro](./meu-todo-list/images/tema-escuro.png)

**Modo Kanban e Subtarefas**
![Kanban](./image_00a136.png)

**Modais (Criação e Gerenciamento de Tags)**
![Modal de Tags](./meu-todo-list/images/modal-tags.png)
![Modal de Tarefa](./meu-todo-list/images/modal-tarefa.png)