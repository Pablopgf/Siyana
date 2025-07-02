import React from 'react'

interface ScoreProps {
  score: number
}

export const Score: React.FC<ScoreProps> = ({ score }) => {
  return (
    <div className="absolute top-15 left-0 right-0 text-center z-10">
      <div className="text-5xl font-bold text-white drop-shadow-lg">
        {score}
      </div>
    </div>
  )
} 