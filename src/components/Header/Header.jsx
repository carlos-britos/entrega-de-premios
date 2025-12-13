import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import useRevealedCategories from '../../hooks/useRevealedCategories';
import './Header.css';

const Header = ({ eventTitle, eventYear }) => {
  const navigate = useNavigate();
  const { resetAll } = useRevealedCategories();
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const handleMouseMove = (e) => {
      // Show header when mouse is in top 100px of the page
      setIsVisible(e.clientY <= 100);
    };

    window.addEventListener('mousemove', handleMouseMove);
    
    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
    };
  }, []);

  const handleReset = () => {
    resetAll();
    navigate('/');
  };

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.header 
          className="header"
          initial={{ y: -100, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: -100, opacity: 0 }}
          transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
        >
          <div className="header-container">
            <Link to="/" className="header-logo">
              <span className="logo-icon">🏆</span>
              <div className="logo-text">
                <h1 className="logo-title">{eventTitle || 'Los Premios'}</h1>
                <span className="logo-year">{eventYear || '2024'}</span>
              </div>
            </Link>
            
            <nav className="header-nav">
              <Link to="/" className="nav-link">
                Inicio
              </Link>
              <Link to="/categories" className="nav-link">
                Categorías
              </Link>
              <button className="reset-btn" onClick={handleReset} title="Reiniciar ceremonia">
                <span className="reset-icon">↺</span>
                <span className="reset-text">Resetear</span>
              </button>
            </nav>
          </div>
        </motion.header>
      )}
    </AnimatePresence>
  );
};

export default Header;

