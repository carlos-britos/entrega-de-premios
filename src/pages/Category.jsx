import { useState, useEffect, useMemo } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import NomineeCard from '../components/NomineeCard';
import WinnerReveal from '../components/WinnerReveal';
import CategoryNav from '../components/CategoryNav';
import useConfetti from '../hooks/useConfetti';
import useAudio from '../hooks/useAudio';
import useRevealedCategories from '../hooks/useRevealedCategories';
import categoriesData from '../data/categories.json';
import './Category.css';

const Category = () => {
  const { categoryId } = useParams();
  const navigate = useNavigate();
  const { fireConfetti } = useConfetti();
  const { playDrumroll, playFanfare, playWhoosh } = useAudio();
  const { revealCategory } = useRevealedCategories();

  const [nomineesRevealed, setNomineesRevealed] = useState(false);
  const [winnerRevealed, setWinnerRevealed] = useState(false);

  const { categories } = categoriesData;
  
  const currentIndex = useMemo(() => 
    categories.findIndex((c) => c.id === categoryId),
    [categoryId, categories]
  );
  
  const category = categories[currentIndex];

  // Reset state cuando cambia la categoría
  useEffect(() => {
    setNomineesRevealed(false);
    setWinnerRevealed(false);
    playWhoosh();
  }, [categoryId, playWhoosh]);

  // Auto-revelar nominados después de un delay
  useEffect(() => {
    const timer = setTimeout(() => {
      setNomineesRevealed(true);
    }, 800);
    return () => clearTimeout(timer);
  }, [categoryId]);

  const handleRevealWinner = () => {
    playDrumroll();
    
    // Delay para el drumroll
    setTimeout(() => {
      setWinnerRevealed(true);
      revealCategory(categoryId); // Mark as revealed in localStorage
      playFanfare();
      fireConfetti();
    }, 1500);
  };

  if (!category) {
    return (
      <div className="category-page">
        <div className="category-error">
          <h2>Categoría no encontrada</h2>
          <button className="btn btn-primary" onClick={() => navigate('/')}>
            Volver al inicio
          </button>
        </div>
      </div>
    );
  }

  const winner = category.nominees.find((n) => n.id === category.winnerId);

  return (
    <div className="category-page">
      <div className="category-container">
        {/* Título de la categoría */}
        <motion.div
          className="category-header"
          key={category.id}
          initial={{ opacity: 0, y: -30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <span className="category-label">Categoría</span>
          <h1 className="category-title">{category.name}</h1>
        </motion.div>

        {/* Nominados */}
        <div className="nominees-section">
          <motion.h2
            className="nominees-title"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.4, duration: 0.6 }}
          >
            Los Nominados Son...
          </motion.h2>

          <div className="nominees-grid">
            {category.nominees.map((nominee, index) => (
              <NomineeCard
                key={nominee.id}
                nominee={nominee}
                index={index}
                isRevealed={nomineesRevealed}
                isWinner={nominee.id === category.winnerId}
                winnerRevealed={winnerRevealed}
              />
            ))}
          </div>
        </div>

        {/* Botón de revelar ganador */}
        <AnimatePresence>
          {nomineesRevealed && (
            <motion.div
              className="winner-section"
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              transition={{ delay: category.nominees.length * 0.15 + 0.5, duration: 0.6 }}
            >
              <WinnerReveal
                onReveal={handleRevealWinner}
                isDisabled={!nomineesRevealed}
                isRevealed={winnerRevealed}
              />
            </motion.div>
          )}
        </AnimatePresence>

        {/* Anuncio del ganador */}
        <AnimatePresence>
          {winnerRevealed && winner && (
            <motion.div
              className="winner-announcement"
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.5, duration: 0.8, type: 'spring' }}
            >
              <h2 className="winner-category">Ganador - {category.name}</h2>
              <motion.h3
                className="winner-name"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.8, duration: 0.6 }}
              >
                {winner.name}
              </motion.h3>
              <motion.p
                className="winner-info"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 1, duration: 0.6 }}
              >
                {winner.info}
              </motion.p>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Navegación */}
        <CategoryNav
          categories={categories}
          currentIndex={currentIndex}
        />
      </div>
    </div>
  );
};

export default Category;
