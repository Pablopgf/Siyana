import React from 'react'

interface GameOverScreenProps {
  score: number
  onRestart: () => void
}

export const GameOverScreen: React.FC<GameOverScreenProps> = ({ score, onRestart }) => {
  return (
    <div className="fixed inset-0 z-50 flex flex-col justify-center items-center bg-sky-400">
      <div className="text-center p-5">
        <h1 className="text-5xl font-bold text-white drop-shadow-lg mb-5">
          Game Over
        </h1>
        <div className="text-4xl font-bold text-yellow-400 drop-shadow-lg mb-10">
          Score: {score}
        </div>
        
        <button 
          className="bg-orange-500 px-10 py-4 rounded-full border-3 border-orange-600 mb-8 text-2xl font-bold text-white hover:bg-orange-400 transition-colors"
          onClick={onRestart}
        >
          Play Again
        </button>
        
        <div className="text-center">
          <p className="text-lg text-white drop-shadow">
            {score === 0 ? 'Better luck next time!' : 
             score < 5 ? 'Good start! Keep practicing!' :
             score < 10 ? 'Nice job! You\'re getting better!' :
             score < 20 ? 'Great score! You\'re a pro!' :
             'Amazing! You\'re a Flappy Bird master!'}
          </p>
        </div>
      </div>
    </div>
  )
} 