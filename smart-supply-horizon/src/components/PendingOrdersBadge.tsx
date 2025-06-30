import { usePendingOrderCount } from '@/hooks/usePurchaseOrders';
import { Badge } from '@/components/ui/badge';
import { useNavigate } from 'react-router-dom';

const PendingOrdersBadge = () => {
  const { data: count, isLoading, isError } = usePendingOrderCount();
  const navigate = useNavigate();

  const handleClick = () => {
    if (!isLoading && !isError) {
      navigate('/purchase-orders?filter=pending');
    }
  };

  if (isError) {
    return (
      <Badge variant="destructive" className="cursor-not-allowed">
        ❌ Error fetching count
      </Badge>
    );
  }

  return (
    <Badge
      onClick={handleClick}
      className={`transition-all duration-300 ${
        isLoading ? "bg-gray-400" : "bg-yellow-500 hover:bg-yellow-600"
      } text-white cursor-pointer`}
    >
      {isLoading ? "⏳ Loading..." : `📦 Pending Orders: ${count}`}
    </Badge>
  );
};

export default PendingOrdersBadge;
