import { createContext, useContext } from 'react';

export const ThemeCtx = createContext({ isDark: true, toggle: () => {} });
export const useTheme = () => useContext(ThemeCtx);
