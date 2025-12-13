import { useState, useEffect, useRef, useCallback } from 'react';
import { Howl } from 'howler';

const useAudio = () => {
  const [isMuted, setIsMuted] = useState(true);
  const [isLoaded, setIsLoaded] = useState(false);
  const backgroundMusicRef = useRef(null);
  const soundEffectsRef = useRef({});

  // Inicializar música de fondo (opcional - el usuario puede agregar archivos)
  useEffect(() => {
    // Intentar cargar música de fondo si existe
    backgroundMusicRef.current = new Howl({
      src: ['/audio/background.mp3'],
      loop: true,
      volume: 0.3,
      onload: () => setIsLoaded(true),
      onloaderror: () => {
        console.log('No background music loaded - add /public/audio/background.mp3');
        setIsLoaded(true);
      },
    });

    // Cargar efectos de sonido
    soundEffectsRef.current = {
      drumroll: new Howl({
        src: ['/audio/drumroll.mp3'],
        volume: 0.5,
        onloaderror: () => console.log('Drumroll sound not found'),
      }),
      fanfare: new Howl({
        src: ['/audio/fanfare.mp3'],
        volume: 0.6,
        onloaderror: () => console.log('Fanfare sound not found'),
      }),
      whoosh: new Howl({
        src: ['/audio/whoosh.mp3'],
        volume: 0.4,
        onloaderror: () => console.log('Whoosh sound not found'),
      }),
    };

    return () => {
      if (backgroundMusicRef.current) {
        backgroundMusicRef.current.unload();
      }
      Object.values(soundEffectsRef.current).forEach((sound) => sound.unload());
    };
  }, []);

  const toggleMute = useCallback(() => {
    setIsMuted((prev) => {
      const newMuted = !prev;
      if (backgroundMusicRef.current) {
        if (newMuted) {
          backgroundMusicRef.current.pause();
        } else {
          backgroundMusicRef.current.play();
        }
      }
      return newMuted;
    });
  }, []);

  const playSound = useCallback((soundName) => {
    if (isMuted) return;
    const sound = soundEffectsRef.current[soundName];
    if (sound) {
      sound.play();
    }
  }, [isMuted]);

  const playDrumroll = useCallback(() => playSound('drumroll'), [playSound]);
  const playFanfare = useCallback(() => playSound('fanfare'), [playSound]);
  const playWhoosh = useCallback(() => playSound('whoosh'), [playSound]);

  return {
    isMuted,
    isLoaded,
    toggleMute,
    playDrumroll,
    playFanfare,
    playWhoosh,
  };
};

export default useAudio;
