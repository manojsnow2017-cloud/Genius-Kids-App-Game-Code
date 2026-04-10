interface QuestionCardProps {
  num1: number;
  num2: number;
  options: number[];
  onAnswer: (answer: number) => void;
  feedback: string;
  showBalloons: boolean;
  selectedAnswer?: number | null;
  correctAnswer?: number;
}

export default function QuestionCard({
  num1,
  num2,
  options,
  onAnswer,
  feedback,
  showBalloons,
  selectedAnswer,
  correctAnswer
}: QuestionCardProps) {
  const getButtonClassName = (option: number) => {
    let baseClass = "py-6 md:py-8 text-3xl md:text-4xl font-bold text-white rounded-2xl shadow-lg transition-all";

    if (selectedAnswer === option) {
      if (option === correctAnswer) {
        return `${baseClass} bg-gradient-to-br from-green-400 to-green-600 shadow-green-500/50 shadow-xl scale-105`;
      } else {
        return `${baseClass} bg-gradient-to-br from-red-400 to-red-600 shadow-red-500/50 shadow-xl`;
      }
    }

    if (feedback !== '') {
      return `${baseClass} bg-gradient-to-br from-blue-500 to-purple-500 opacity-50 cursor-not-allowed`;
    }

    return `${baseClass} bg-gradient-to-br from-blue-500 to-purple-500 hover:shadow-xl transform hover:scale-105`;
  };

  return (
    <div className="bg-white rounded-3xl shadow-2xl p-8 md:p-12">
      <div className="text-center mb-8">
        <div className="text-5xl md:text-6xl font-bold text-purple-600 mb-4">
          {num1} + {num2} = ?
        </div>
      </div>

      {showBalloons && (
        <div className="flex justify-center gap-4 mb-6">
          {[1, 2, 3].map((i) => (
            <div
              key={i}
              className="text-6xl animate-float"
              style={{ animationDelay: `${i * 0.15}s` }}
            >
              🎈
            </div>
          ))}
        </div>
      )}

      {feedback && (
        <div className={`text-3xl md:text-4xl font-bold text-center mb-6 ${
          feedback.includes('Correct') || feedback.includes('Great')
            ? 'text-green-500'
            : 'text-orange-500'
        }`}>
          {feedback}
        </div>
      )}

      <div className="grid grid-cols-2 gap-4 md:gap-6">
        {options.map((option) => (
          <button
            key={option}
            onClick={() => onAnswer(option)}
            disabled={feedback !== ''}
            className={getButtonClassName(option)}
          >
            {option}
          </button>
        ))}
      </div>
    </div>
  );
}
