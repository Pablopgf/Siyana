import React, { useState, useEffect, useCallback, useRef } from 'react'
import { Bird } from './Bird'
import { Pipe } from './Pipe'
import { Score } from './Score'
import { StartScreen } from './StartScreen'
import { GameOverScreen } from './GameOverScreen'

// Mobile-optimized dimensions
const getScreenDimensions = () => {
  if (typeof window === 'undefined') return { width: 400, height: 600 }
  
  const isMobile = window.innerWidth <= 768
  return {
    width: isMobile ? window.innerWidth : 400,
    height: isMobile ? window.innerHeight : 600
  }
}

const { width: SCREEN_WIDTH, height: SCREEN_HEIGHT } = getScreenDimensions()

interface GameState {
  isPlaying: boolean
  isGameOver: boolean
  score: number
  birdY: number
  birdVelocity: number
  pipes: Array<{
    id: number
    x: number
    topHeight: number
    bottomY: number
    passed: boolean
  }>
}

const GRAVITY = 0.25
const FLAP_VELOCITY = -6
const PIPE_WIDTH = 60
const PIPE_GAP = 200
const PIPE_SPEED = 2.0
const BIRD_SIZE = 30

export const Game: React.FC = () => {
  const [gameState, setGameState] = useState<GameState>({
    isPlaying: false,
    isGameOver: false,
    score: 0,
    birdY: SCREEN_HEIGHT / 2,
    birdVelocity: 0,
    pipes: [],
  })

  const animationFrameId = useRef<number>()
  const lastTime = useRef<number>(0)
  const pipeIdCounter = useRef<number>(0)
  const isHolding = useRef<boolean>(false)
  const holdInterval = useRef<NodeJS.Timeout>()

  // Game loop
  const gameLoop = useCallback((currentTime: number) => {
    if (!lastTime.current) lastTime.current = currentTime
    const deltaTime = currentTime - lastTime.current
    lastTime.current = currentTime

    setGameState((prev) => {
      if (!prev.isPlaying || prev.isGameOver) return prev

      // Apply gravity to bird
      const newBirdVelocity = prev.birdVelocity + GRAVITY
      const newBirdY = prev.birdY + newBirdVelocity

      // Check if bird hits ground or ceiling
      if (newBirdY <= 0 || newBirdY + BIRD_SIZE >= SCREEN_HEIGHT) {
        return { ...prev, isGameOver: true }
      }

      // Move pipes
      let newPipes = prev.pipes.map((pipe) => ({
        ...pipe,
        x: pipe.x - PIPE_SPEED,
      }))

      // Remove pipes that are off screen
      newPipes = newPipes.filter((pipe) => pipe.x + PIPE_WIDTH > 0)

      // Generate new pipes
      const isFirstPipe = newPipes.length === 0
      const distanceThreshold = isFirstPipe ? 500 : 250
      
      if (isFirstPipe || newPipes[newPipes.length - 1].x < SCREEN_WIDTH - distanceThreshold) {
        const topHeight = Math.random() * (SCREEN_HEIGHT - PIPE_GAP - 80) + 40
        const bottomY = topHeight + PIPE_GAP
        newPipes.push({
          id: pipeIdCounter.current++,
          x: isFirstPipe ? 500 : SCREEN_WIDTH,
          topHeight,
          bottomY,
          passed: false,
        })
      }

      // Check collisions and update score
      let newScore = prev.score
      let collision = false

      newPipes.forEach((pipe) => {
        // Check if bird passed the pipe
        if (!pipe.passed && pipe.x + PIPE_WIDTH < SCREEN_WIDTH * 0.5) {
          newScore += 1
          pipe.passed = true
        }

        // Check collision with pipe
        if (
          SCREEN_WIDTH * 0.5 + BIRD_SIZE > pipe.x &&
          SCREEN_WIDTH * 0.5 < pipe.x + PIPE_WIDTH &&
          (newBirdY < pipe.topHeight || newBirdY + BIRD_SIZE > pipe.bottomY)
        ) {
          collision = true
        }
      })

      if (collision) {
        return { ...prev, isGameOver: true }
      }

      return {
        ...prev,
        birdY: newBirdY,
        birdVelocity: newBirdVelocity,
        pipes: newPipes,
        score: newScore,
      }
    })

    animationFrameId.current = requestAnimationFrame(gameLoop)
  }, [])

  // Start game loop when playing
  useEffect(() => {
    if (gameState.isPlaying && !gameState.isGameOver) {
      animationFrameId.current = requestAnimationFrame(gameLoop)
    }

    return () => {
      if (animationFrameId.current) {
        cancelAnimationFrame(animationFrameId.current)
      }
    }
  }, [gameState.isPlaying, gameState.isGameOver, gameLoop])

  // Handle flap
  const handleFlap = useCallback(() => {
    if (!gameState.isPlaying) {
      // Start the game
      setGameState((prev) => ({
        ...prev,
        isPlaying: true,
        birdVelocity: FLAP_VELOCITY,
      }))
    } else if (!gameState.isGameOver) {
      // Flap the bird
      setGameState((prev) => ({
        ...prev,
        birdVelocity: FLAP_VELOCITY,
      }))
    }
  }, [gameState.isPlaying, gameState.isGameOver])

  // Handle touch events for mobile
  const handleTouchStart = useCallback((e: React.TouchEvent) => {
    e.preventDefault()
    isHolding.current = true
    handleFlap()
    
    // Start continuous flapping
    holdInterval.current = setInterval(() => {
      if (isHolding.current && gameState.isPlaying && !gameState.isGameOver) {
        setGameState((prev) => ({
          ...prev,
          birdVelocity: FLAP_VELOCITY,
        }))
      }
    }, 150) // Flap every 150ms while holding
  }, [handleFlap, gameState.isPlaying, gameState.isGameOver])

  const handleTouchEnd = useCallback((e: React.TouchEvent) => {
    e.preventDefault()
    isHolding.current = false
    if (holdInterval.current) {
      clearInterval(holdInterval.current)
    }
  }, [])

  // Handle keyboard events for desktop
  const handleKeyDown = useCallback((e: KeyboardEvent) => {
    if (e.code === 'Space' || e.code === 'ArrowUp') {
      e.preventDefault()
      if (!isHolding.current) {
        isHolding.current = true
        handleFlap()
        
        // Start continuous flapping
        holdInterval.current = setInterval(() => {
          if (isHolding.current && gameState.isPlaying && !gameState.isGameOver) {
            setGameState((prev) => ({
              ...prev,
              birdVelocity: FLAP_VELOCITY,
            }))
          }
        }, 150)
      }
    }
  }, [handleFlap, gameState.isPlaying, gameState.isGameOver])

  const handleKeyUp = useCallback((e: KeyboardEvent) => {
    if (e.code === 'Space' || e.code === 'ArrowUp') {
      isHolding.current = false
      if (holdInterval.current) {
        clearInterval(holdInterval.current)
      }
    }
  }, [])

  useEffect(() => {
    document.addEventListener('keydown', handleKeyDown)
    document.addEventListener('keyup', handleKeyUp)
    return () => {
      document.removeEventListener('keydown', handleKeyDown)
      document.removeEventListener('keyup', handleKeyUp)
    }
  }, [handleKeyDown, handleKeyUp])

  // Restart game
  const handleRestart = useCallback(() => {
    setGameState({
      isPlaying: false,
      isGameOver: false,
      score: 0,
      birdY: SCREEN_HEIGHT / 2,
      birdVelocity: 0,
      pipes: [],
    })
    isHolding.current = false
    if (holdInterval.current) {
      clearInterval(holdInterval.current)
    }
  }, [])

  // Show start screen
  if (!gameState.isPlaying && !gameState.isGameOver) {
    return <StartScreen onStart={handleFlap} />
  }

  // Show game over screen
  if (gameState.isGameOver) {
    return <GameOverScreen score={gameState.score} onRestart={handleRestart} />
  }

  return (
    <div 
      className="relative w-full h-full cursor-pointer overflow-hidden select-none"
      onClick={handleFlap}
      onTouchStart={handleTouchStart}
      onTouchEnd={handleTouchEnd}
      style={{ touchAction: 'none' }}
    >
      {/* Background image */}
      <img 
        src="/images/background.png" 
        alt="background" 
        className="absolute inset-0 w-full h-full object-cover z-0" 
        draggable={false}
      />
      {/* Score */}
      <Score score={gameState.score} />

      {/* Bird */}
      <div 
        className="absolute left-1/2 w-8 h-8 z-10"
        style={{ 
          top: gameState.birdY,
          transform: `translateX(-50%) rotate(${Math.min(Math.max(gameState.birdVelocity * 2, -30), 30)}deg)`
        }}
      >
        <Bird size={BIRD_SIZE} />
      </div>

      {/* Pipes */}
      {gameState.pipes.map((pipe) => (
        <React.Fragment key={pipe.id}>
          <Pipe
            x={pipe.x}
            y={0}
            width={PIPE_WIDTH}
            height={pipe.topHeight}
            isTop={true}
          />
          <Pipe
            x={pipe.x}
            y={pipe.bottomY}
            width={PIPE_WIDTH}
            height={SCREEN_HEIGHT - pipe.bottomY}
            isTop={false}
          />
        </React.Fragment>
      ))}
    </div>
  )
} 