import { createContext, useContext } from 'react';

const ParticlesContext = createContext();

export const ParticlesProvider = ({ children }) => {
  // Placeholder for future particle controls if needed
  const burst = () => {};

  return (
    <ParticlesContext.Provider value={{ speedMultiplier: 1, burst }}>
      {children}
    </ParticlesContext.Provider>
  );
};

export const useParticles = () => {
  const context = useContext(ParticlesContext);
  if (!context) {
    return { speedMultiplier: 1, burst: () => {} };
  }
  return context;
};

