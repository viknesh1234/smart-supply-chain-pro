import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import axios from 'axios';
import { useState } from 'react';
import { toast } from 'sonner';

interface Product {
  id: number;
  name: string;
  price: number;
}

interface CreatePOProps {
  onSuccess?: () => void;
}

const CreatePO: React.FC<CreatePOProps> = ({ onSuccess }) => {
  const queryClient = useQueryClient();

  const [selectedProductId, setSelectedProductId] = useState<number | ''>('');
  const [quantity, setQuantity] = useState<number>(1);
  const [supplierName, setSupplierName] = useState('');
  const [supplierEmail, setSupplierEmail] = useState('');
  const [expectedDate, setExpectedDate] = useState('');
  const [sendEmail, setSendEmail] = useState(false);

  const { data: products = [], isLoading } = useQuery<Product[]>({
    queryKey: ['products'],
    queryFn: async () => {
      const res = await axios.get('http://localhost:8080/api/products');
      return res.data;
    },
  });

  const mutation = useMutation({
    mutationFn: async (poData: any) => {
      return await axios.post('http://localhost:8080/api/purchase-orders', poData);
    },
    onSuccess: () => {
      toast.success('✅ Purchase Order created and email sent!');
      queryClient.invalidateQueries({ queryKey: ['purchaseOrders'] });

      setSelectedProductId('');
      setQuantity(1);
      setSupplierName('');
      setSupplierEmail('');
      setExpectedDate('');
      setSendEmail(false);

      onSuccess?.();
    },
    onError: () => {
      toast.error('❌ Failed to create Purchase Order');
    },
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    const selectedProduct = products.find((p) => p.id === selectedProductId);
    if (!selectedProduct) {
      toast.error('❌ Please select a valid product.');
      return;
    }

    const totalAmount = quantity * selectedProduct.price;

    const payload = {
      poNumber: `PO-${Date.now()}`,
      supplierName,
      supplierEmail,
      createdDate: new Date().toISOString().split('T')[0],
      expectedDate,
      status: 'created',
      totalAmount,
      sendEmail,
      items: [
        {
          productId: selectedProduct.id,
          quantity,
          unitPrice: selectedProduct.price,
        },
      ],
    };

    mutation.mutate(payload);
  };

  if (isLoading) return <p className="text-gray-500">Loading products...</p>;

  return (
    <form
      onSubmit={handleSubmit}
      className="space-y-4 bg-white p-6 rounded-xl shadow w-full max-w-2xl mx-auto"
    >
      <h2 className="text-xl font-bold">Create Purchase Order</h2>

      {/* Supplier Name */}
      <div>
        <label htmlFor="supplierName" className="block text-sm font-medium text-gray-700">
          Supplier Name
        </label>
        <input
          id="supplierName"
          type="text"
          value={supplierName}
          onChange={(e) => setSupplierName(e.target.value)}
          className="w-full border p-2 rounded"
          required
        />
      </div>

      {/* Supplier Email */}
      <div>
        <label htmlFor="supplierEmail" className="block text-sm font-medium text-gray-700">
          Supplier Email
        </label>
        <input
          id="supplierEmail"
          type="email"
          value={supplierEmail}
          onChange={(e) => setSupplierEmail(e.target.value)}
          className="w-full border p-2 rounded"
          placeholder="supplier@example.com"
          required
        />
      </div>

      {/* Expected Delivery Date */}
      <div>
        <label htmlFor="expectedDate" className="block text-sm font-medium text-gray-700">
          Expected Delivery Date
        </label>
        <input
          id="expectedDate"
          type="date"
          value={expectedDate}
          onChange={(e) => setExpectedDate(e.target.value)}
          className="w-full border p-2 rounded"
          required
        />
      </div>

      {/* Select Product */}
      <div>
        <label htmlFor="productSelect" className="block text-sm font-medium text-gray-700">
          Select Product
        </label>
        <select
          id="productSelect"
          value={selectedProductId}
          onChange={(e) => setSelectedProductId(parseInt(e.target.value))}
          className="w-full border p-2 rounded"
          required
        >
          <option value="">-- Choose Product --</option>
          {products.map((product) => (
            <option key={product.id} value={product.id}>
              {product.name} - ₹{product.price}
            </option>
          ))}
        </select>
      </div>

      {/* Quantity */}
      <div>
        <label htmlFor="quantity" className="block text-sm font-medium text-gray-700">
          Quantity
        </label>
        <input
          id="quantity"
          type="number"
          min="1"
          value={quantity}
          onChange={(e) => setQuantity(parseInt(e.target.value))}
          className="w-full border p-2 rounded"
          required
        />
      </div>

      {/* Send Email Toggle */}
      <div className="flex items-center space-x-2">
        <input
          id="sendEmail"
          type="checkbox"
          checked={sendEmail}
          onChange={(e) => setSendEmail(e.target.checked)}
        />
        <label htmlFor="sendEmail" className="text-sm">
          Send email to supplier
        </label>
      </div>

      <button
        type="submit"
        disabled={mutation.isPending}
        className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 w-full"
      >
        {mutation.isPending ? 'Submitting...' : 'Submit'}
      </button>
    </form>
  );
};

export default CreatePO;
