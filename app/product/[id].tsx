import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';

const mockProducts = [
  {
    id: 'tiny-hyper-tee',
    name: 'Tiny Hyper Tee',
    price: 25.47,
    oldPrice: 29.97,
    images: ['/images/icon.png', '/images/icon.png', '/images/icon.png', '/images/icon.png'],
    description: 'A cool green tee with a pixel art cat. Minted Merch.'
  },
  {
    id: 'cryptoadickbuttz-og-tee',
    name: 'CryptoaDickButtz OG Tee',
    price: 24.97,
    oldPrice: 29.97,
    images: ['/images/icon.png'],
    description: 'OG Tee for the true fans.'
  },
  // ...otros productos
];

export default function ProductDetail({ params }: { params: { id: string } }) {
  const { id } = params;
  const product = mockProducts.find(p => p.id === id);
  const [mainImage, setMainImage] = useState(product?.images[0]);

  if (!product) {
    return <div className="p-8">Producto no encontrado.</div>;
  }

  return (
    <div className="min-h-screen bg-white flex flex-col items-center p-4">
      <div className="w-full max-w-md">
        <button className="mb-4 text-lg" onClick={() => window.close()}>&larr; Volver</button>
        <h1 className="text-2xl font-bold mb-2">{product.name}</h1>
        <div className="flex flex-col items-center">
          <img src={mainImage} alt={product.name} className="w-64 h-64 object-contain rounded-xl mb-2 border" />
          <div className="flex space-x-2 mb-4">
            {product.images.map((img, idx) => (
              <img
                key={idx}
                src={img}
                alt={product.name + ' thumb'}
                className={`w-12 h-12 object-contain rounded border cursor-pointer ${mainImage === img ? 'border-blue-500' : 'border-gray-200'}`}
                onClick={() => setMainImage(img)}
              />
            ))}
          </div>
        </div>
        <div className="flex items-center space-x-2 mb-2">
          <span className="text-gray-400 line-through text-lg">${product.oldPrice.toFixed(2)}</span>
          <span className="text-green-600 text-2xl font-bold">${product.price.toFixed(2)}</span>
        </div>
        <p className="mb-6 text-gray-700">{product.description}</p>
        <button className="w-full bg-green-500 hover:bg-green-600 text-white font-semibold py-3 rounded-lg text-lg transition">
          Add to Cart - ${product.price.toFixed(2)}
        </button>
      </div>
    </div>
  );
} 