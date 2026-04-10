interface TimerProps {
  timeLeft: number;
  totalTime: number;
}

export default function Timer({ timeLeft, totalTime }: TimerProps) {
  const isLowTime = timeLeft <= 3;
  const percentage = (timeLeft / totalTime) * 100;

  return (
    <div className="text-center">
      <div className={`text-5xl font-bold mb-2 transition-colors ${
        isLowTime ? 'text-red-500 animate-pulse' : 'text-blue-600'
      }`}>
        {timeLeft}
      </div>
      <div className="w-full bg-gray-200 rounded-full h-4 overflow-hidden">
        <div
          className={`h-full transition-all duration-1000 rounded-full ${
            isLowTime ? 'bg-red-500' : 'bg-blue-500'
          }`}
          style={{ width: `${percentage}%` }}
        />
      </div>
      <p className="text-sm text-gray-600 mt-1">seconds</p>
    </div>
  );
}
