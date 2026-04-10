import { useState, useEffect } from 'react';

interface ElephantMascotProps {
  size?: 'small' | 'medium' | 'large';
  animate?: 'idle' | 'wave' | 'jump' | 'celebrate';
  position?: 'center' | 'corner' | 'top';
}

export default function ElephantMascot({
  size = 'medium',
  animate = 'idle',
  position = 'center'
}: ElephantMascotProps) {
  const [currentAnimation, setCurrentAnimation] = useState(animate);

  useEffect(() => {
    setCurrentAnimation(animate);
  }, [animate]);

  const sizeClasses = {
    small: 'w-20 h-20',
    medium: 'w-32 h-32',
    large: 'w-48 h-48'
  };

  const positionClasses = {
    center: 'mx-auto',
    corner: 'fixed bottom-4 right-4 z-10',
    top: 'mx-auto mb-4'
  };

  const animationClasses = {
    idle: 'animate-float',
    wave: 'animate-wave',
    jump: 'animate-jump',
    celebrate: 'animate-celebrate'
  };

  return (
    <div className={`${sizeClasses[size]} ${positionClasses[position]} ${animationClasses[currentAnimation]}`}>
      <svg viewBox="0 0 200 200" className="w-full h-full drop-shadow-lg">
        <defs>
          <linearGradient id="elephantGradient" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor="#93C5FD" />
            <stop offset="100%" stopColor="#60A5FA" />
          </linearGradient>
        </defs>

        {/* Body */}
        <ellipse cx="100" cy="120" rx="50" ry="45" fill="url(#elephantGradient)" />

        {/* Head */}
        <circle cx="100" cy="70" r="40" fill="url(#elephantGradient)" />

        {/* Ears */}
        <ellipse cx="65" cy="65" rx="20" ry="30" fill="#93C5FD" />
        <ellipse cx="135" cy="65" rx="20" ry="30" fill="#93C5FD" />
        <ellipse cx="65" cy="65" rx="12" ry="20" fill="#DBEAFE" />
        <ellipse cx="135" cy="65" rx="12" ry="20" fill="#DBEAFE" />

        {/* Eyes */}
        <circle cx="85" cy="65" r="8" fill="white" />
        <circle cx="115" cy="65" r="8" fill="white" />
        <circle cx="87" cy="67" r="5" fill="#1F2937" />
        <circle cx="117" cy="67" r="5" fill="#1F2937" />
        <circle cx="89" cy="65" r="2" fill="white" />
        <circle cx="119" cy="65" r="2" fill="white" />

        {/* Trunk */}
        <path
          d="M 100 85 Q 95 95, 90 105 Q 85 115, 88 125 Q 90 130, 95 128"
          fill="none"
          stroke="#60A5FA"
          strokeWidth="12"
          strokeLinecap="round"
        />
        <ellipse cx="93" cy="128" rx="6" ry="4" fill="#DBEAFE" />

        {/* Smile */}
        <path
          d="M 85 78 Q 100 85, 115 78"
          fill="none"
          stroke="#1F2937"
          strokeWidth="2"
          strokeLinecap="round"
        />

        {/* Legs */}
        <rect x="75" y="155" width="15" height="30" rx="8" fill="#60A5FA" />
        <rect x="110" y="155" width="15" height="30" rx="8" fill="#60A5FA" />

        {/* Feet */}
        <ellipse cx="82.5" cy="180" rx="10" ry="6" fill="#93C5FD" />
        <ellipse cx="117.5" cy="180" rx="10" ry="6" fill="#93C5FD" />

        {/* Tail */}
        <path
          d="M 145 130 Q 155 135, 158 145"
          fill="none"
          stroke="#60A5FA"
          strokeWidth="4"
          strokeLinecap="round"
        />
        <circle cx="158" cy="145" r="3" fill="#1F2937" />
      </svg>
    </div>
  );
}
