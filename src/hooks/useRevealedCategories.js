import { useState, useEffect, useCallback } from 'react';

const STORAGE_KEY = 'oscars-revealed-categories';

const useRevealedCategories = () => {
  const [revealedCategories, setRevealedCategories] = useState(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      return stored ? JSON.parse(stored) : [];
    } catch {
      return [];
    }
  });

  // Sync to localStorage whenever state changes
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(revealedCategories));
    } catch (error) {
      console.error('Failed to save to localStorage:', error);
    }
  }, [revealedCategories]);

  const revealCategory = useCallback((categoryId) => {
    setRevealedCategories((prev) => {
      if (prev.includes(categoryId)) {
        return prev;
      }
      return [...prev, categoryId];
    });
  }, []);

  const isRevealed = useCallback(
    (categoryId) => revealedCategories.includes(categoryId),
    [revealedCategories]
  );

  const resetAll = useCallback(() => {
    setRevealedCategories([]);
    try {
      localStorage.removeItem(STORAGE_KEY);
    } catch (error) {
      console.error('Failed to clear localStorage:', error);
    }
  }, []);

  return {
    revealedCategories,
    revealCategory,
    isRevealed,
    resetAll,
  };
};

export default useRevealedCategories;
