import React, { useMemo } from 'react';

interface CelestialSkyProps {
  reducedMotion?: boolean;
}

export const CelestialSky: React.FC<CelestialSkyProps> = ({ reducedMotion = false }) => {
  // Pre-calculated harmonious coordinates for sparse, subtle stars (not noisy or overwhelming)
  const stars = useMemo(() => {
    return [
      { x: 12, y: 8, size: 1.5, opacity: 0.5, delay: 0, duration: 5 },
      { x: 28, y: 14, size: 2, opacity: 0.7, delay: 1.2, duration: 6 },
      { x: 42, y: 6, size: 1, opacity: 0.4, delay: 2.1, duration: 4.5 },
      { x: 68, y: 11, size: 1.8, opacity: 0.6, delay: 0.8, duration: 5.5 },
      { x: 84, y: 16, size: 1.2, opacity: 0.45, delay: 2.7, duration: 6.2 },
      { x: 92, y: 9, size: 2, opacity: 0.65, delay: 1.5, duration: 4.8 },
      { x: 8, y: 26, size: 1.2, opacity: 0.35, delay: 3.1, duration: 5.2 },
      { x: 22, y: 34, size: 1.5, opacity: 0.5, delay: 0.4, duration: 6 },
      { x: 78, y: 28, size: 1.4, opacity: 0.4, delay: 1.9, duration: 5.8 },
      { x: 89, y: 39, size: 1.6, opacity: 0.55, delay: 2.4, duration: 4.9 },
      { x: 15, y: 52, size: 1, opacity: 0.3, delay: 1.1, duration: 5.5 },
      { x: 34, y: 48, size: 1.2, opacity: 0.4, delay: 3.5, duration: 6.5 },
      { x: 64, y: 56, size: 1.5, opacity: 0.35, delay: 0.7, duration: 5.1 },
      { x: 82, y: 64, size: 1.2, opacity: 0.4, delay: 2.2, duration: 6 },
      { x: 94, y: 72, size: 1.4, opacity: 0.45, delay: 1.6, duration: 5.4 },
      { x: 10, y: 78, size: 1.5, opacity: 0.3, delay: 2.8, duration: 5.7 },
      { x: 27, y: 84, size: 1.2, opacity: 0.35, delay: 0.3, duration: 6.3 },
      { x: 50, y: 88, size: 1, opacity: 0.25, delay: 1.8, duration: 4.7 },
      { x: 74, y: 82, size: 1.6, opacity: 0.45, delay: 3.0, duration: 5.6 },
      { x: 88, y: 91, size: 1.2, opacity: 0.3, delay: 0.9, duration: 6.1 },
    ];
  }, []);

  return (
    <div
      className="fixed inset-0 pointer-events-none overflow-hidden select-none z-0"
      aria-hidden="true"
    >
      {/* Deep midnight ambient gradient */}
      <div
        className="absolute inset-0"
        style={{
          background:
            'radial-gradient(circle at 50% 18%, #141B29 0%, #0D131F 45%, #0B1019 100%)',
        }}
      />

      {/* Sparse subtle stars */}
      {stars.map((star, idx) => (
        <div
          key={idx}
          className={`absolute rounded-full bg-[#E5E9F2] ${
            reducedMotion ? '' : 'animate-star-pulse'
          }`}
          style={{
            left: `${star.x}%`,
            top: `${star.y}%`,
            width: `${star.size}px`,
            height: `${star.size}px`,
            opacity: star.opacity,
            // @ts-expect-error custom CSS property
            '--pulse-duration': `${star.duration}s`,
            animationDelay: `${star.delay}s`,
          }}
        />
      ))}

      {/* Softly illuminated crescent moon */}
      <div className="absolute top-6 right-6 sm:top-10 sm:right-12 md:top-14 md:right-20">
        <div
          className={`relative w-12 h-12 sm:w-16 sm:h-16 flex items-center justify-center ${
            reducedMotion ? '' : 'animate-moon-breathe'
          }`}
        >
          {/* Outer soft lunar glow */}
          <div
            className="absolute -inset-4 sm:-inset-6 rounded-full blur-xl pointer-events-none"
            style={{
              background:
                'radial-gradient(circle, rgba(170, 160, 200, 0.2) 0%, rgba(170, 160, 200, 0.05) 50%, transparent 75%)',
            }}
          />

          {/* SVG Crescent Moon */}
          <svg
            viewBox="0 0 64 64"
            className="w-10 h-10 sm:w-14 sm:h-14 drop-shadow-[0_0_12px_rgba(244,239,231,0.35)]"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <defs>
              <linearGradient id="moonGlowGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#FFFFFF" stopOpacity="0.95" />
                <stop offset="40%" stopColor="#F4EFE7" stopOpacity="0.9" />
                <stop offset="80%" stopColor="#DDD5C8" stopOpacity="0.8" />
                <stop offset="100%" stopColor="#AAA0C8" stopOpacity="0.65" />
              </linearGradient>
              <filter id="moonSoftBlur" x="-20%" y="-20%" width="140%" height="140%">
                <feGaussianBlur stdDeviation="0.4" />
              </filter>
            </defs>

            {/* Crescent path */}
            <path
              d="M36 8C23.85 8 14 17.85 14 30C14 42.15 23.85 52 36 52C40.6 52 44.85 50.55 48.35 48.1C35.95 46.5 26.2 36.4 26.2 24C26.2 16.95 29.85 10.75 35.4 7.2C35.6 7.07 35.8 8 36 8Z"
              fill="url(#moonGlowGrad)"
              filter="url(#moonSoftBlur)"
            />

            {/* Soft inner crescent rim highlight */}
            <path
              d="M36 9C24.4 9 15 18.4 15 30C15 41.6 24.4 51 36 51C39.8 51 43.4 49.9 46.4 47.9C36.1 45.4 28.2 35.8 28.2 24.5C28.2 17.6 31.5 11.6 36.5 8.3L36 9Z"
              stroke="rgba(255, 255, 255, 0.45)"
              strokeWidth="0.75"
              fill="none"
            />
          </svg>
        </div>
      </div>
    </div>
  );
};
