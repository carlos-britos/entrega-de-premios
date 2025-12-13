import { motion } from 'framer-motion';
import './WinnerReveal.css';

const WinnerReveal = ({ onReveal, isDisabled, isRevealed }) => {
  return (
    <motion.button
      className={`winner-reveal-btn ${isRevealed ? 'revealed' : ''}`}
      onClick={onReveal}
      disabled={isDisabled || isRevealed}
      whileHover={!isDisabled && !isRevealed ? { scale: 1.05 } : {}}
      whileTap={!isDisabled && !isRevealed ? { scale: 0.98 } : {}}
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.8, duration: 0.6 }}
    >
      {isRevealed ? (
        <motion.span
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="btn-text"
        >
          ¡Felicitaciones!
        </motion.span>
      ) : (
        <>
          <span className="btn-icon">🏆</span>
          <span className="btn-text">Y el ganador es...</span>
        </>
      )}
    </motion.button>
  );
};

export default WinnerReveal;
