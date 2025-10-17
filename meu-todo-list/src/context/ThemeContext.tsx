import { createContext, useContext, useState, useEffect, ReactNode } from 'react';

type Theme = 'light' | 'dark';

interface ThemeContextProps {
  theme: Theme;
  toggleTheme: () => void;
}

// 1. Cria o Contexto
const ThemeContext = createContext<ThemeContextProps | undefined>(undefined);

// 2. Cria o Provedor (Provider)
export function ThemeProvider({ children }: { children: ReactNode }) {
  // Tenta ler do LocalStorage, ou usa 'light' como padrão
  const [theme, setTheme] = useState<Theme>(() => {
    const savedTheme = localStorage.getItem('app-theme') as Theme;
    return savedTheme || 'light';
  });

  // Efeito que roda quando o 'theme' muda
  useEffect(() => {
    // 1. Atualiza o atributo no HTML (ex: <html data-theme="dark">)
    document.documentElement.dataset.theme = theme;
    // 2. Salva a preferência no LocalStorage
    localStorage.setItem('app-theme', theme);
  }, [theme]);

  // Função para trocar o tema
  const toggleTheme = () => {
    setTheme((prevTheme) => (prevTheme === 'light' ? 'dark' : 'light'));
  };

  return (
    <ThemeContext.Provider value={{ theme, toggleTheme }}>
      {children}
    </ThemeContext.Provider>
  );
}

// 3. Cria o Hook customizado (para consumir o contexto)
export const useTheme = () => {
  const context = useContext(ThemeContext);
  if (context === undefined) {
    throw new Error('useTheme deve ser usado dentro de um ThemeProvider');
  }
  return context;
};