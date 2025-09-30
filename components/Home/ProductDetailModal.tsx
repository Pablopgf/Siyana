import React, { useState } from 'react';
import { FaRegBookmark, FaBookmark, FaShoppingBag } from 'react-icons/fa';

interface Product {
  name: string;
  price: string;
  oldPrice?: string;
  image: string;
  images?: string[];
  description?: string;
  embedUrl?: string;
  embedTitle?: string;
  sizes?: string[]; // Agregar tallas
}

interface CartItem {
  product: Product;
  quantity: number;
  selectedSize?: string; // Agregar talla seleccionada
}

interface Props {
  product: Product;
  onClose: () => void;
  favorites: boolean[];
  setFavorites: (favorites: boolean[]) => void;
  products: Product[];
  cart: CartItem[];
  setCart: (cart: CartItem[]) => void;
  onOpenCart: () => void;
}

export const ProductDetailModal: React.FC<Props> = ({ product, onClose, favorites, setFavorites, products, cart, setCart, onOpenCart }) => {
  const images = product.images || [product.image];
  const [mainImage, setMainImage] = useState(images[0]);
  const [selectedSize, setSelectedSize] = useState<string>(''); // Estado para talla seleccionada

  const productIndex = products.findIndex(p => p.name === product.name);

  const availableSizes = product.sizes || ['XS', 'S', 'M', 'L', 'XL', 'XXL'];

  const handleAddToCart = () => {
    const existingItemIndex = cart.findIndex(
      item => item.product.name === product.name && item.selectedSize === selectedSize
    );

    if (existingItemIndex > -1) {
      const newCart = [...cart];
      newCart[existingItemIndex].quantity += 1;
      setCart(newCart);
    } else {
      setCart([...cart, { product, quantity: 1, selectedSize: selectedSize || undefined }]);
    }
  };

  return (
    <>
      <div className="fixed top-0 left-0 w-full bg-white p-4 pt-16 flex items-center justify-between z-50 border-b border-gray-200">
        <button onClick={onClose} className="text-black text-xl">×</button>
        <button 
          onClick={() => {
            onClose();
            onOpenCart();
          }}
          className="flex items-center space-x-2"
        >
          <FaShoppingBag className="text-black w-5 h-5" />
          <span className="text-black text-xl">
            [{cart.reduce((acc, item) => acc + item.quantity, 0)}]
          </span>
        </button>
      </div>
      <div className="fixed inset-0 z-40 flex flex-col overflow-y-auto pt-20">
        <div className="flex-1 flex flex-col">
          <div
            className="w-full flex items-center justify-center bg-gray-100 relative"
            style={{ minHeight: '600px' }}
          >
            <img
              src={mainImage}
              alt={product.name}
              className="object-contain w-full h-full"
            />
          </div>
          
          <div className="p-4 bg-white border-b border-gray-200">
            <select
              value={selectedSize}
              onChange={(e) => setSelectedSize(e.target.value)}
              className="w-full p-3 border border-gray-300 rounded-lg text-sm bg-white text-black focus:border-black focus:outline-none"
            >
              <option value="">SELECT A SIZE</option>
              {availableSizes.map((size) => (
                <option key={size} value={size}>
                  {size}
                </option>
              ))}
            </select>
            {selectedSize && (
              <p className="text-xs text-gray-600 mt-2">
                Selected size: <span className="font-medium">{selectedSize}</span>
              </p>
            )}
          </div>
          
          <div className="fixed bottom-0 left-0 w-full bg-white p-4 border-t border-gray-200">
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs text-black">{product.name}</span>
              <button
                onClick={() => {
                  const newFavorites = [...favorites];
                  newFavorites[productIndex] = !newFavorites[productIndex];
                  setFavorites(newFavorites);
                }}
                className="text-black"
              >
                {favorites[productIndex] ? <FaBookmark /> : <FaRegBookmark />}
              </button>
            </div>
            
            <span className="text-xs text-black mb-4">{product.price}</span>
            
            <button 
              className="w-full bg-white text-black border border-black py-2 text-xs"
              onClick={handleAddToCart}
            >
              ADD
            </button>
          </div>
        </div>
      </div>
    </>
  );
}; 