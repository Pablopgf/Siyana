import React, { useState } from 'react';
import { FaRegBookmark, FaBookmark, FaShoppingBag } from 'react-icons/fa';

interface Product {
  name: string;
  price: string;
  oldPrice?: string;
  image: string;
  images?: string[];
  description?: string;
}

interface CartItem {
  product: Product;
  quantity: number;
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

  const productIndex = products.findIndex(p => p.name === product.name);

  return (
    <>
      <div className="fixed top-10 left-0 w-full bg-white p-4 pt-8 flex items-center justify-between z-50">
        <button onClick={onClose} className="text-xl">×</button>
        <button 
          onClick={() => {
            onClose();
            onOpenCart();
          }}
          className="flex items-center justify-center w-6 h-6"
        >
          <FaShoppingBag className="text-black w-5 h-5" />
        </button>
      </div>
      <div className="fixed inset-0 z-40 flex flex-col overflow-y-auto pt-16">
        <div className="flex flex-col items-center bg-white pb-2 px-4">
          <div
            className="w-full flex items-center justify-center bg-gray-100 relative"
            style={{ minHeight: '592px' }}
          >
            <img
              src={mainImage}
              alt={product.name}
              className="w-full h-112 object-contain"
            />
          </div>
        </div>
        <div className="flex flex-col items-center bg-white px-4 pb-10 mb-20">
          {product.description && <p className="mb-4 text-gray-700 text-center text-xs">{product.description}</p>}
        </div>
        <div className="fixed bottom-0 left-0 w-full bg-white p-4 flex flex-col items-center">
          <div className="flex flex-col w-full">
            <div className="flex items-center justify-between">
              <span className="text-xs text-black">{product.name}</span>
              <button
                className=""
                onClick={() => {
                  const updated = [...favorites];
                  updated[productIndex] = !updated[productIndex];
                  setFavorites(updated);
                }}
                aria-label="Favorite"
              >
                {favorites[productIndex] ? (
                  <FaBookmark className="text-black" />
                ) : (
                  <FaRegBookmark className="text-black/30" />
                )}
              </button>
            </div>
            <span className="text-xs text-black mb-4">{product.price}</span>
            <button 
              className="w-full bg-white text-black border border-black py-2 text-xs"
              onClick={() => {
                const updatedCart = [...cart];
                const idx = updatedCart.findIndex((item: CartItem) => item.product.name === product.name);
                if (idx !== -1) {
                  updatedCart[idx] = { ...updatedCart[idx], quantity: updatedCart[idx].quantity + 1 };
                } else {
                  updatedCart.push({ product, quantity: 1 });
                }
                setCart(updatedCart);
              }}
            >
              ADD
            </button>
          </div>
        </div>
      </div>
    </>
  );
}; 