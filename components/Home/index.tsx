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
import { ProductDetailModal } from './ProductDetailModal';
import { BalanceModal } from './BalanceModal';
import { Header } from './Header';
import { useSendTransaction, useAccount } from 'wagmi'
import { parseUnits, encodeFunctionData } from 'viem'

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
    name: 'SIYANA BASIC PILL TEE MOCKUP BLACK',
    price: '100000 SYYN',
    image: '/images/SIYANA BASIC PILL TEE MOCKUP BLACK.png',
  },
  {
    name: 'SIYANA 2',
    price: '$19.99',
    image: '/images/icon.png',
  },
  // {
  //   name: 'SIYANA 3',
  //   price: '$29.99',
  //   image: '/images/icon.png',
  // },
  // {
  //   name: 'SIYANA 4',
  //   price: '$39.99',
  //   image: '/images/icon.png',
  // },
];

const CartIcon = ({ count }: { count: number }) => (
  <div className="relative w-6 h-6">
    <FaShoppingBag className="w-5 h-5 text-black" />
  </div>
);

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
  const [showAddMessage, setShowAddMessage] = useState(false);
  const [showBalanceModal, setShowBalanceModal] = useState(false);
  const [isProcessingTransaction, setIsProcessingTransaction] = useState(false);
  // const [showUser, setShowUser] = useState(false)

  const { setFrameReady, isFrameReady } = useMiniKit();
  const { sendTransaction, isPending, data: transactionHash } = useSendTransaction();
  const { address, isConnected } = useAccount();
  
  // Monitorear el estado de la transacción
  useEffect(() => {
    if (transactionHash && !isPending) {
      // Transacción completada
      console.log('Transaction completed:', transactionHash);
      alert(`Transaction completed successfully!\nHash: ${transactionHash}\nView on BaseScan: https://basescan.org/tx/${transactionHash}`);
    }
  }, [transactionHash, isPending]);
  
  const handleBuyTransaction = async () => {
    if (cart.length === 0) return;
    
    if (!isConnected) {
      alert('Please connect your wallet first');
      return;
    }
    
    setIsProcessingTransaction(true);
    
    try {
      // Calcular total en SYYN
      const total = cart.reduce((acc, item) => {
        if (item.product.price.includes('SYYN')) {
          const unitPrice = parseFloat(item.product.price.replace(' SYYN', ''));
          return acc + (unitPrice * item.quantity);
        } else {
          const unitPrice = parseFloat(item.product.price.replace('$', ''));
          return acc + (unitPrice * item.quantity);
        }
      }, 0);
      
      // Dirección del contrato SYYN en Base
      const syynContractAddress = '0xc7562d0536D3bF5A92865AC22062A2893e45Cb07';
      
      // Wallet de destino (puedes cambiar esta dirección)
      const destinationWallet = '0xf7b746290436Fd276045A5Dc2b53b7a5D4261D39';
      // const destinationWallet = '0xBbf814B2bcE970e6720EF8CB8c19bA7D902319ce';
      
      // ABI para transferir tokens ERC-20
      const transferAbi = [
        {
          name: 'transfer',
          type: 'function',
          stateMutability: 'nonpayable',
          inputs: [
            { name: 'to', type: 'address' },
            { name: 'amount', type: 'uint256' }
          ],
          outputs: [{ name: '', type: 'bool' }]
        }
      ];
      
      // Enviar transacción real
      sendTransaction({
        to: syynContractAddress,
        data: encodeFunctionData({
          abi: transferAbi,
          functionName: 'transfer',
          args: [destinationWallet, parseUnits(total.toString(), 18)]
        }),
        chainId: 8453, // Base network
      });
      
      alert(`Transaction sent! Processing ${total.toLocaleString()} SYYN to ${destinationWallet}\nCheck your wallet for transaction status.`);
      
      // Limpiar carrito después de transacción enviada
      setCart([]);
      
    } catch (error) {
      console.error('Transaction failed:', error);
      const errorMessage = error instanceof Error ? error.message : 'Unknown error';
      alert(`Transaction failed: ${errorMessage}`);
    } finally {
      setIsProcessingTransaction(false);
    }
  };
  
  useEffect(() => {
    if (!isFrameReady) {
      setFrameReady();
    }
  }, [setFrameReady, isFrameReady]);

  useEffect(() => {
    const storedCart = localStorage.getItem('cart');
    if (storedCart) {
      try {
        setCart(JSON.parse(storedCart));
      } catch {}
    }
  }, []);
  useEffect(() => {
    localStorage.setItem('cart', JSON.stringify(cart));
  }, [cart]);

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





  if (showFlappyBird) {
    return (
      <div className="w-full h-screen">
        <Header 
          onBalanceClick={() => setShowBalanceModal(true)} 
          onLogoClick={() => setShowFlappyBird(false)}
        />
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
        <Header 
          onBalanceClick={() => setShowBalanceModal(true)} 
          onLogoClick={() => setShowCart(false)}
        />
        <div className="fixed top-0 left-0 w-full bg-white z-10 flex items-center px-4 pt-20 pb-4">
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
        <div className="flex-1 overflow-y-auto mb-16">
          {activeCartTab === 'cart' ? (
            cart.length === 0 ? (
              <div className="flex-1 flex flex-col items-center justify-center">
                <div className="mb-6 flex items-center justify-center">
                  <div className="bg-gray-100 rounded-full w-16 h-16 flex items-center justify-center">
                    <FaShoppingBag className="text-gray-400" size={16} />
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
              <>
                {cart.map((item, i) => (
                  <div key={i} className="flex w-full pt-10 px-4 items-start pt-32 pb-4">
                    <div className="w-40 h-64 flex-shrink-0 flex items-center justify-center bg-gray-100 overflow-hidden">
                      <img src={item.product.image} alt={item.product.name} className="object-contain w-full h-full" />
                    </div>
                    <div className="flex-1 flex flex-col justify-between pl-6 h-full min-h-[224px] py-4">
                      <div>
                        <div className="font-normal break-words leading-tight mb-1">{item.product.name}</div>
                        <div className="mb-4">
                          {(() => {
                            if (item.product.price.includes('SYYN')) {
                              const unitPrice = parseFloat(item.product.price.replace(' SYYN', ''));
                              const totalPrice = unitPrice * item.quantity;
                              return `${totalPrice.toLocaleString()} SYYN`;
                            } else {
                              const unitPrice = parseFloat(item.product.price.replace('$', ''));
                              const totalPrice = unitPrice * item.quantity;
                              return `$${totalPrice.toFixed(2)}`;
                            }
                          })()}
                        </div>
                        <div className="flex items-center space-x-4 mb-2">
                          <button
                            className="w-7 h-7 flex items-center justify-center text-black"
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
                            className="w-7 h-7 flex items-center justify-center text-black"
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
                      <div className="flex items-center justify-between">
                        <button
                          className="text-black"
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
                ))}
                <div className="fixed bottom-0 left-0 w-full bg-white px-4 py-4 flex items-center justify-between">
                  <button 
                    className={`px-16 py-3 ${isProcessingTransaction || isPending ? 'bg-gray-400 cursor-not-allowed' : 'bg-black hover:bg-gray-800'} text-white transition-colors`}
                    onClick={() => {
                      if (!isProcessingTransaction && !isPending && cart.length > 0) {
                        handleBuyTransaction();
                      }
                    }}
                    disabled={isProcessingTransaction || isPending || cart.length === 0}
                  >
                    {isProcessingTransaction || isPending ? 'PROCESSING...' : 'BUY'}
                  </button>
                  <span className="text-black">
                    {(() => {
                      const total = cart.reduce((acc, item) => {
                        if (item.product.price.includes('SYYN')) {
                          // Para "100.000 SYYN", removemos solo " SYYN" y convertimos a número
                          const unitPrice = parseFloat(item.product.price.replace(' SYYN', ''));
                          return acc + (unitPrice * item.quantity);
                        } else {
                          const unitPrice = parseFloat(item.product.price.replace('$', ''));
                          return acc + (unitPrice * item.quantity);
                        }
                      }, 0);
                      
                      if (cart.some(item => item.product.price.includes('SYYN'))) {
                        return `${total.toLocaleString()} SYYN`;
                      } else {
                        return `$${total.toFixed(2)}`;
                      }
                    })()}
                  </span>
                </div>
              </>
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
                  <div className="w-full flex mb-2 pt-20 px-4">
                    <span className="font-bold text-xs">
                      {(context?.user?.username || 'USER').toUpperCase() + "'S LIST"}
                    </span>
                  </div>
                )}
                <div className="grid grid-cols-2 gap-x-6 gap-y-4 px-4 pt-4">
                  {products.map((product, idx) => (
                    favorites[idx] && (
                      <div key={idx} className="bg-white p-0 flex flex-col items-center h-full overflow-hidden">
                        <div
                          className="w-full flex items-center justify-center bg-gray-100 relative"
                          style={{ minHeight: '240px' }}
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
                            <span className="mb-1 break-words leading-tight">{product.name}</span>
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
                          <div className="text-gray-700 mb-2">{product.price}</div>
                          <button
                            className="w-full bg-white text-black border border-black py-2 text-xs font-medium"
                            onClick={() => {
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
                              setShowAddMessage(true);
                              setTimeout(() => setShowAddMessage(false), 2000);
                            }}
                            aria-label="Add to cart"
                          >
                            ADD
                          </button>
                        </div>
                      </div>
                    )
                  ))}
                </div>
                {showAddMessage && (
                  <div className="fixed bottom-16 left-0 w-full bg-black text-white p-4 text-xs z-40 flex items-center justify-between">
                    <span>Product added to shopping bag</span>
                    <button 
                      className="text-white text-xs"
                      onClick={() => setActiveCartTab('cart')}
                    >
                      VIEW
                    </button>
                  </div>
                )}
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
          favorites={favorites}
          setFavorites={setFavorites}
          products={products}
          cart={cart}
          setCart={setCart}
          onOpenCart={() => setShowCart(true)}
        />
      )}
      <div className="min-h-screen bg-white w-full">
        <Header 
          onBalanceClick={() => setShowBalanceModal(true)} 
          onLogoClick={() => {
            setShowCart(false);
            setShowFlappyBird(false);
            setShowProductDetail(false);
          }}
        />
        
        {!(showCart && cart.length > 0) && (
          <>
            {/* <div className="w-full flex flex-col items-center pt-32 pb-20">
              <input
                type="text"
                placeholder="WHAT ARE YOU LOOKING FOR?"
                value={search}
                onChange={e => setSearch(e.target.value)}
                className="w-full max-w-xs px-4 py-2 text-center text-black placeholder-black focus:placeholder-gray-400 mb-2 focus:outline-none text-xs"
              />
            </div> */}
            <div className="grid grid-cols-2 gap-x-6 gap-y-4 pt-20 px-4">
              {products.filter(product =>
                product.name.toLowerCase().includes(search.toLowerCase())
              ).map((product, idx) => (
                <div key={idx} className="bg-white p-0 flex flex-col items-center h-full overflow-hidden">
                  <div
                    className="w-full flex items-center justify-center bg-gray-100 relative"
                    style={{ minHeight: '240px' }}
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
                      <span className="mb-1 truncate max-w-[120px] overflow-hidden">{product.name}</span>
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
        {!showProductDetail && (
          <footer className="fixed bottom-0 left-0 w-full bg-white p-2 flex justify-around items-center z-50">
            <button className="flex items-center justify-center w-5 h-5">
              <AiOutlineHome className="text-black w-5 h-5" />
            </button>
            <button 
              onClick={() => setShowCart(true)}
              className="flex items-center justify-center w-5 h-5"
            >
              <CartIcon count={cart.reduce((acc, item) => acc + item.quantity, 0)} />
            </button>
          </footer>
        )}
      </div>
      
      <BalanceModal 
        isOpen={showBalanceModal} 
        onClose={() => setShowBalanceModal(false)} 
      />
    </>
  )
}
