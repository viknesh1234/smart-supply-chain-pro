// src/components/ProductList.tsx

import React, { useEffect, useState } from 'react';
import { getProducts } from '../api/api';
import { Product } from '../types/Product';

const ProductList = () => {
  const [products, setProducts] = useState<Product[]>([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const data = await getProducts();
        setProducts(data);
      } catch (error) {
        console.error('Failed to fetch products', error);
      }
    };

    fetchData();
  }, []);

  return (
    <div className="p-4">
      <h1 className="text-xl font-bold mb-2">Product List</h1>
      <ul className="space-y-2">
        {products.map((p) => (
          <li key={p.id} className="bg-gray-100 p-2 rounded shadow-sm">
            <strong>{p.name}</strong> — ₹{p.price}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default ProductList;
