'use client'

import { useState, useEffect } from 'react'
import { AiOutlineHome } from 'react-icons/ai'
import { useFrame } from '@/components/farcaster-provider'
import { FarcasterActions } from '@/components/Home/FarcasterActions'
import { User } from '@/components/Home/User'
import { WalletActions } from '@/components/Home/WalletActions'
import { FlappyBird } from '@/components/FlappyBird'
import { useMiniKit } from '@coinbase/onchainkit/minikit'
import { FaRegClipboard, FaShoppingBag, FaRegBookmark, FaBookmark } from 'react-icons/fa'
import { useAccount, useBalance } from 'wagmi'
import { ProductDetailModal } from './ProductDetailModal';

interface Product {
  name: string;
  price: string;
  image: string;
}

const products = [
  {
    name: 'SIYANA 1',
    price: '$9.99',
    image: '/images/icon.png',
  },
  {
    name: 'SIYANA 2',
    price: '$19.99',
    image: '/images/icon.png',
  },
  {
    name: 'SIYANA 3',
    price: '$29.99',
    image: '/images/icon.png',
  },
  {
    name: 'SIYANA 4',
    price: '$39.99',
    image: '/images/icon.png',
  },
];

export default function HomeShop() {
  const { context } = useFrame()
  const [showFlappyBird, setShowFlappyBird] = useState(false)
  const [showCart, setShowCart] = useState(false);
  const [showProductDetail, setShowProductDetail] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [favorites, setFavorites] = useState<boolean[]>(Array(products.length).fill(false));
  const [search, setSearch] = useState('');
  // const [showUser, setShowUser] = useState(false)

  // MiniKit: notificar que el frame está listo
  const { setFrameReady, isFrameReady } = useMiniKit();
  useEffect(() => {
    if (!isFrameReady) {
      setFrameReady();
    }
  }, [setFrameReady, isFrameReady]);

  const account = useAccount();
  const { data: balanceData } = useBalance({
    address: account.address,
    chainId: 8453,
    watch: true,
  });

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
      <div className="fixed inset-0 bg-white flex flex-col z-50">
        <div className="flex items-center justify-between border-b px-4 py-3">
          <span className="font-bold text-lg">Shopping Cart (0)</span>
          <button
            onClick={() => setShowCart(false)}
            className="text-2xl text-gray-500 hover:text-black"
            aria-label="Close"
          >
            ×
          </button>
        </div>
        <div className="flex-1 flex flex-col items-center justify-center">
          <div className="mb-6 flex items-center justify-center">
            <div className="bg-gray-100 rounded-full w-16 h-16 flex items-center justify-center">
              <FaShoppingBag className="text-gray-400" size={20} />
            </div>
          </div>
          <div className="font-bold text-xl mb-2">Your cart is empty</div>
          <div className="text-gray-400 mb-8 text-center">Add some items to get started!</div>
          <button
            className="bg-[#1652f0] hover:bg-blue-700 text-white font-semibold py-2 px-6 rounded-lg transition"
            onClick={() => setShowCart(false)}
          >
            Continue Shopping
          </button>
        </div>
      </div>
    );
  }

  return (
    <>
      {showProductDetail && selectedProduct && (
        <ProductDetailModal
          product={{
            ...selectedProduct,
            images: [selectedProduct.image, selectedProduct.image, selectedProduct.image, selectedProduct.image],
            oldPrice: selectedProduct.price === '$29.97' ? '$29.97' : undefined,
            description: 'A cool green tee with a pixel art cat. Minted Merch.'
          }}
          onClose={() => setShowProductDetail(false)}
        />
      )}
      <div className="min-h-screen bg-white pb-8 w-full">
        <div className="fixed top-0 left-0 w-full bg-[#1652f0] text-white px-1 py-1 grid grid-cols-3 items-center z-50">
          <div className="flex items-center">
            <img
              src="/images/usdc.webp"
              alt="USDC"
              className="w-8 h-8 rounded-full border-2 border-white"
            />
            <span className="font-semibold text-white text-base ml-2">
              {balanceData ? parseFloat(balanceData.formatted).toFixed(4) : '0.00'}
            </span>
          </div>
          <div className="flex justify-center">
            <img
              src="/images/icon.png"
              alt="Logo"
              className="w-10 h-10 object-contain"
            />
          </div>
          <div className="flex justify-end items-center">
            {context?.user?.pfpUrl && (
              <img
                src={context.user.pfpUrl}
                alt="User Profile"
                className="w-8 h-8 rounded-full border-2 border-white"
              />
            )}
          </div>
        </div>
        <div className="pb-4 pt-12">
          <div className="bg-white shadow p-4 relative flex items-center justify-between">
            <div>
              <h2 className="text-2xl font-bold">Siyana Products</h2>
              <p className="text-gray-500 text-sm">Pay with USDC on Base</p>
            </div>
            <div className="flex items-center space-x-2">
              <button
                className="bg-[#1652f0] hover:bg-blue-700 p-3 rounded-xl transition"
                onClick={() => setShowCart(true)}
                aria-label="Shopping Cart"
              >
                <FaShoppingBag className="text-white" size={20} />
              </button>
              <button
                className="bg-[#1652f0] hover:bg-blue-700 p-3 rounded-xl transition"
                onClick={() => setShowCart(true)}
                aria-label="Shopping Cart"
              >
                <FaShoppingBag className="text-white" size={20} />
              </button>
            </div>
          </div>
        </div>
        <div className="w-full flex flex-col items-center mt-20 mb-20">
          <input
            type="text"
            placeholder="WHAT ARE YOU LOOKING FOR?"
            value={search}
            onChange={e => setSearch(e.target.value)}
            className="w-full max-w-xs px-4 py-2 text-center text-black placeholder-black focus:placeholder-gray-400 mb-2 focus:outline-none"
          />
        </div>
        <div className="grid grid-cols-2 gap-x-4 gap-y-4 px-4">
          {products.filter(product =>
            product.name.toLowerCase().includes(search.toLowerCase())
          ).map((product, idx) => (
            <div key={idx} className="bg-white p-0 flex flex-col items-center h-full overflow-hidden">
              <div
                className="w-full flex items-center justify-center bg-gray-100"
                style={{ minHeight: '220px' }}
              >
                <img
                  src={product.image}
                  alt={product.name}
                  className="w-40 h-56 object-contain cursor-pointer"
                  onClick={() => { setSelectedProduct(product); setShowProductDetail(true); }}
                />
              </div>
              <div className="w-full bg-white py-2 flex flex-col items-start">
                <div className="flex items-center w-full justify-between">
                  <span className="font-semibold text-base mb-1 truncate">{product.name}</span>
                  <button
                    className=""
                    onClick={() => {
                      const updated = [...favorites];
                      updated[idx] = !updated[idx];
                      setFavorites(updated);
                    }}
                    aria-label="Favorito"
                  >
                    {favorites[idx] ? (
                      <FaBookmark className="text-black" />
                    ) : (
                      <FaRegBookmark className="text-black/30" />
                    )}
                  </button>
                </div>
                <div className="text-gray-700 text-base">{product.price}</div>
              </div>
            </div>
          ))}
        </div>
        <footer className="fixed bottom-0 left-0 w-full bg-white p-4 flex justify-around items-center z-50">
          <div className="flex items-center space-x-1">
            <AiOutlineHome className="text-black w-5 h-5" />
          </div>
          <button 
            onClick={() => setShowFlappyBird(true)}
            className="text-sm text-black"
          >
            🐦 Flappy Bird
          </button>
        </footer>
      </div>
    </>
  )
}
