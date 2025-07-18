import React, { useState, useEffect } from 'react';
import useApi from '../../hooks/useApi';
import * as inventoryApi from '../../api/inventory';
import * as productsApi from '../../api/products';
import { InventoryEventType, Product } from '../../types';
import Spinner from '../common/Spinner';

interface SimulateTransactionsProps {
  onEventSent: () => void;  
}

const SimulateTransactions: React.FC<SimulateTransactionsProps> = ({ onEventSent }) => {
  const [productId, setProductId] = useState<string>('');
  const [eventType, setEventType] = useState<InventoryEventType>('purchase');
  const [quantity, setQuantity] = useState<number>(1);
  const [unitPrice, setUnitPrice] = useState<number>(0);
  const [message, setMessage] = useState<string>('');
  const [products, setProducts] = useState<Product[]>([]);

  const sendEventApi = useApi(inventoryApi.sendInventoryEvent);
  const getProductsApi = useApi(productsApi.getProducts);

  useEffect(() => {
    // Fetch products to populate dropdown
    const fetchProducts = async () => {
      const prods = await getProductsApi.callApi();
      if (prods && prods.length > 0) {
        setProductId(prods[0].product_id);  
        setProducts(prods);
      }
    };
    fetchProducts();
  }, [getProductsApi]);  

  useEffect(() => {
    if (sendEventApi.error) {
      setMessage(`Error: ${sendEventApi.error.response?.data?.message || sendEventApi.error.message}`);
    } else if (sendEventApi.data) {
      setMessage('Event sent successfully!');
      setQuantity(1);  
      setUnitPrice(0);  
      onEventSent();  
    }
  }, [sendEventApi.data, sendEventApi.error, onEventSent]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setMessage('');

    const event = {
      product_id: productId,
      event_type: eventType,
      quantity: quantity,
      ...(eventType === 'purchase' && { unit_price: unitPrice }),
      timestamp: new Date().toISOString(),
    };

    await sendEventApi.callApi(event);
  };

  const simulateRandomEvents = async () => {
    setMessage('Simulating random events...');
    const eventTypes: InventoryEventType[] = ['purchase', 'sale'];
    const productsAvailable = products.length > 0 ? products : [{ product_id: 'PRD001', product_name: 'Dummy Product', created_at: '' }]; // Fallback
    for (let i = 0; i < 5; i++) { // Simulate 5 events
      const randomProduct = productsAvailable[Math.floor(Math.random() * productsAvailable.length)];
      const randomType = eventTypes[Math.floor(Math.random() * eventTypes.length)];
      const randomQuantity = Math.floor(Math.random() * 50) + 1; // 1 to 50
      const randomPrice = parseFloat((Math.random() * 100 + 10).toFixed(2)); // 10 to 110

      const event = {
        product_id: randomProduct.product_id,
        event_type: randomType,
        quantity: randomQuantity,
        ...(randomType === 'purchase' && { unit_price: randomPrice }),
        timestamp: new Date().toISOString(),
      };
      await inventoryApi.sendInventoryEvent(event); // Call directly without useApi hook to chain
      await new Promise(resolve => setTimeout(resolve, 500)); 
    }
    setMessage('Random events simulated!');
    onEventSent();
  };

  return (
    <div className="bg-white shadow overflow-hidden sm:rounded-lg p-6">
      <h3 className="text-xl font-semibold text-gray-900 mb-4">Simulate Inventory Events</h3>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label htmlFor="product_id" className="block text-sm font-medium text-gray-700">Product</label>
          <select
            id="product_id"
            className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
            value={productId}
            onChange={(e) => setProductId(e.target.value)}
            required
            disabled={getProductsApi.loading}
          >
            {getProductsApi.loading ? (
              <option>Loading products...</option>
            ) : products.length > 0 ? (
              products.map((p) => (
                <option key={p.product_id} value={p.product_id}>{p.product_name} ({p.product_id})</option>
              ))
            ) : (
              <option>No products available. Create one first!</option>
            )}
          </select>
        </div>

        <div>
          <label htmlFor="event_type" className="block text-sm font-medium text-gray-700">Event Type</label>
          <select
            id="event_type"
            className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
            value={eventType}
            onChange={(e) => setEventType(e.target.value as InventoryEventType)}
          >
            <option value="purchase">Purchase</option>
            <option value="sale">Sale</option>
          </select>
        </div>

        <div>
          <label htmlFor="quantity" className="block text-sm font-medium text-gray-700">Quantity</label>
          <input
            type="number"
            id="quantity"
            className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
            value={quantity}
            onChange={(e) => setQuantity(parseInt(e.target.value))}
            min="1"
            required
          />
        </div>

        {eventType === 'purchase' && (
          <div>
            <label htmlFor="unit_price" className="block text-sm font-medium text-gray-700">Unit Price</label>
            <input
              type="number"
              id="unit_price"
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
              value={unitPrice}
              onChange={(e) => setUnitPrice(parseFloat(e.target.value))}
              min="0"
              step="0.01"
              required
            />
          </div>
        )}

        {sendEventApi.loading && <Spinner />}
        {message && <p className={`text-sm ${sendEventApi.error ? 'text-red-500' : 'text-green-600'}`}>{message}</p>}

        <button
          type="submit"
          className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
          disabled={sendEventApi.loading}
        >
          Send {eventType === 'purchase' ? 'Purchase' : 'Sale'} Event
        </button>

        <button
          type="button"
          onClick={simulateRandomEvents}
          className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-gray-600 hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500 mt-2"
          disabled={sendEventApi.loading || getProductsApi.loading}
        >
          Simulate 5 Random Events
        </button>
      </form>
    </div>
  );
};

export default SimulateTransactions;