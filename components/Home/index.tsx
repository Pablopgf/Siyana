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

interface CartItem {
  product: Product;
  quantity: number;
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
  const [cart, setCart] = useState<CartItem[]>([]);
  const [activeCartTab, setActiveCartTab] = useState<'cart' | 'favorites'>('cart');
  // const [showUser, setShowUser] = useState(false)

  // MiniKit: notificar que el frame está listo
  const { setFrameReady, isFrameReady } = useMiniKit();
  useEffect(() => {
    if (!isFrameReady) {
      setFrameReady();
    }
  }, [setFrameReady, isFrameReady]);

  // Cargar carrito de localStorage al iniciar
  useEffect(() => {
    const storedCart = localStorage.getItem('cart');
    if (storedCart) {
      try {
        setCart(JSON.parse(storedCart));
      } catch {}
    }
  }, []);
  // Guardar carrito en localStorage cada vez que cambie
  useEffect(() => {
    localStorage.setItem('cart', JSON.stringify(cart));
  }, [cart]);

  // Persistir favoritos en localStorage
  useEffect(() => {
    const storedFavs = localStorage.getItem('favorites');
    if (storedFavs) {
      try {
        setFavorites(JSON.parse(storedFavs));
      } catch {}
    }
  }, []);
  useEffect(() => {
    localStorage.setItem('favorites', JSON.stringify(favorites));
  }, [favorites]);

  const account = useAccount();
  const { data: balanceData } = useBalance({
    address: account.address,
    chainId: 8453,
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
      <div className="fixed inset-0 bg-white flex flex-col z-50 text-xs">
        <div className="sticky top-0 left-0 w-full bg-white z-10 border-b flex items-center px-4 pt-6 pb-4">
          <div className="flex items-center space-x-8 flex-1">
            <span
              className={`racking-wide cursor-pointer ${activeCartTab === 'cart' ? 'text-black' : 'text-black/50'}`}
              onClick={() => setActiveCartTab('cart')}
            >SHOPPING BAG [{cart.reduce((acc, item) => acc + item.quantity, 0)}]</span>
            <span
              className={`flex items-center cursor-pointer ${activeCartTab === 'favorites' ? 'text-black' : 'text-black/50'}`}
              onClick={() => setActiveCartTab('favorites')}
            >
              FAVOURITES <FaRegBookmark className="ml-1" />
            </span>
          </div>
          <button
            onClick={() => setShowCart(false)}
            className="ml-auto text-2xl text-gray-500 hover:text-black"
            aria-label="Close"
          >
            ×
          </button>
        </div>
        <div className="flex-1 overflow-y-auto">
          {activeCartTab === 'cart' ? (
            cart.length === 0 ? (
              <div className="flex-1 flex flex-col items-center justify-center">
                <div className="mb-6 flex items-center justify-center">
                  <div className="bg-gray-100 rounded-full w-16 h-16 flex items-center justify-center">
                    <FaShoppingBag className="text-gray-400" size={20} />
                  </div>
                </div>
                <div className="font-bold mb-2">Your cart is empty</div>
                <div className="text-gray-400 mb-8 text-center">Add some items to get started!</div>
                <button
                  className="bg-[#1652f0] hover:bg-blue-700 text-white font-semibold py-2 px-6 rounded-lg transition"
                  onClick={() => setShowCart(false)}
                >
                  Continue Shopping
                </button>
              </div>
            ) : (
              cart.map((item, i) => (
                <div key={i} className="flex w-full px-4 py-6 border-b items-start">
                  <div className="w-44 h-56 flex-shrink-0 flex items-center justify-center bg-gray-100 overflow-hidden">
                    <img src={item.product.image} alt={item.product.name} className="object-contain w-full h-full" />
                  </div>
                  <div className="flex-1 flex flex-col justify-between pl-6 h-full">
                    <div>
                      <div className="font-normal truncate mb-1">{item.product.name}</div>
                      <div className="mb-4">{item.product.price}</div>
                      <div className="flex items-center space-x-4 mb-2">
                        <button
                          className="w-7 h-7 flex items-center justify-center text-black hover:bg-gray-100"
                          onClick={() => {
                            setCart(prevCart => {
                              const updated = [...prevCart];
                              if (updated[i].quantity > 1) {
                                updated[i] = { ...updated[i], quantity: updated[i].quantity - 1 };
                                return updated;
                              } else {
                                updated.splice(i, 1);
                                return updated;
                              }
                            });
                          }}
                          aria-label="Decrease"
                        >-</button>
                        <span className="mx-1">{item.quantity}</span>
                        <button
                          className="w-7 h-7 flex items-center justify-center text-black hover:bg-gray-100"
                          onClick={() => {
                            setCart(prevCart => {
                              const updated = [...prevCart];
                              updated[i] = { ...updated[i], quantity: updated[i].quantity + 1 };
                              return updated;
                            });
                          }}
                          aria-label="Increase"
                        >+</button>
                      </div>
                    </div>
                    <div className="flex items-center justify-between mt-2">
                      <button
                        className="text-black hover:text-gray-700"
                        onClick={() => {
                          setCart(prevCart => {
                            const updated = [...prevCart];
                            updated.splice(i, 1);
                            return updated;
                          });
                        }}
                        aria-label="Remove"
                      >REMOVE</button>
                      <button
                        className="ml-2"
                        onClick={() => {
                          const updated = [...favorites];
                          const prodIdx = products.findIndex(p => p.name === item.product.name);
                          if (prodIdx !== -1) {
                            updated[prodIdx] = !updated[prodIdx];
                            setFavorites(updated);
                          }
                        }}
                        aria-label="Favorite"
                      >
                        {favorites[products.findIndex(p => p.name === item.product.name)] ? (
                          <FaBookmark className="text-black" />
                        ) : (
                          <FaRegBookmark className="text-black/30" />
                        )}
                      </button>
                    </div>
                  </div>
                </div>
              ))
            )
          ) : (
            products.filter((_, idx) => favorites[idx]).length === 0 ? (
              <div className="flex-1 flex flex-col items-center justify-center">
                <div className="font-bold mb-2">No favourites yet</div>
                <div className="text-gray-400 mb-8 text-center">Add products to your favourites!</div>
              </div>
            ) : (
              <>
                {products.filter((_, idx) => favorites[idx]).length > 0 && (
                  <div className="w-full flex mb-2 pt-4 px-4">
                    <span className="font-bold text-xs">
                      {(context?.user?.username || 'USER').toUpperCase() + "'S LIST"}
                    </span>
                  </div>
                )}
                <div className="grid grid-cols-2 gap-x-4 gap-y-4 px-4 pt-4">
                  {products.map((product, idx) => (
                    favorites[idx] && (
                      <div key={idx} className="bg-white p-0 flex flex-col items-center h-full overflow-hidden">
                        <div
                          className="w-full flex items-center justify-center bg-gray-100 relative"
                          style={{ minHeight: '320px' }}
                        >
                          <img
                            src={product.image}
                            alt={product.name}
                            className="w-40 h-56 object-contain cursor-pointer"
                            onClick={() => { setSelectedProduct(product); setShowProductDetail(true); }}
                          />
                          <button
                            className="absolute left-2 bottom-2 w-5 h-5 bg-white flex items-center justify-center text-black"
                            aria-label="Add"
                            onClick={e => {
                              e.stopPropagation();
                              setCart(prevCart => {
                                const idxCart = prevCart.findIndex(item => item.product.name === product.name);
                                if (idxCart !== -1) {
                                  const updated = [...prevCart];
                                  updated[idxCart] = { ...updated[idxCart], quantity: updated[idxCart].quantity + 1 };
                                  return updated;
                                } else {
                                  return [...prevCart, { product, quantity: 1 }];
                                }
                              });
                            }}
                          >
                            +
                          </button>
                        </div>
                        <div className="w-full bg-white py-2 flex flex-col items-start text-xs">
                          <div className="flex items-center w-full justify-between">
                            <span className="mb-1 truncate">{product.name}</span>
                            <button
                              className=""
                              onClick={() => {
                                const updated = [...favorites];
                                updated[idx] = false;
                                setFavorites(updated);
                              }}
                              aria-label="Favorite"
                            >
                              <FaBookmark className="text-black" />
                            </button>
                          </div>
                          <div className="text-gray-700">{product.price}</div>
                        </div>
                      </div>
                    )
                  ))}
                </div>
              </>
            )
          )}
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
        {!(showCart && cart.length > 0) && (
          <>
            <div className="w-full flex flex-col items-center mt-20 mb-20">
              <input
                type="text"
                placeholder="WHAT ARE YOU LOOKING FOR?"
                value={search}
                onChange={e => setSearch(e.target.value)}
                className="w-full max-w-xs px-4 py-2 text-center text-black placeholder-black focus:placeholder-gray-400 mb-2 focus:outline-none text-xs"
              />
            </div>
            <div className="grid grid-cols-2 gap-x-4 gap-y-4 px-4">
              {products.filter(product =>
                product.name.toLowerCase().includes(search.toLowerCase())
              ).map((product, idx) => (
                <div key={idx} className="bg-white p-0 flex flex-col items-center h-full overflow-hidden">
                  <div
                    className="w-full flex items-center justify-center bg-gray-100 relative"
                    style={{ minHeight: '320px' }}
                  >
                    <img
                      src={product.image}
                      alt={product.name}
                      className="w-40 h-56 object-contain cursor-pointer"
                      onClick={() => { setSelectedProduct(product); setShowProductDetail(true); }}
                    />
                    <button
                      className="absolute left-2 bottom-2 w-5 h-5 bg-white flex items-center justify-center text-black"
                      aria-label="Add"
                      onClick={e => {
                        e.stopPropagation();
                        setCart(prevCart => {
                          const idx = prevCart.findIndex(item => item.product.name === product.name);
                          if (idx !== -1) {
                            const updated = [...prevCart];
                            updated[idx] = { ...updated[idx], quantity: updated[idx].quantity + 1 };
                            return updated;
                          } else {
                            return [...prevCart, { product, quantity: 1 }];
                          }
                        });
                      }}
                    >
                      +
                    </button>
                  </div>
                  <div className="w-full bg-white py-2 flex flex-col items-start text-xs">
                    <div className="flex items-center w-full justify-between">
                      <span className="mb-1 truncate">{product.name}</span>
                      <button
                        className=""
                        onClick={() => {
                          const updated = [...favorites];
                          updated[idx] = !updated[idx];
                          setFavorites(updated);
                        }}
                        aria-label="Favorite"
                      >
                        {favorites[idx] ? (
                          <FaBookmark className="text-black" />
                        ) : (
                          <FaRegBookmark className="text-black/30" />
                        )}
                      </button>
                    </div>
                    <div className="text-gray-700">{product.price}</div>
                  </div>
                </div>
              ))}
            </div>
          </>
        )}
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
