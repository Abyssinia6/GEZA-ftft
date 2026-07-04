import { createContext, useContext, useEffect, useState } from "react";
import type { ReactNode } from "react";

type Theme = "light" | "dark" | "night";

interface ThemeContextType {
  theme: Theme;
  setTheme: (t: Theme) => void;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export const ThemeProvider = ({ children }: { children: ReactNode }) => {
  const [theme, setTheme] = useState<Theme>(
    () => (localStorage.getItem("geza-theme") as Theme) || "light"
  );

  useEffect(() => {
    const root = window.document.documentElement;
    root.classList.remove("light", "dark", "night");
    root.classList.add(theme);
    localStorage.setItem("geza-theme", theme);
  }, [theme]);

  return (
    <ThemeContext.Provider value={{ theme, setTheme }}>
      {children}
    </ThemeContext.Provider>
  );
};

export const useTheme = () => {
  const ctx = useContext(ThemeContext);
  if (!ctx) throw new Error("useTheme must be used within ThemeProvider");
  return ctx;
};