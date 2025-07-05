'use client'

import { useState, useEffect } from 'react'
import { AiOutlineHome } from 'react-icons/ai'
import { useFrame } from '@/components/farcaster-provider'
import { FarcasterActions } from '@/components/Home/FarcasterActions'
import { User } from '@/components/Home/User'
import { WalletActions } from '@/components/Home/WalletActions'
import { FlappyBird } from '@/components/FlappyBird'
import { useMiniKit } from '@coinbase/onchainkit/minikit'
import { FaRegClipboard, FaShoppingBag } from 'react-icons/fa'

const products = [
  {
    name: 'Tiny Hyper Tee',
    price: '$29.97',
    image: '/images/background.png',
  },
  {
    name: 'CryptoaDickButtz OG Tee',
    price: '$24.97',
    image: '/images/background.png',
  },
  {
    name: 'Dickbutt Cap',
    price: '$29.97',
    image: '/images/background.png',
  },
  {
    name: 'Bankr Cap',
    price: '$29.97',
    image: '/images/background.png',
  },
];

export default function HomeShop() {
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
    <div className="min-h-screen bg-gray-50 pb-24">
      {/* Header */}
      <div className="bg-black text-white px-4 py-3 flex flex-col items-center relative">
        <span className="text-xs opacity-70">Minted Merch Shop</span>
        <span className="font-bold text-lg">by svvvg3.eth <span className="text-blue-400">✔️</span></span>
        {/* Iconos */}
        <div className="absolute right-4 top-1/2 -translate-y-1/2 flex space-x-3">
          <button className="bg-white/10 p-2 rounded-full"><FaRegClipboard size={20} /></button>
          <button className="bg-white/10 p-2 rounded-full"><FaShoppingBag size={20} /></button>
        </div>
      </div>
      {/* Barra verde bienvenida */}
      <div className="bg-green-200 text-green-900 px-4 py-2 flex items-center space-x-2">
        <span className="text-lg">👾</span>
        <span className="font-medium">Hey, Pablete - welcome to Minted Merch! <span className="wave">👋</span></span>
      </div>
      {/* Título y subtítulo */}
      <div className="px-4 pt-6 pb-2">
        <h2 className="text-2xl font-bold">All Products</h2>
        <p className="text-gray-500 text-sm">Pay with USDC on Base</p>
      </div>
      {/* Grid de productos */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-5 px-4">
        {products.map((product, idx) => (
          <div key={idx} className="bg-white rounded-2xl shadow p-4 flex flex-col items-center">
            <img src={product.image} alt={product.name} className="w-40 h-40 object-cover rounded-xl mb-4" />
            <div className="font-semibold text-lg text-center">{product.name}</div>
            <div className="text-gray-700 text-base mb-3">{product.price}</div>
            <button className="w-full bg-green-500 hover:bg-green-600 text-white font-semibold py-2 rounded-lg transition">View Options</button>
          </div>
        ))}
      </div>
      <footer className="fixed bottom-0 left-0 w-full bg-black p-4 flex justify-around items-center z-50">
        <div className="flex items-center space-x-1">
          <AiOutlineHome className="text-white w-5 h-5" />
          <span className="text-white text-sm">Home</span>
        </div>
        <button 
          onClick={() => setShowFlappyBird(true)}
          className="text-sm text-white"
        >
          🐦 Flappy Bird
        </button>
      </footer>
    </div>
  )
}
