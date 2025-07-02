import React from 'react'

interface PipeProps {
  x: number
  y: number
  width: number
  height: number
  isTop: boolean
}

export const Pipe: React.FC<PipeProps> = ({ x, y, width, height, isTop }) => {
  return (
    <div
      className="absolute"
      style={{
        left: x,
        top: y,
        width,
        height,
      }}
    >
      {/* Pipe body */}
      <div 
        className="bg-green-600 border-3 border-green-800"
        style={{
          width,
          height,
          transform: isTop ? 'scaleY(-1)' : 'none',
        }}
      />
      
      {/* Pipe cap */}
      <div
        className="absolute bg-green-500 border-3 border-green-700"
        style={{
          left: -10,
          top: isTop ? height - 20 : -20,
          width: width + 20,
          height: 20,
        }}
      />
    </div>
  )
} 