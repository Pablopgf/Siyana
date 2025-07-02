'use client'

import { useState, useEffect } from 'react'
import { AiOutlineHome } from 'react-icons/ai'
import { useFrame } from '@/components/farcaster-provider'
import { FarcasterActions } from '@/components/Home/FarcasterActions'
import { User } from '@/components/Home/User'
import { WalletActions } from '@/components/Home/WalletActions'
import { FlappyBird } from '@/components/FlappyBird'
import { useMiniKit } from '@coinbase/onchainkit/minikit'

export function Demo() {
  const { context } = useFrame()
  const [showFlappyBird, setShowFlappyBird] = useState(false)
  // const [showUser, setShowUser] = useState(false)

  // MiniKit: notificar que el frame está listo
  const { setFrameReady, isFrameReady } = useMiniKit();
  useEffect(() => {
    if (!isFrameReady) {
      setFrameReady();
    }
  }, [setFrameReady, isFrameReady]);

  if (showFlappyBird) {
    return (
      <div className="w-full h-screen">
        <FlappyBird />
        <button 
          onClick={() => setShowFlappyBird(false)}
          className="absolute top-4 left-4 z-50 bg-black text-white px-4 py-2 rounded-lg"
        >
          ← Back to Home
        </button>
      </div>
    )
  }

  return (
    <div className="flex flex-col min-h-screen items-center justify-center">
      <header className="bg-black fixed h-14 left-0 top-0 w-full px-4 py-4">
        <div className="relative flex items-center justify-center">
          <img
            className="rounded-full"
            width={32}
            height={32}
            src="/images/siyana.png"
            alt="Logo"
          />
          {context?.user?.pfpUrl && (
            // <button
            //   onClick={() => setShowUser(true)}
            //   className="absolute right-0"
            // >
              <img
                src={context.user.pfpUrl}
                className="absolute right-0 rounded-full"
                width={32}
                height={32}
              />
            // </button>
          )}
        </div>
      </header>
      <div className="pt-20 w-full max-w-4xl space-y-6">
        {/* {showUser && <User />} */}
        <FarcasterActions />
        <WalletActions />
      </div>
      <footer className="fixed bottom-0 left-0 w-full bg-black p-4 flex justify-around items-center z-50">
        <div className="flex items-center space-x-1">
          <AiOutlineHome className="text-white w-5 h-5" />
          <span className="text-white text-sm">Home</span>
        </div>
        <button className="text-sm text-white">Profile</button>
        <button 
          onClick={() => setShowFlappyBird(true)}
          className="text-sm text-white bg-blue-600 px-3 py-1 rounded"
        >
          🐦 Flappy Bird
        </button>
      </footer>
    </div>
  )
}
