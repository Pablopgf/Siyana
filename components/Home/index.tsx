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
  const [showCart, setShowCart] = useState(false);
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

  if (showCart) {
    return (
      <div className="min-h-screen bg-gray-50 flex flex-col items-center justify-center">
        <div className="w-full max-w-md mx-auto bg-white rounded-2xl shadow p-8 flex flex-col items-center">
          <div className="text-2xl font-bold mb-2">Shopping Cart (0)</div>
          <div className="text-gray-500 mb-8 text-center">Your cart is empty<br/>Add some items to get started!</div>
          <button
            className="w-full bg-green-500 hover:bg-green-600 text-white font-semibold py-2 rounded-lg transition"
            onClick={() => setShowCart(false)}
          >
            Continue Shopping
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 pb-24">
      <div className="bg-[#1652f0] text-white px-4 py-3 grid grid-cols-3 items-center">
        <div></div>
        <div className="flex justify-center">
          <img
            src="/images/icon.png"
            alt="Logo"
            className="w-10 h-10 object-contain"
          />
        </div>
        <div className="flex justify-end items-center space-x-2">
          {context?.user?.pfpUrl && (
            <img
              src={context.user.pfpUrl}
              alt="User Profile"
              className="w-9 h-9 rounded-full border-2 border-white"
            />
          )}
          {context?.user?.username && (
            <span className="font-semibold text-white text-base truncate max-w-[100px]">{context.user.username}</span>
          )}
        </div>
      </div>
      <div className="pb-2">
        <div className="bg-white shadow p-6 relative">
          <h2 className="text-2xl font-bold">All Products</h2>
          <p className="text-gray-500 text-sm">Pay with USDC on Base</p>
          <button
            className="absolute top-6 right-6 bg-[#1652f0] hover:bg-blue-700 p-3 rounded-xl transition"
            onClick={() => setShowCart(true)}
            aria-label="Shopping Cart"
          >
            <FaShoppingBag className="text-white" size={22} />
          </button>
        </div>
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
