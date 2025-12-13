import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import './NomineeCard.css';

const NomineeCard = ({ nominee, index, isRevealed, isWinner, winnerRevealed }) => {
  const [imageError, setImageError] = useState(false);

  const cardVariants = {
    hidden: {
      opacity: 0,
      y: 50,
      scale: 0.8,
    },
    visible: {
      opacity: 1,
      y: 0,
      scale: 1,
      transition: {
        duration: 0.6,
        delay: index * 0.15,
        ease: [0.22, 1, 0.36, 1],
      },
    },
    exit: {
      opacity: 0,
      scale: 0.8,
      transition: {
        duration: 0.4,
      },
    },
  };

  const winnerVariants = {
    normal: {
      scale: 1,
    },
    winner: {
      scale: 1.15,
      transition: {
        duration: 0.8,
        ease: [0.22, 1, 0.36, 1],
      },
    },
  };

  const loserVariants = {
    normal: {
      opacity: 1,
      filter: 'brightness(1)',
    },
    loser: {
      opacity: 0.3,
      filter: 'brightness(0.5)',
      transition: {
        duration: 0.8,
      },
    },
  };

  const getCardState = () => {
    if (!winnerRevealed) return 'normal';
    return isWinner ? 'winner' : 'loser';
  };

  return (
    <AnimatePresence>
      {isRevealed && (
        <motion.div
          className={`nominee-card ${isWinner && winnerRevealed ? 'is-winner' : ''} ${!isWinner && winnerRevealed ? 'is-loser' : ''}`}
          variants={cardVariants}
          initial="hidden"
          animate="visible"
          exit="exit"
          layout
        >
          <motion.div
            className="nominee-card-inner"
            variants={isWinner ? winnerVariants : loserVariants}
            animate={getCardState()}
          >
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
              <p className="nominee-detail">{nominee.info}</p>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default NomineeCard;
