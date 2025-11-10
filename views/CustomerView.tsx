
import React, { useState, useMemo } from 'react';
import { useAppContext } from '../contexts/AppContext.tsx';
import { OrderItem } from '../types.ts';

const ShoppingCartIcon: React.FC<{ className?: string }> = ({ className }) => (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className={className}>
        <path d="M7 18c-1.1 0-1.99.9-1.99 2S5.9 22 7 22s2-.9 2-2-.9-2-2-2zM1 2v2h2l3.6 7.59-1.35 2.45c-.16.28-.25.61-.25.96 0 1.1.9 2 2 2h12v-2H7.42c-.14 0-.25-.11-.25-.25l.03-.12.9-1.63h7.45c.75 0 1.41-.41 1.75-1.03l3.58-6.49c.08-.14.12-.31.12-.48 0-.55-.45-1-1-1H5.21l-.94-2H1zm16 16c-1.1 0-1.99.9-1.99 2s.9 2 1.99 2 2-.9 2-2-.9-2-2-2z"/>
    </svg>
);


const ReceiptIcon: React.FC<{ className?: string }> = ({ className }) => (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className={className}>
        <path d="M18 17H6v-2h12v2zm0-4H6v-2h12v2zm0-4H6V7h12v2zM3 22l1.5-1.5L6 22l1.5-1.5L9 22l1.5-1.5L12 22l1.5-1.5L15 22l1.5-1.5L18 22l1.5-1.5L21 22V2l-1.5 1.5L18 2l-1.5 1.5L15 2l-1.5 1.5L12 2l-1.5 1.5L9 2 7.5 3.5 6 2 4.5 3.5 3 2v20z"/>
    </svg>
);

const HistoryIcon: React.FC<{ className?: string }> = ({ className }) => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className={className}>
    <path fillRule="evenodd" d="M12 2.25c-5.385 0-9.75 4.365-9.75 9.75s4.365 9.75 9.75 9.75 9.75-4.365 9.75-9.75S17.385 2.25 12 2.25zM12.75 6a.75.75 0 00-1.5 0v6c0 .414.336.75.75.75h4.5a.75.75 0 000-1.5h-3.75V6z" clipRule="evenodd" />
  </svg>
);


export const CustomerView: React.FC = () => {
  const { vegetables, addOrder, bills, orders, currentUser } = useAppContext();
  const [quantities, setQuantities] = useState<Record<string, number>>({});
  const [orderPlaced, setOrderPlaced] = useState(false);
  const [currentView, setCurrentView] = useState<'order' | 'history' | 'bills'>('order');
  const [expandedBillId, setExpandedBillId] = useState<string | null>(null);
  const [expandedOrderId, setExpandedOrderId] = useState<string | null>(null);

  const myOrders = useMemo(() => 
    orders.filter(o => o.userId === currentUser?.id).sort((a,b) => b.timestamp.getTime() - a.timestamp.getTime())
  , [orders, currentUser]);
  
  const myBills = useMemo(() => 
    bills.filter(b => b.userId === currentUser?.id).sort((a,b) => b.timestamp.getTime() - a.timestamp.getTime())
  , [bills, currentUser]);

  const handleQuantityChange = (vegId: string, value: string) => {
    const quantity = parseFloat(value);
    setQuantities(prev => ({
      ...prev,
      [vegId]: isNaN(quantity) || quantity < 0 ? 0 : quantity
    }));
  };

  const handlePlaceOrder = () => {
    const items: OrderItem[] = (Object.entries(quantities) as [string, number][])
      .map(([vegId, quantity]) => {
        if (quantity > 0) {
          const vegetable = vegetables.find(v => v.id === vegId);
          return vegetable ? { vegetable, quantity } : null;
        }
        return null;
      })
      .filter((item): item is OrderItem => item !== null);

    if (items.length > 0) {
      addOrder(items);
      setQuantities({});
      setOrderPlaced(true);
      setTimeout(() => setOrderPlaced(false), 5000);
      setCurrentView('history');
    } else {
      alert("Please add at least one vegetable to your order.");
    }
  };

  const handleToggleBill = (billId: string) => {
    setExpandedBillId(prevId => (prevId === billId ? null : billId));
  };
  
  const handleToggleOrder = (orderId: string) => {
    setExpandedOrderId(prevId => (prevId === orderId ? null : orderId));
  };

  const totalItemsInCart = (Object.values(quantities) as number[]).reduce((sum, qty) => sum + (qty > 0 ? 1 : 0), 0);
  
  const getNavButtonClasses = (viewName: 'order' | 'history' | 'bills') => {
    const baseClasses = "flex items-center py-4 px-6 font-medium text-lg transition-colors duration-300";
    const inactiveClasses = "text-gray-500 hover:text-gray-700";
    
    if (currentView === viewName) {
        let activeClasses = "border-b-4 text-gray-800 ";
        if(viewName === 'order') activeClasses += "border-green-500";
        if(viewName === 'history') activeClasses += "border-orange-500";
        if(viewName === 'bills') activeClasses += "border-blue-500";
        return `${baseClasses} ${activeClasses}`;
    }
    
    return `${baseClasses} ${inactiveClasses}`;
  };

  return (
    <div className="container mx-auto p-4 sm:p-6 lg:p-8">
      <div className="flex justify-center border-b border-gray-200 mb-6">
        <button onClick={() => setCurrentView('order')} className={getNavButtonClasses('order')} aria-current={currentView === 'order'}>
            <ShoppingCartIcon className="h-6 w-6 mr-2"/> New Order
        </button>
        <button onClick={() => setCurrentView('history')} className={getNavButtonClasses('history')} aria-current={currentView === 'history'}>
            <HistoryIcon className="h-6 w-6 mr-2"/> Order History
        </button>
        <button onClick={() => setCurrentView('bills')} className={getNavButtonClasses('bills')} aria-current={currentView === 'bills'}>
            <ReceiptIcon className="h-6 w-6 mr-2"/> Your Bills
        </button>
      </div>

      {orderPlaced && (
        <div className="bg-green-100 border-l-4 border-green-500 text-green-700 p-4 mb-6 rounded-md shadow-lg animate-fade-in-up" role="alert">
          <p className="font-bold">Order Placed Successfully!</p>
          <p>Your order has been sent. You can see it in your history.</p>
        </div>
      )}

      {currentView === 'order' && (
        <div className="max-w-2xl mx-auto animate-fade-in-up">
          <h2 className="text-3xl font-bold text-gray-800 mb-6 flex items-center justify-center">
            <ShoppingCartIcon className="h-8 w-8 mr-3 text-green-600"/>
            Place a New Order
          </h2>
          <div className="space-y-3 max-h-[60vh] overflow-y-auto pr-2">
            {vegetables.map(veg => (
              <div key={veg.id} className="bg-white rounded-lg shadow p-3 flex items-center gap-4 transition-shadow hover:shadow-md">
                <img src={veg.imageUrl} alt={veg.name} className="w-16 h-16 object-cover rounded-md flex-shrink-0" />
                <h3 className="text-lg font-semibold text-gray-800 flex-grow">{veg.name}</h3>
                <div className="flex items-center gap-2">
                  <input
                    type="number"
                    min="0"
                    step="0.5"
                    value={quantities[veg.id] || ''}
                    onChange={(e) => handleQuantityChange(veg.id, e.target.value)}
                    placeholder="0"
                    className="w-24 text-center rounded-md border-gray-300 shadow-sm focus:border-green-500 focus:ring-green-500 sm:text-sm p-2"
                  />
                  <span className="font-medium text-gray-600">Kg</span>
                </div>
              </div>
            ))}
          </div>
          <div className="mt-8 sticky bottom-4">
            <button
              onClick={handlePlaceOrder}
              disabled={totalItemsInCart === 0}
              className="w-full flex items-center justify-center bg-green-600 text-white font-bold py-4 px-6 rounded-lg shadow-lg hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 transition-transform duration-300 transform hover:scale-105 disabled:bg-gray-400 disabled:cursor-not-allowed disabled:transform-none"
            >
              <ShoppingCartIcon className="h-6 w-6 mr-2"/>
              Place Order ({totalItemsInCart} {totalItemsInCart === 1 ? 'item' : 'items'})
            </button>
          </div>
        </div>
      )}

      {currentView === 'history' && (
         <div className="max-w-3xl mx-auto space-y-4 animate-fade-in-up">
            <h2 className="text-3xl font-bold text-gray-800 mb-6 text-center">Your Order History</h2>
            {myOrders.length > 0 ? myOrders.map(order => (
                <div key={order.id} className="bg-white rounded-lg shadow-lg overflow-hidden">
                    <button onClick={() => handleToggleOrder(order.id)} className="w-full text-left p-6 hover:bg-gray-50 transition-colors duration-200 flex justify-between items-center">
                        <div>
                            <h3 className="text-xl font-bold text-gray-800">Order #{order.id.slice(-6)}</h3>
                            <p className="text-sm text-gray-500">Date: {new Date(order.timestamp).toLocaleString()}</p>
                        </div>
                        <div className="flex items-center gap-4">
                            <span className={`px-3 py-1 text-sm font-semibold rounded-full ${order.isBilled ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'}`}>
                                {order.isBilled ? 'Billed' : 'Processing'}
                            </span>
                             <svg className={`w-6 h-6 text-gray-500 transform transition-transform duration-300 ${expandedOrderId === order.id ? 'rotate-180' : ''}`} xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                            </svg>
                        </div>
                    </button>

                    {expandedOrderId === order.id && (
                        <div className="p-6 border-t border-gray-200 bg-gray-50/70">
                            <h4 className="font-semibold text-gray-600 mb-2">Items Ordered:</h4>
                            <div className="space-y-2">
                              {order.items.map(item => (
                                  <div key={item.vegetable.id} className="flex justify-between items-center text-gray-700">
                                      <span>{item.vegetable.name}</span>
                                      <span className="font-medium">{item.quantity} kg</span>
                                  </div>
                              ))}
                            </div>
                            {order.isBilled && (
                                <div className="text-right mt-4">
                                    <button onClick={() => setCurrentView('bills')} className="text-sm font-semibold text-blue-600 hover:text-blue-800">
                                        View Bill &rarr;
                                    </button>
                                </div>
                            )}
                        </div>
                    )}
                </div>
            )) : (
                <div className="bg-gray-100 p-6 rounded-lg text-center text-gray-500">
                    <p>Your past orders will appear here.</p>
                </div>
            )}
        </div>
      )}
      
      {currentView === 'bills' && (
         <div className="max-w-3xl mx-auto space-y-4 animate-fade-in-up">
            <h2 className="text-3xl font-bold text-gray-800 mb-6 text-center">Your Bills</h2>
            {myBills.length > 0 ? myBills.map(bill => (
                <div key={bill.id} className="bg-white rounded-lg shadow-lg overflow-hidden">
                    <button onClick={() => handleToggleBill(bill.id)} className="w-full text-left p-6 hover:bg-gray-50 transition-colors duration-200 flex justify-between items-center">
                        <div>
                            <h3 className="text-xl font-bold text-gray-800">Bill for Order #{bill.orderId.slice(-6)}</h3>
                            <p className="text-sm text-gray-500">Date: {new Date(bill.timestamp).toLocaleString()}</p>
                        </div>
                        <div className="text-right">
                            <p className="text-xl font-bold text-gray-900">₹{bill.totalCost.toFixed(2)}</p>
                            <span className="text-sm text-gray-500">Click to view details</span>
                        </div>
                    </button>
                    {expandedBillId === bill.id && (
                        <div className="p-6 border-t-2 border-dashed bg-gray-50/70">
                            <h4 className="font-semibold text-gray-700 mb-4">Bill Details:</h4>
                            <div className="space-y-2">
                                {bill.items.map(item => (
                                    <div key={item.vegetable.id} className="flex justify-between items-center text-gray-700 text-sm">
                                        <span>{item.vegetable.name} ({item.quantity} kg x ₹{item.pricePerKg}/kg)</span>
                                        <span className="font-medium">₹{item.totalPrice.toFixed(2)}</span>
                                    </div>
                                ))}
                            </div>
                            <div className="mt-4 pt-4 border-t-2 border-gray-800">
                                <div className="flex justify-between items-center text-xl font-bold text-gray-900">
                                    <span>Total Cost</span>
                                    <span>₹{bill.totalCost.toFixed(2)}</span>
                                </div>
                            </div>
                        </div>
                    )}
                </div>
            )) : (
                <div className="bg-gray-100 p-6 rounded-lg text-center text-gray-500">
                    <p>Your generated bills will appear here once an order is processed.</p>
                </div>
            )}
        </div>
      )}
    </div>
  );
};