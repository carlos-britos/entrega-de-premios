import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useParticles } from '../context/ParticlesContext';
import categoriesData from '../data/categories.json';
import './Home.css';

const Home = () => {
  const navigate = useNavigate();
  const { burst } = useParticles();
  const { eventTitle, eventYear, categories } = categoriesData;

  const handleStart = () => {
    burst();
    navigate('/categories');
  };

  return (
    <div className="home-page">
      {/* Iluminación desde abajo */}
      <div className="stage-light" />

      {/* Contenido principal */}
      <div className="home-content">
        <motion.div
          className="home-hero"
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, ease: [0.22, 1, 0.36, 1] }}
        >
        <motion.div
          className="oscar-container"
          initial={{ scale: 0, rotateY: -180 }}
          animate={{ scale: 1, rotateY: 0 }}
          transition={{ delay: 0.5, duration: 1.2, type: 'spring', stiffness: 80 }}
        >
          <img 
            src="/Oscar.webp" 
            alt="Oscar Statue" 
            className="oscar-statue"
          />
        </motion.div>

          <motion.h1
            className="home-title"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.8, duration: 0.8 }}
          >
            {eventTitle}
          </motion.h1>

          <motion.div
            className="home-year"
            initial={{ opacity: 0, scale: 0.5 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 1, duration: 0.6 }}
          >
            {eventYear}
          </motion.div>

          <motion.p
            className="home-subtitle"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1.2, duration: 0.8 }}
          >
            {categories.length} categorías • La noche más glamorosa del año
          </motion.p>

          <motion.button
            className="btn btn-primary home-cta"
            onClick={handleStart}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 1.5, duration: 0.6 }}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.98 }}
          >
            Comenzar Ceremonia
          </motion.button>
        </motion.div>
      </div>
    </div>
  );
};

export default Home;
