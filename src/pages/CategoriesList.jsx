import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import useRevealedCategories from '../hooks/useRevealedCategories';
import { useParticles } from '../context/ParticlesContext';
import categoriesData from '../data/categories.json';
import './CategoriesList.css';

const CategoriesList = () => {
  const navigate = useNavigate();
  const { categories } = categoriesData;
  const { isRevealed } = useRevealedCategories();
  const { burst } = useParticles();
  
  // Track which winner names are visible (toggled by click)
  const [visibleWinners, setVisibleWinners] = useState({});

  const toggleWinnerVisibility = (categoryId, e) => {
    e.stopPropagation();
    setVisibleWinners((prev) => ({
      ...prev,
      [categoryId]: !prev[categoryId],
    }));
  };

  const handleCategoryClick = (categoryId) => {
    burst();
    navigate(`/category/${categoryId}`);
  };

  const getWinnerName = (category) => {
    const winner = category.nominees.find((n) => n.id === category.winnerId);
    return winner ? winner.name : 'Desconocido';
  };

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.08,
      },
    },
  };

  const cardVariants = {
    hidden: { opacity: 0, y: 30, scale: 0.95 },
    visible: {
      opacity: 1,
      y: 0,
      scale: 1,
      transition: {
        duration: 0.5,
        ease: [0.22, 1, 0.36, 1],
      },
    },
  };

  return (
    <div className="categories-list-page">
      
      <div className="stage-light" />

      <div className="categories-list-content">
        <motion.div
          className="categories-list-header"
          initial={{ opacity: 0, y: -30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
        >
          <h1 className="categories-list-title">Categorías</h1>
          <p className="categories-list-subtitle">
            {categories.filter((c) => isRevealed(c.id)).length} de {categories.length} reveladas
          </p>
        </motion.div>

        <motion.div
          className="categories-grid"
          variants={containerVariants}
          initial="hidden"
          animate="visible"
        >
          {categories.map((category) => {
            const revealed = isRevealed(category.id);
            const winnerVisible = visibleWinners[category.id] !== false; // Default to visible

            return (
              <motion.div
                key={category.id}
                className={`category-card ${revealed ? 'revealed' : ''}`}
                variants={cardVariants}
                onClick={() => handleCategoryClick(category.id)}
              >
                <div className="category-card-content">
                  <h3 className="category-card-name">{category.name}</h3>
                  
                  {revealed && (
                    <div className="category-card-winner">
                      <span className="winner-label">Ganador</span>
                      <button
                        className={`winner-name ${!winnerVisible ? 'hidden' : ''}`}
                        onClick={(e) => toggleWinnerVisibility(category.id, e)}
                        title={winnerVisible ? 'Click para ocultar' : 'Click para mostrar'}
                      >
                        {winnerVisible ? getWinnerName(category) : '••••••••'}
                      </button>
                    </div>
                  )}
                  
                  {!revealed && (
                    <div className="category-card-pending">
                      <span className="pending-icon">🎬</span>
                      <span className="pending-text">Por revelar</span>
                    </div>
                  )}
                </div>

                {revealed && <div className="revealed-badge">✓</div>}
              </motion.div>
            );
          })}
        </motion.div>
      </div>
    </div>
  );
};

export default CategoriesList;
