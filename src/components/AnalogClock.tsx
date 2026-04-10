interface AnalogClockProps {
  hours: number;
  minutes: number;
  size?: 'small' | 'medium' | 'large';
}

export default function AnalogClock({ hours, minutes, size = 'large' }: AnalogClockProps) {
  const sizeClasses = {
    small: 'w-48 h-48',
    medium: 'w-64 h-64',
    large: 'w-80 h-80'
  };

  const hourAngle = ((hours % 12) * 30) + (minutes * 0.5);
  const minuteAngle = minutes * 6;

  return (
    <div className={`${sizeClasses[size]} mx-auto transition-all duration-300`}>
      <svg viewBox="0 0 200 200" className="w-full h-full">
        <defs>
          <linearGradient id="clockFace" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#EBF5FF" />
            <stop offset="100%" stopColor="#DBEAFE" />
          </linearGradient>
          <filter id="softShadow">
            <feGaussianBlur in="SourceAlpha" stdDeviation="3"/>
            <feOffset dx="0" dy="2" result="offsetblur"/>
            <feComponentTransfer>
              <feFuncA type="linear" slope="0.3"/>
            </feComponentTransfer>
            <feMerge>
              <feMergeNode/>
              <feMergeNode in="SourceGraphic"/>
            </feMerge>
          </filter>
        </defs>

        <circle
          cx="100"
          cy="100"
          r="92"
          fill="url(#clockFace)"
          stroke="#93C5FD"
          strokeWidth="6"
          filter="url(#softShadow)"
        />

        {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12].map((num) => {
          const angle = ((num * 30) - 90) * (Math.PI / 180);
          const x = 100 + 65 * Math.cos(angle);
          const y = 100 + 65 * Math.sin(angle);
          return (
            <text
              key={num}
              x={x}
              y={y}
              textAnchor="middle"
              dominantBaseline="middle"
              className="text-3xl font-bold fill-sky-700"
              style={{ fontFamily: 'system-ui, sans-serif' }}
            >
              {num}
            </text>
          );
        })}

        <line
          x1="100"
          y1="100"
          x2={100 + 45 * Math.sin((hourAngle * Math.PI) / 180)}
          y2={100 - 45 * Math.cos((hourAngle * Math.PI) / 180)}
          stroke="#1E40AF"
          strokeWidth="10"
          strokeLinecap="round"
          className="transition-all duration-500"
        />

        <line
          x1="100"
          y1="100"
          x2={100 + 60 * Math.sin((minuteAngle * Math.PI) / 180)}
          y2={100 - 60 * Math.cos((minuteAngle * Math.PI) / 180)}
          stroke="#DC2626"
          strokeWidth="8"
          strokeLinecap="round"
          className="transition-all duration-500"
        />

        <circle cx="100" cy="100" r="10" fill="#1E40AF" />
        <circle cx="100" cy="100" r="4" fill="#EBF5FF" />
      </svg>
    </div>
  );
}
