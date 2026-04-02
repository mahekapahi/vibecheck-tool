import { createContext, useContext, useState, ReactNode } from "react";

type ThemeMode = "shop" | "luxe";

interface ThemeContextType {
  mode: ThemeMode;
  setMode: (m: ThemeMode) => void;
  isLuxe: boolean;
}

const ThemeContext = createContext<ThemeContextType>({
  mode: "shop",
  setMode: () => {},
  isLuxe: false,
});

export const useThemeMode = () => useContext(ThemeContext);

export const ThemeModeProvider = ({ children }: { children: ReactNode }) => {
  const [mode, setMode] = useState<ThemeMode>("shop");

  return (
    <ThemeContext.Provider value={{ mode, setMode, isLuxe: mode === "luxe" }}>
      <div className={mode === "luxe" ? "luxe-theme" : ""}>{children}</div>
    </ThemeContext.Provider>
  );
};
