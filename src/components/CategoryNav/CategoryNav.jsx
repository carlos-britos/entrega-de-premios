import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import './CategoryNav.css';

const CategoryNav = ({ 
  categories, 
  currentIndex, 
  onPrevious, 
  onNext,
  showNavButtons = true 
}) => {
  const navigate = useNavigate();
  const hasPrevious = currentIndex > 0;
  const hasNext = currentIndex < categories.length - 1;

  const handlePrevious = () => {
    if (hasPrevious) {
      navigate(`/category/${categories[currentIndex - 1].id}`);
    }
  };

  const handleNext = () => {
    if (hasNext) {
      navigate(`/category/${categories[currentIndex + 1].id}`);
    }
  };

  return (
    <div className="category-nav">
      {showNavButtons && (
        <motion.button
          className={`nav-btn nav-prev ${!hasPrevious ? 'disabled' : ''}`}
          onClick={handlePrevious}
          disabled={!hasPrevious}
          whileHover={hasPrevious ? { scale: 1.1 } : {}}
          whileTap={hasPrevious ? { scale: 0.95 } : {}}
        >
          <span className="nav-arrow">←</span>
          <span className="nav-label">Anterior</span>
        </motion.button>
      )}

      <div className="category-progress">
        <span className="progress-text">
          {currentIndex + 1} de {categories.length}
        </span>
        <div className="progress-bar">
          <motion.div 
            className="progress-fill"
            initial={{ width: 0 }}
            animate={{ width: `${((currentIndex + 1) / categories.length) * 100}%` }}
            transition={{ duration: 0.5 }}
          />
        </div>
      </div>

      {showNavButtons && (
        <motion.button
          className={`nav-btn nav-next ${!hasNext ? 'disabled' : ''}`}
          onClick={handleNext}
          disabled={!hasNext}
          whileHover={hasNext ? { scale: 1.1 } : {}}
          whileTap={hasNext ? { scale: 0.95 } : {}}
        >
          <span className="nav-label">Siguiente</span>
          <span className="nav-arrow">→</span>
        </motion.button>
      )}
    </div>
  );
};

export default CategoryNav;
