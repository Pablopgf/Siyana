import React from 'react'

interface BirdProps {
  size: number
}

export const Bird: React.FC<BirdProps> = ({ size }) => {
  return (
    <img
      src="/images/yellow_bird.gif"
      alt="Flappy Bird"
      style={{ width: size, height: size, objectFit: 'contain', display: 'block' }}
      draggable={false}
    />
  )
} 