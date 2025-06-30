import React, { useState } from 'react';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { addProduct } from '@/api/api';
import { Product } from '@/types/Product';

type AddProductFormProps = {
  defaultExpiryDate: string;
};

const AddProductForm: React.FC<AddProductFormProps> = ({ defaultExpiryDate }) => {
  const queryClient = useQueryClient();

  const [formData, setFormData] = useState<Product>({
    name: '',
    sku: '',
    category: '',
    price: 0,
    threshold: 0,
    stockLevel: 0,
    minStock: 0,
    maxStock: 0,
    expiryDate: defaultExpiryDate,
  });

  const mutation = useMutation({
    mutationFn: addProduct,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['products'] });
      alert('✅ Product added successfully!');
      setFormData({
        name: '',
        sku: '',
        category: '',
        price: 0,
        threshold: 0,
        stockLevel: 0,
        minStock: 0,
        maxStock: 0,
        expiryDate: defaultExpiryDate,
      });
    },
    onError: (error) => {
      console.error('❌ Add product failed:', error);
      alert('Failed to add product. Please check the details.');
    },
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: ['price', 'threshold', 'stockLevel', 'minStock', 'maxStock'].includes(name)
        ? Number(value)
        : value,
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.name || !formData.sku || !formData.category) {
      alert('Please fill out all required fields.');
      return;
    }

    const productToSend = {
      ...formData,
      expiryDate:
        formData.category.toLowerCase() === 'food' ? formData.expiryDate : null,
    };

    mutation.mutate(productToSend);
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-4 bg-white p-6 rounded-xl shadow"
    >
      <div>
        <label className="block mb-1 font-medium">Product Name</label>
        <Input name="name" value={formData.name} onChange={handleChange} required />
      </div>

      <div>
        <label className="block mb-1 font-medium">SKU</label>
        <Input name="sku" value={formData.sku} onChange={handleChange} required />
      </div>

      <div>
        <label className="block mb-1 font-medium">Category</label>
        <Input name="category" value={formData.category} onChange={handleChange} required />
      </div>

      <div>
        <label className="block mb-1 font-medium">Price</label>
        <Input name="price" type="number" value={formData.price} onChange={handleChange} />
      </div>

      <div>
        <label className="block mb-1 font-medium">Threshold</label>
        <Input name="threshold" type="number" value={formData.threshold} onChange={handleChange} />
      </div>

      <div>
        <label className="block mb-1 font-medium">Stock Level</label>
        <Input name="stockLevel" type="number" value={formData.stockLevel} onChange={handleChange} />
      </div>

      <div>
        <label className="block mb-1 font-medium">Min Stock</label>
        <Input name="minStock" type="number" value={formData.minStock} onChange={handleChange} />
      </div>

      <div>
        <label className="block mb-1 font-medium">Max Stock</label>
        <Input name="maxStock" type="number" value={formData.maxStock} onChange={handleChange} />
      </div>

      {formData.category.toLowerCase() === 'food' && (
        <div>
          <label className="block mb-1 font-medium">Expiry Date</label>
          <Input name="expiryDate" type="date" value={formData.expiryDate} onChange={handleChange} />
        </div>
      )}

      <div className="col-span-full flex justify-end">
        <Button
          type="submit"
          className="bg-black text-white hover:bg-gray-800"
          disabled={mutation.isPending}
        >
          {mutation.isPending ? 'Submitting...' : 'Submit'}
        </Button>
      </div>
    </form>
  );
};

export default AddProductForm;
