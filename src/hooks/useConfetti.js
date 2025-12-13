import { useCallback } from 'react';
import confetti from 'canvas-confetti';

const useConfetti = () => {
  const fireConfetti = useCallback(() => {
    // Colores dorados para el confetti
    const goldColors = ['#D4AF37', '#F4E4A1', '#9A7B0A', '#FFD700', '#FFF8DC'];

    // Primera explosión desde la izquierda
    confetti({
      particleCount: 100,
      spread: 70,
      origin: { x: 0.2, y: 0.6 },
      colors: goldColors,
      shapes: ['square', 'circle'],
      scalar: 1.2,
    });

    // Segunda explosión desde la derecha
    confetti({
      particleCount: 100,
      spread: 70,
      origin: { x: 0.8, y: 0.6 },
      colors: goldColors,
      shapes: ['square', 'circle'],
      scalar: 1.2,
    });

    // Explosión central con delay
    setTimeout(() => {
      confetti({
        particleCount: 150,
        spread: 100,
        origin: { x: 0.5, y: 0.5 },
        colors: goldColors,
        shapes: ['square', 'circle'],
        scalar: 1.5,
        drift: 0,
      });
    }, 200);

    // Lluvia continua de confetti
    const duration = 3000;
    const end = Date.now() + duration;

    const frame = () => {
      confetti({
        particleCount: 2,
        angle: 60,
        spread: 55,
        origin: { x: 0 },
        colors: goldColors,
      });
      confetti({
        particleCount: 2,
        angle: 120,
        spread: 55,
        origin: { x: 1 },
        colors: goldColors,
      });

      if (Date.now() < end) {
        requestAnimationFrame(frame);
      }
    };

    frame();
  }, []);

  return { fireConfetti };
};

export default useConfetti;
