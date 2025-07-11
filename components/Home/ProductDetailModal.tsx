import React, { useState } from 'react';

interface Product {
  name: string;
  price: string;
  oldPrice?: string;
  image: string;
  images?: string[];
  description?: string;
}

interface Props {
  product: Product;
  onClose: () => void;
}

export const ProductDetailModal: React.FC<Props> = ({ product, onClose }) => {
  const images = product.images || [product.image];
  const [mainImage, setMainImage] = useState(images[0]);

  return (
    <div className="fixed inset-0 bg-white z-50 flex flex-col min-h-screen pt-12">
      <div className="bg-white shadow p-4 relative flex items-center">
        <button onClick={onClose} className="mr-3 text-2xl font-bold">&larr;</button>
        <span className="text-lg font-semibold">{product.name}</span>
      </div>
      <div className="flex flex-col items-center bg-white pt-4 pb-2">
        <img src={mainImage} alt={product.name} className="w-64 h-64 object-contain rounded-xl mb-2 border" />
        <div className="flex space-x-2 mb-2">
          {images.map((img, idx) => (
            <img
              key={idx}
              src={img}
              alt={product.name + ' thumb'}
              className={`w-12 h-12 object-contain rounded border cursor-pointer ${mainImage === img ? 'border-green-600' : 'border-gray-200'}`}
              onClick={() => setMainImage(img)}
            />
          ))}
        </div>
      </div>
      <div className="flex flex-col items-center bg-white px-4 pb-10">
        <div className="flex items-center space-x-2 mt-2 mb-1">
          {product.oldPrice && (
            <span className="text-gray-400 line-through text-lg">{product.oldPrice}</span>
          )}
          <span className="text-green-600 text-2xl font-bold">{product.price}</span>
        </div>
        <span className="text-lg font-semibold mb-2">{product.name}</span>
        {product.description && <p className="mb-4 text-gray-700 text-center">{product.description}</p>}
      </div>
      <div className="w-full bg-white p-4 border-t flex justify-center z-50">
        <button className="w-full max-w-md bg-[#1652f0] hover:bg-blue-700 text-white font-semibold py-3 transition">
          ADD TO CART
        </button>
      </div>
    </div>
  );
}; 