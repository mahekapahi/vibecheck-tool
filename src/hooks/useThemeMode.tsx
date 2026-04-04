import { createContext, useContext, useState, ReactNode } from "react";
import { useLocation } from "react-router-dom";

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
  const location = useLocation();

  // Only apply the luxe-theme CSS class when on the /auctions page
  const isOnShopPage = location.pathname === "/auctions";
  const applyLuxe = mode === "luxe" && isOnShopPage;

  return (
    <ThemeContext.Provider value={{ mode, setMode, isLuxe: applyLuxe }}>
      <div className={applyLuxe ? "luxe-theme" : ""}>{children}</div>
    </ThemeContext.Provider>
  );
};
