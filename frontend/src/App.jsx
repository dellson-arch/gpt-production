import { useEffect } from 'react';
import { useAppDispatch } from './store/hooks';
import { initializeThemeListener } from './store/slices/themeSlice';
import Approutes from './Approutes';

const App = () => {
  const dispatch = useAppDispatch();

  useEffect(() => {
    // Initialize theme listener
    const cleanup = dispatch(initializeThemeListener());
    
    // Cleanup function
    return () => {
      if (cleanup) cleanup();
    };
  }, [dispatch]);

  return (
    <Approutes/>
  );
};

export default App;
