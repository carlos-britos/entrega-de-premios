import { useState, useEffect, useMemo, useCallback } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import NomineeCard from '../components/NomineeCard';
import WinnerReveal from '../components/WinnerReveal';
import useConfetti from '../hooks/useConfetti';
import useAudio from '../hooks/useAudio';
import useRevealedCategories from '../hooks/useRevealedCategories';
import categoriesData from '../data/categories.json';
import oscarImage from '/Oscar.webp';
import './Category.css';

const isVideo = (path) => {
  return path.toLowerCase().match(/\.(mp4|webm|ogg)$/);
};

const Category = () => {
  const { categoryId } = useParams();
  const navigate = useNavigate();
  const { fireConfetti } = useConfetti();
  const { playDrumroll, playFanfare, playWhoosh } = useAudio();
  const { revealCategory } = useRevealedCategories();

  const [fullscreenIndex, setFullscreenIndex] = useState(-1); // Fase 1: pantalla completa
  const [currentRevealIndex, setCurrentRevealIndex] = useState(-1); // Fase 2: fade secuencial
  const [animationPhase, setAnimationPhase] = useState('fullscreen'); // 'fullscreen' | 'sequential' | 'fadeOut' | 'fadeIn' | 'complete'
  const [winnerRevealed, setWinnerRevealed] = useState(false);

  const { categories } = categoriesData;
  
  const currentIndex = useMemo(() => 
    categories.findIndex((c) => c.id === categoryId),
    [categoryId, categories]
  );
  
  const category = categories[currentIndex];

  // Reset state cuando cambia la categoría
  useEffect(() => {
    setFullscreenIndex(-1);
    setCurrentRevealIndex(-1);
    setAnimationPhase('fullscreen');
    setWinnerRevealed(false);
    playWhoosh();
  }, [categoryId, playWhoosh]);

  // Secuencia de animación de nominados
  useEffect(() => {
    const totalNominees = category?.nominees?.length || 0;

    // FASE 1: Mostrar cada nominado en pantalla completa
    if (animationPhase === 'fullscreen') {
      // DEBUG: Pausar en el primer nominado
      // if (fullscreenIndex === 0) return;

      const currentNominee = category?.nominees?.[fullscreenIndex];
      const isCurrentVideo = currentNominee && (!!currentNominee.video || isVideo(currentNominee.image));

      // Si es video, NO usamos timer. Esperamos al evento onEnded.
      if (isCurrentVideo) return;

      const timer = setTimeout(() => {
        if (fullscreenIndex < totalNominees - 1) {
          setFullscreenIndex(prev => prev + 1);
        } else {
          // Terminó fullscreen, pasar a fase secuencial
          setAnimationPhase('sequential');
          setCurrentRevealIndex(-1);
        }
      }, fullscreenIndex === -1 ? 500 : 2000);
      return () => clearTimeout(timer);
    }

    // FASE 2: Revelar uno por uno con fade
    if (animationPhase === 'sequential' && currentRevealIndex < totalNominees - 1) {
      const timer = setTimeout(() => {
        setCurrentRevealIndex(prev => prev + 1);
      }, currentRevealIndex === -1 ? 150 : 100);
      return () => clearTimeout(timer);
    }

    // Después del último: marcar como completo
    if (animationPhase === 'sequential' && currentRevealIndex === totalNominees - 1) {
      const timer = setTimeout(() => {
        setAnimationPhase('complete');
      }, 100);
      return () => clearTimeout(timer);
    }
  }, [fullscreenIndex, currentRevealIndex, animationPhase, category]);

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

  const handleVideoEnd = useCallback(() => {
    if (animationPhase === 'fullscreen') {
      const totalNominees = category?.nominees?.length || 0;
      if (fullscreenIndex < totalNominees - 1) {
        setFullscreenIndex(prev => prev + 1);
      } else {
         // Terminó fullscreen, pasar a fase secuencial
         setAnimationPhase('sequential');
         setCurrentRevealIndex(-1);
      }
    }
  }, [animationPhase, fullscreenIndex, category]);

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
                isFullscreen={animationPhase === 'fullscreen' && index === fullscreenIndex}
                isRevealed={animationPhase !== 'fullscreen' && (index <= currentRevealIndex || animationPhase === 'complete')}
                isWinner={nominee.id === category.winnerId}
                winnerRevealed={winnerRevealed}
                onVideoEnd={handleVideoEnd}
              />
            ))}
          </div>
        </div>

        {/* Botón de revelar ganador */}
        <AnimatePresence>
          {animationPhase === 'complete' && (
            <motion.div
              className="winner-section"
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              transition={{ delay: 0.3, duration: 0.6 }}
            >
              <WinnerReveal
                onReveal={handleRevealWinner}
                isDisabled={false}
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
              <motion.img
                src={oscarImage}
                alt="Oscar Statue"
                className="trophy-icon"
                initial={{ scale: 0, opacity: 0, y: 50 }}
                animate={{ scale: 1, opacity: 1, y: 0 }}
                transition={{
                  delay: 0.3,
                  duration: 1.2,
                  ease: [0.22, 1, 0.36, 1]
                }}
              />
              <motion.h3
                className="winner-name"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.8, duration: 0.6 }}
              >
                {winner.name}
              </motion.h3>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Botón volver */}
        <motion.button
          className="back-to-categories-btn"
          onClick={() => navigate('/categories')}
          initial={{ opacity: 0 }}
          animate={{ opacity: 0.5 }}
          whileHover={{ opacity: 1, scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          transition={{ duration: 0.3 }}
        >
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <polyline points="15 18 9 12 15 6" />
          </svg>
        </motion.button>
      </div>
    </div>
  );
};

export default Category;
