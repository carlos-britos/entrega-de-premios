import { useState, useRef, useEffect } from 'react';
import { motion } from 'framer-motion';
import './NomineeCard.css';

const isVideo = (path) => path.toLowerCase().match(/\.(mp4|webm|ogg)$/);

const NomineeCard = ({ nominee, isFullscreen, isRevealed, isWinner, winnerRevealed, onVideoEnd }) => {
  const [imageError, setImageError] = useState(false);
  const videoRef = useRef(null);

  // Construir ruta de imagen/video con el base path de Vite
  const getAssetPath = (path) => {
    if (!path) return undefined;
    return path.startsWith('/') ? `${import.meta.env.BASE_URL}${path.slice(1)}` : path;
  };

  const imageSrc = getAssetPath(nominee.image);
  const videoSrc = getAssetPath(nominee.video);

  const finalVideoSrc = videoSrc || (isVideo(imageSrc || '') ? imageSrc : undefined);
  // Solo usar poster si hay video explícito Y la imagen no es un video
  const finalPosterSrc = videoSrc && !isVideo(imageSrc || '') ? imageSrc : undefined;

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

  useEffect(() => {
    if (isFullscreen && videoRef.current) {
      videoRef.current.currentTime = 0;
      videoRef.current.play().catch(e => console.log("Autoplay failed", e));
    }
  }, [isFullscreen]);

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
            (finalVideoSrc && (isFullscreen || isVideo(imageSrc || ''))) ? (
              <video
                ref={videoRef}
                src={finalVideoSrc}
                poster={finalPosterSrc}
                className="nominee-image nominee-video"
                muted={false} 
                playsInline
                onEnded={onVideoEnd}
              />
            ) : (
              <img
                src={imageSrc}
                alt={nominee.name}
                className="nominee-image"
                onError={() => setImageError(true)}
              />
            )
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
