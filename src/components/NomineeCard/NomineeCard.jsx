import { useState } from 'react';
import { motion } from 'framer-motion';
import './NomineeCard.css';

const NomineeCard = ({ nominee, isFullscreen, isRevealed, isWinner, winnerRevealed }) => {
  const [imageError, setImageError] = useState(false);

  // Determinar qué clase aplicar según el estado
  const getCardClasses = () => {
    const classes = ['nominee-card'];
    if (isFullscreen) classes.push('is-fullscreen');
    if (isWinner && winnerRevealed) classes.push('is-winner');
    if (!isWinner && winnerRevealed) classes.push('is-loser');
    return classes.join(' ');
  };

  // Calcular opacity según el estado
  const getOpacity = () => {
    if (isFullscreen) return 1;
    if (!isRevealed) return 0;
    return 1;
  };

  return (
    <motion.div
      className={getCardClasses()}
      initial={{ opacity: 0 }}
      animate={{ opacity: getOpacity() }}
      transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
      layout
    >
      <div className="nominee-card-inner">
        <div className="nominee-image-container">
          {!imageError ? (
            <img
              src={nominee.image}
              alt={nominee.name}
              className="nominee-image"
              onError={() => setImageError(true)}
            />
          ) : (
            <div className="nominee-image-placeholder">
              <span className="placeholder-icon">🎬</span>
            </div>
          )}
        </div>
        <div className="nominee-info">
          <h3 className="nominee-name">{nominee.name}</h3>
        </div>
      </div>
    </motion.div>
  );
};

export default NomineeCard;
