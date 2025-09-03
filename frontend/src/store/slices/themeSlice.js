import { createSlice } from '@reduxjs/toolkit';

const getInitialTheme = () => {
  // Check localStorage first
  const savedTheme = localStorage.getItem('theme');
  if (savedTheme) {
    return savedTheme;
  }
  
  // Check system preference
  if (window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches) {
    return 'dark';
  }
  
  return 'light';
};

const initialState = {
  theme: getInitialTheme(),
};

const themeSlice = createSlice({
  name: 'theme',
  initialState,
  reducers: {
    setTheme: (state, action) => {
      state.theme = action.payload;
      // Update document attribute for CSS variables
      document.documentElement.setAttribute('data-theme', action.payload);
      // Save to localStorage
      localStorage.setItem('theme', action.payload);
    },
    
    toggleTheme: (state) => {
      const newTheme = state.theme === 'light' ? 'dark' : 'light';
      state.theme = newTheme;
      // Update document attribute for CSS variables
      document.documentElement.setAttribute('data-theme', newTheme);
      // Save to localStorage
      localStorage.setItem('theme', newTheme);
    },

    // Action to handle system theme changes
    setSystemTheme: (state, action) => {
      // Only update if user hasn't manually set a theme
      if (!localStorage.getItem('theme')) {
        state.theme = action.payload;
        document.documentElement.setAttribute('data-theme', action.payload);
      }
    },
  },
});

export const { setTheme, toggleTheme, setSystemTheme } = themeSlice.actions;

// Selectors
export const selectTheme = (state) => state.theme.theme;
export const selectIsDark = (state) => state.theme.theme === 'dark';
export const selectIsLight = (state) => state.theme.theme === 'light';

// Thunk to initialize theme system listener
export const initializeThemeListener = () => (dispatch) => {
  // Set initial theme
  const theme = getInitialTheme();
  document.documentElement.setAttribute('data-theme', theme);
  
  // Listen for system theme changes
  const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
  
  const handleChange = (e) => {
    if (!localStorage.getItem('theme')) {
      // Only auto-switch if user hasn't manually set a theme
      dispatch(setSystemTheme(e.matches ? 'dark' : 'light'));
    }
  };

  mediaQuery.addEventListener('change', handleChange);
  
  // Return cleanup function
  return () => mediaQuery.removeEventListener('change', handleChange);
};

export default themeSlice.reducer;
