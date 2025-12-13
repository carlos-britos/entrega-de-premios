import { useEffect, useState, useMemo } from 'react';
import Particles, { initParticlesEngine } from '@tsparticles/react';
import { loadSlim } from '@tsparticles/slim';
import { useParticles } from '../../context/ParticlesContext';

const ParticlesBackground = () => {
  const [init, setInit] = useState(false);
  const { speedMultiplier } = useParticles();

  useEffect(() => {
    initParticlesEngine(async (engine) => {
      await loadSlim(engine);
    }).then(() => {
      setInit(true);
    });
  }, []);

  // Configuration with dynamic speed
  const options = useMemo(() => ({
    background: {
      color: { value: 'transparent' },
    },
    fullScreen: { enable: false },
    fpsLimit: 120,
    particles: {
      color: { value: '#D4AF37' },
      move: {
        enable: true,
        direction: 'top',
        speed: 2 * speedMultiplier,
        outModes: {
          default: 'out',
        },
        random: true,
        straight: false,
      },
      number: {
        value: 60,
        density: {
          enable: true,
          area: 1000,
        },
      },
      opacity: {
        value: { min: 0.1, max: speedMultiplier > 1 ? 0.6 : 0.4 },
        animation: {
          enable: true,
          speed: 0.5 * speedMultiplier,
          sync: false,
        },
      },
      shape: {
        type: 'circle',
      },
      size: {
        value: { min: 0.2, max: 4 },
      },
    },
    detectRetina: true,
  }), [speedMultiplier]);

  if (!init) {
    return null;
  }

  return (
    <Particles
      id="tsparticles"
      options={options}
    />
  );
};

export default ParticlesBackground;
