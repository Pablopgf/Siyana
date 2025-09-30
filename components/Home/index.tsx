'use client'

import { useState, useEffect } from 'react'
import { AiOutlineHome } from 'react-icons/ai'
import { useFrame } from '@/components/farcaster-provider'
import { FarcasterActions } from '@/components/Home/FarcasterActions'
import { User } from '@/components/Home/User'
import { WalletActions } from '@/components/Home/WalletActions'
import { FlappyBird } from '@/components/FlappyBird'
import { useMiniKit } from '@coinbase/onchainkit/minikit'
import { FaRegClipboard, FaShoppingBag, FaRegBookmark, FaBookmark, FaArrowLeft } from 'react-icons/fa'
import { ProductDetailModal } from './ProductDetailModal';
import { BalanceModal } from './BalanceModal';
import { ShippingModal } from './ShippingModal';
import { Header } from './Header';
import { useSendTransaction, useAccount } from 'wagmi'
import { parseUnits, encodeFunctionData } from 'viem'

interface Product {
  name: string;
  price: string;
  image: string;
  sizes?: string[];
  disabled?: boolean; // Agregar propiedad disabled
}

interface CartItem {
  product: Product;
  quantity: number;
  selectedSize?: string;
}

const products = [
  {
    name: '1 BLACK FRONT',
    price: '25.000.000 SYYN',
    image: '/images/1 BLACK FRONT.png',
    sizes: ['XS', 'S', 'M', 'L', 'XL', 'XXL'],
  },
  {
    name: '1 GREEN FRONT',
    price: '25.000.000 SYYN',
    image: '/images/1 GREEN FRONT.png',
    sizes: ['XS', 'S', 'M', 'L', 'XL', 'XXL'],
  },
  {
    name: '1 GREY FRONT',
    price: '25.000.000 SYYN',
    image: '/images/1 GREY FRONT.png',
    sizes: ['XS', 'S', 'M', 'L', 'XL', 'XXL'],
  },
  {
    name: '',
    price: '',
    image: '/images/COMING SOON ORELAUNCH.jpg',
    sizes: ['XS', 'S', 'M', 'L', 'XL', 'XXL'],
    disabled: true,
  },
];

const CartIcon = ({ count }: { count: number }) => (
  <div className="flex items-center space-x-1">
    <FaShoppingBag className="w-5 h-5 text-black" />
    <span className="text-black text-xl">
      [{count}]
    </span>
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
  const [showShippingModal, setShowShippingModal] = useState(false);
  const [showShippingForm, setShowShippingForm] = useState(false);
  const [shippingData, setShippingData] = useState({
    name: '',
    lastName: '',
    address: '',
    flatNumber: '',
    state: '',
    city: '',
    postCode: '',
    prefix: '+34',
    mobile: ''
  });
  const [shippingErrors, setShippingErrors] = useState<{[key: string]: boolean}>({});

  const { setFrameReady, isFrameReady } = useMiniKit();
  const { sendTransaction, isPending, data: transactionHash } = useSendTransaction();
  const { address, isConnected } = useAccount();
  
  useEffect(() => {
    if (transactionHash && !isPending) {
      console.log('Transaction completed:', transactionHash);
      
      if (!shippingData || !shippingData.name) {
        alert(`Transaction completed successfully!\nHash: ${transactionHash}\nView on BaseScan: https://basescan.org/tx/${transactionHash}\n\n⚠️ No shipping data available - Email not sent`);
        setCart([]);
        return;
      }
      
      alert(`Transaction completed successfully!\nHash: ${transactionHash}\nView on BaseScan: https://basescan.org/tx/${transactionHash}\n\n📧 Sending email to pablopgf46@gmail.com...`);
      
      fetch('/api/send-email', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          shippingData,
          transactionHash,
        }),
      })
      .then(response => {
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        return response.json();
      })
      .then(data => {
        if (data.success) {
          alert(`✅ Transaction completed successfully!\nHash: ${transactionHash}\nView on BaseScan: https://basescan.org/tx/${transactionHash}\n\n📧 Email sent successfully to pablopgf46@gmail.com`);
        } else {
          alert(`✅ Transaction completed successfully!\nHash: ${transactionHash}\nView on BaseScan: https://basescan.org/tx/${transactionHash}\n\n⚠️ Email could not be sent: ${data.error}`);
        }
      })
      .catch(error => {
        alert(`✅ Transaction completed successfully!\nHash: ${transactionHash}\nView on BaseScan: https://basescan.org/tx/${transactionHash}\n\n❌ Email failed: ${error.message}`);
      });
      
      setCart([]);
    }
  }, [transactionHash, isPending, shippingData]);

  useEffect(() => {
    if (!isPending && !transactionHash && isProcessingTransaction) {
      console.log('Transaction cancelled');
      setIsProcessingTransaction(false);
    }
  }, [isPending, transactionHash, isProcessingTransaction]);
  
  const handleBuyTransaction = async () => {
    if (cart.length === 0) return;
    
    if (!isConnected) {
      alert('Please connect your wallet first');
      return;
    }
    
    loadSavedAddresses();
    setShowShippingForm(true);
  };

  const loadSavedAddresses = () => {
    const savedAddresses = localStorage.getItem('userAddresses');
    if (savedAddresses) {
      try {
        const addresses = JSON.parse(savedAddresses);
        if (addresses.length > 0) {
          const firstAddress = addresses[0];
          setShippingData({
            name: firstAddress.name || '',
            lastName: firstAddress.lastName || '',
            address: firstAddress.address || '',
            flatNumber: firstAddress.flatNumber || '',
            state: firstAddress.state || '',
            city: firstAddress.city || '',
            postCode: firstAddress.postCode || '',
            prefix: firstAddress.prefix || '+34',
            mobile: firstAddress.mobile || ''
          });
        }
      } catch (error) {
        console.error('Error loading saved addresses:', error);
      }
    }
  };

  const handleShippingSubmit = async () => {
    // Validar campos requeridos
    const newErrors: {[key: string]: boolean} = {};
    const requiredFields = ['name', 'address', 'state', 'city', 'postCode'];
    requiredFields.forEach(field => {
      if (!shippingData[field as keyof typeof shippingData]) {
        newErrors[field] = true;
      }
    });

    if (Object.keys(newErrors).length > 0) {
      setShippingErrors(newErrors);
      return;
    }

    setShowShippingForm(false);
    setIsProcessingTransaction(true);
    
    try {
      const total = cart.reduce((acc, item) => {
        if (item.product.price.includes('SYYN')) {
          const cleanPrice = item.product.price.replace(' SYYN', '').replace(/\./g, '');
          const unitPrice = parseFloat(cleanPrice);
          return acc + (unitPrice * item.quantity);
        } else {
          const unitPrice = parseFloat(item.product.price.replace('$', ''));
          return acc + (unitPrice * item.quantity);
        }
      }, 0);
      
      const syynContractAddress = '0xc7562d0536D3bF5A92865AC22062A2893e45Cb07';
      const destinationWallet = '0xBbf814B2bcE970e6720EF8CB8c19bA7D902319ce';
      
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
      
      sendTransaction({
        to: syynContractAddress,
        data: encodeFunctionData({
          abi: transferAbi,
          functionName: 'transfer',
          args: [destinationWallet, parseUnits(total.toString(), 18)]
        }),
        chainId: 8453,
      });
      
    } catch (error) {
      console.error('Transaction failed:', error);
      const errorMessage = error instanceof Error ? error.message : 'Unknown error';
      alert(`Transaction failed: ${errorMessage}`);
      setIsProcessingTransaction(false);
      setShowShippingForm(true);
    }
  };

  const handleShippingInputChange = (field: string, value: string) => {
    setShippingData(prev => ({ ...prev, [field]: value }));
    if (shippingErrors[field]) {
      setShippingErrors(prev => ({ ...prev, [field]: false }));
    }
  };
  
  useEffect(() => {
    if (!isFrameReady) {
      setFrameReady();
    }
  }, [setFrameReady, isFrameReady]);

  useEffect(() => {
    loadSavedAddresses();
  }, []);

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
        {!showShippingForm && (
        <Header 
          onBalanceClick={() => setShowBalanceModal(true)} 
          onLogoClick={() => setShowCart(false)}
        />
        )}
        {!showShippingForm && (
        <div className="fixed top-0 left-0 w-full bg-white flex items-center px-4 pt-20 pb-4">
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
            className="ml-auto text-xl text-gray-500 hover:text-black"
            aria-label="Close"
          >
            ×
          </button>
        </div>
        )}
        <div className="flex-1 overflow-y-auto mb-16">
          {showShippingForm ? (
            <div className="p-4">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center">
                  <button
                    onClick={() => setShowShippingForm(false)}
                    className="text-black text-xs mr-4"
                  >
                    <FaArrowLeft size={16} />
                  </button>
                  <h2 className="text-xs text-black">SHIPPING INFORMATION</h2>
                </div>
              </div>
              
              <div className="space-y-6">
                <div>
                  <input
                    type="text"
                    value={shippingData.name}
                    onChange={(e) => handleShippingInputChange('name', e.target.value)}
                    className={`w-full pb-1 border-b text-black text-xs ${shippingErrors.name ? 'border-red-500' : 'border-gray-300'} bg-transparent outline-none`}
                    placeholder="NAME"
                  />
                  {shippingErrors.name && <p className="text-red-500 text-xs mt-1">This field is mandatory.</p>}
                </div>

                <div>
                  <input
                    type="text"
                    value={shippingData.lastName}
                    onChange={(e) => handleShippingInputChange('lastName', e.target.value)}
                    className="w-full pb-1 border-b text-black  text-xs border-gray-300 bg-transparent outline-none"
                    placeholder="LAST NAME"
                  />
                </div>

                <div>
                  <input
                    type="text"
                    value={shippingData.address}
                    onChange={(e) => handleShippingInputChange('address', e.target.value)}
                    className={`w-full pb-1 border-b text-black  text-xs ${shippingErrors.address ? 'border-red-500' : 'border-gray-300'} bg-transparent outline-none`}
                    placeholder="ADDRESS"
                  />
                  {shippingErrors.address && <p className="text-red-500 text-xs mt-1">This field is mandatory.</p>}
                </div>

                <div>
                  <input
                    type="text"
                    value={shippingData.flatNumber}
                    onChange={(e) => handleShippingInputChange('flatNumber', e.target.value)}
                    className="w-full pb-1 border-b text-black  text-xs border-gray-300 bg-transparent outline-none"
                    placeholder="FLAT NUMBER AND/OR LETTER"
                  />
                </div>

                <div>
                  <input
                    type="text"
                    value={shippingData.state}
                    onChange={(e) => handleShippingInputChange('state', e.target.value)}
                    className={`w-full pb-1 border-b text-black  text-black text-xs ${shippingErrors.city ? 'border-red-500' : 'border-gray-300'} bg-transparent outline-none`}
                    placeholder="STATE"
                  />
                  {shippingErrors.state && <p className="text-red-500 text-xs mt-1">This field is mandatory.</p>}
                </div>

                <div>
                  <input
                    type="text"
                    value={shippingData.city}
                    onChange={(e) => handleShippingInputChange('city', e.target.value)}
                    className={`w-full pb-1 border-b text-black text-xs ${shippingErrors.city ? 'border-red-500' : 'border-gray-300'} bg-transparent outline-none`}
                    placeholder="CITY"
                  />
                  {shippingErrors.city && <p className="text-red-500 text-xs mt-1">This field is mandatory.</p>}
                </div>

                <div>
                  <input
                    type="text"
                    value={shippingData.postCode}
                    onChange={(e) => handleShippingInputChange('postCode', e.target.value)}
                    className={`w-full pb-1 border-b text-black text-xs ${shippingErrors.postCode ? 'border-red-500' : 'border-gray-300'} bg-transparent outline-none`}
                    placeholder="POST CODE"
                  />
                  {shippingErrors.postCode && <p className="text-red-500 text-xs mt-1">This field is mandatory.</p>}
                </div>

                <div className="flex space-x-2">
                  <div className="w-1/3">
                    <p className="text-gray-500 text-xs">PREFIX</p>
                    <input
                      type="text"
                      value={shippingData.prefix}
                      onChange={(e) => handleShippingInputChange('prefix', e.target.value)}
                      className="w-full pb-1 border-b text-black text-xs border-gray-300 bg-transparent outline-none"
                      placeholder="+34"
                    />
                  </div>
                  <div className="w-2/3">
                    <p className="text-xs text-transparent">TEXT TRANSPARENT</p>
                    <input
                      type="text"
                      value={shippingData.mobile}
                      onChange={(e) => handleShippingInputChange('mobile', e.target.value)}
                      className="w-full pb-1 border-b text-black text-xs border-gray-300 bg-transparent outline-none"
                      placeholder="MOBILE"
                    />
                  </div>
                </div>

                <div className="pt-8">
                  <button
                    onClick={handleShippingSubmit}
                    className="w-full bg-white border border-black py-3 px-4 hover:bg-gray-100 transition-colors text-black text-xs"
                  >
                    CONTINUE TO PAYMENT
                  </button>
                </div>
              </div>
            </div>
          ) : (
            activeCartTab === 'cart' ? (
            cart.length === 0 ? (
              <div className="flex-1 flex flex-col items-center justify-center">
                <div className="mb-6 flex items-center justify-center">
                  <div className="bg-gray-100 rounded-full w-16 h-16 flex items-center justify-center">
                    <FaShoppingBag className="text-gray-400" size={16} />
                  </div>
                </div>
              </div>
            ) : (
              <>
                {cart.map((item, i) => (
                  <div key={i} className="flex w-full pt-10 px-4 items-start pt-32 pb-4">
                    <div className="w-40 h-64 flex-shrink-0 flex items-center justify-center overflow-hidden">
                      <img src={item.product.image} alt={item.product.name} className="object-contain w-full h-full" />
                    </div>
                    <div className="flex-1 flex flex-col justify-between pl-6 h-full min-h-[224px] py-4">
                      <div>
                        <div className="font-normal break-words leading-tight mb-1 text-black">{item.product.name}</div>
                        {item.selectedSize && (
                          <div className="text-xs mb-2">
                            <span className="text-black text-xs">{item.selectedSize}</span>
                          </div>
                        )}
                        <div className="mb-4 text-black">
                          {(() => {
                            if (item.product.price.includes('SYYN')) {
                              const cleanPrice = item.product.price.replace(' SYYN', '').replace(/\./g, '');
                              const unitPrice = parseFloat(cleanPrice);
                              const totalPrice = unitPrice * item.quantity;
                              return `${totalPrice.toLocaleString()} SYYN`;
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
                          <span className="mx-1 text-black">{item.quantity}</span>
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
                            const cleanPrice = item.product.price.replace(' SYYN', '').replace(/\./g, '');
                            const unitPrice = parseFloat(cleanPrice);
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
              </div>
            ) : (
              <>
                {products.filter((_, idx) => favorites[idx]).length > 0 && (
                  <div className="w-full flex mb-2 pt-20 px-4">
                      <span className="font-bold text-xs text-black">
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
                            onClick={() => { 
                              setSelectedProduct(product); 
                              setShowProductDetail(true);
                            }}
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
                                setShowAddMessage(true);
                                setTimeout(() => setShowAddMessage(false), 2000);
                            }}
                          >
                            +
                          </button>
                        </div>
                        <div className="w-full bg-white py-2 flex flex-col items-start text-xs">
                          <div className="flex items-center w-full justify-between">
                              <span className="mb-1 break-words leading-tight text-black">{product.name}</span>
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
                            <div className="text-gray-700 mb-2 text-black">{product.price}</div>
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
                  <div className="fixed bottom-0 left-0 w-full bg-black text-white p-4 text-xs z-40 flex items-center justify-between">
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
            oldPrice: selectedProduct.price === '$29.97' ? '$29.97' : undefined
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
            <div className="grid grid-cols-2 gap-x-6 gap-y-4 pt-20 px-4">
              {products.filter(product =>
                product.name.toLowerCase().includes(search.toLowerCase())
              ).map((product, idx) => (
                <div key={idx} className={`bg-white p-0 flex flex-col items-center h-full overflow-hidden ${product.disabled ? 'opacity-50 pointer-events-none' : ''}`}>
                  <div
                    className="w-full flex items-center justify-center relative"
                    style={{ minHeight: '240px' }}
                  >
                    <img
                      src={product.image}
                      alt={product.name}
                      className="w-40 h-56 object-contain cursor-pointer"
                      onClick={() => { 
                        if (!product.disabled) {
                          setSelectedProduct(product); 
                          setShowProductDetail(true);
                        }
                      }}
                    />
                    {!product.disabled && (
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
                          setShowAddMessage(true);
                          setTimeout(() => setShowAddMessage(false), 3000);
                        }}
                      >
                        +
                      </button>
                    )}
                  </div>
                  <div className="w-full bg-white py-2 flex flex-col items-start text-xs">
                    <div className="flex items-center w-full justify-between">
                      <span className="mb-1 truncate max-w-[120px] overflow-hidden text-black">{product.name}</span>
                      {!product.disabled && (
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
                      )}
                    </div>
                    <div className="text-gray-700 text-black">{product.price}</div>
                  </div>
                </div>
              ))}
            </div>
          </>
        )}
        {!showProductDetail && (
          <footer className="fixed bottom-0 left-0 w-full bg-white p-2 flex justify-around items-center z-50">
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
      
      {/* <ShippingModal
        isOpen={showShippingModal}
        onClose={() => setShowShippingModal(false)}
        onSubmit={handleShippingSubmit}
        initialData={shippingData}
      /> */}
    </>
  )
}
