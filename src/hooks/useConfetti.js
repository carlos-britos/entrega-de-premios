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

    // Explosión central desde abajo
    setTimeout(() => {
      confetti({
        particleCount: 150,
        spread: 70,
        origin: { x: 0.5, y: 1.2 },
        angle: 90,
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
      // Desde la izquierda
      confetti({
        particleCount: 2,
        angle: 60,
        spread: 55,
        origin: { x: 0 },
        colors: goldColors,
      });
      // Desde la derecha
      confetti({
        particleCount: 2,
        angle: 120,
        spread: 55,
        origin: { x: 1 },
        colors: goldColors,
      });
      // Desde abajo (centro)
      confetti({
        particleCount: 3,
        angle: 90,
        spread: 60,
        origin: { x: 0.5, y: 1.2 },
        colors: goldColors,
        scalar: 1.5,
      });
      // Desde abajo (centro)
      confetti({
        particleCount: 3,
        angle: 90,
        spread: 60,
        origin: { x: 0.25, y: 1.2 },
        colors: goldColors,
        scalar: 1.5,
      });
      // Desde abajo (centro)
      confetti({
        particleCount: 3,
        angle: 90,
        spread: 60,
        origin: { x: 0.75, y: 1.2 },
        colors: goldColors,
        scalar: 1.5,
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
