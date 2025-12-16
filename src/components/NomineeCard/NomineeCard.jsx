import { useState } from 'react';
import { motion } from 'framer-motion';
import './NomineeCard.css';

const NomineeCard = ({ nominee, isFullscreen, isRevealed, isFadedOut, isWinner, winnerRevealed }) => {
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
    if (isFadedOut) return 0;
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
          {isWinner && winnerRevealed && (
            <motion.div
              className="winner-badge"
              initial={{ scale: 0, rotate: -180 }}
              animate={{ scale: 1, rotate: 0 }}
              transition={{ delay: 0.5, duration: 0.6, type: 'spring' }}
            >
              <span className="trophy-icon">🏆</span>
              <span className="winner-text">GANADOR</span>
            </motion.div>
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
