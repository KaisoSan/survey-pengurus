import confetti from 'canvas-confetti';

export const fireWarmConfetti = () => {
  // Gentle warm celebration for the welcome screen
  confetti({
    particleCount: 50,
    spread: 60,
    origin: { y: 0.6 },
    colors: ['#F59E0B', '#FCD34D', '#F472B6', '#FBBF24', '#FED7AA'],
    ticks: 200,
    gravity: 0.8,
    scalar: 0.9,
    disableForReducedMotion: true,
  });
};

export const fireCelebrationConfetti = () => {
  // Multi-stage celebratory confetti for survey submission
  const count = 200;
  const defaults = {
    origin: { y: 0.7 },
    colors: ['#F59E0B', '#FBBF24', '#34D399', '#60A5FA', '#F472B6', '#FFFBEB'],
    disableForReducedMotion: true,
  };

  const fire = (particleRatio: number, opts: confetti.Options) => {
    confetti({
      ...defaults,
      ...opts,
      particleCount: Math.floor(count * particleRatio),
    });
  };

  fire(0.25, {
    spread: 26,
    startVelocity: 55,
  });
  fire(0.2, {
    spread: 60,
  });
  fire(0.35, {
    spread: 100,
    decay: 0.91,
    scalar: 0.8,
  });
  fire(0.1, {
    spread: 120,
    startVelocity: 25,
    decay: 0.92,
    scalar: 1.2,
  });
  fire(0.1, {
    spread: 120,
    startVelocity: 45,
  });
};
