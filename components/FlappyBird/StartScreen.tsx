import React from 'react'
import { AiOutlineArrowLeft } from 'react-icons/ai'

interface StartScreenProps {
  onStart: () => void
  onBack?: () => void
}

export const StartScreen: React.FC<StartScreenProps> = ({ onStart, onBack }) => {
  return (
    <div className="fixed inset-0 z-50 flex flex-col justify-center items-center bg-sky-400">
      {/* Botón volver (flecha) */}
      {onBack && (
        <button
          className="absolute top-4 left-4 text-white text-3xl bg-black/40 rounded-full p-2 z-50"
          onClick={onBack}
          aria-label="Volver"
        >
          <AiOutlineArrowLeft />
        </button>
      )}
      <div className="text-center p-5">
        <h1 className="text-5xl font-bold text-white drop-shadow-lg mb-5">
          Flappy Bird
        </h1>
        <p className="text-2xl text-white drop-shadow mb-10">
          Tap to start playing!
        </p>
        
        <button 
          className="bg-yellow-400 px-10 py-4 rounded-full border-3 border-orange-500 mb-10 text-2xl font-bold text-brown-800 hover:bg-yellow-300 transition-colors"
          onClick={onStart}
        >
          Start Game
        </button>
        
        <div className="text-left">
          <p className="text-lg text-white drop-shadow mb-2">• Tap to make the bird flap</p>
          <p className="text-lg text-white drop-shadow mb-2">• Avoid the pipes</p>
          <p className="text-lg text-white drop-shadow">• Try to get the highest score!</p>
        </div>
      </div>
    </div>
  )
} 