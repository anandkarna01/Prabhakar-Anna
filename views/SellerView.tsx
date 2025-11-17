import React, { useState, useMemo, useEffect } from 'react';
import { useAppContext } from '../contexts/AppContext.tsx';
import { Order, BillItem, Bill, Vegetable } from '../types.ts';
import { api } from '../api.ts';

// --- ICONS ---
const DocumentTextIcon: React.FC<{ className?: string }> = ({ className }) => (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className={className}>
        <path fillRule="evenodd" d="M5.25 3A2.25 2.25 0 003 5.25v13.5A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75V5.25A2.25 2.25 0 0018.75 3H5.25zM6 6.75A.75.75 0 016.75 6h10.5a.75.75 0 010 1.5H6.75A.75.75 0 016 6.75zm.75 3a.75.75 0 000 1.5h10.5a.75.75 0 000-1.5H6.75zm0 3.75A.75.75 0 016.75 12h6a.75.75 0 010 1.5h-6A.75.75 0 016 12.75z" clipRule="evenodd" />
    </svg>
);
const CheckCircleIcon: React.FC<{ className?: string }> = ({ className }) => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className={className}>
    <path fillRule="evenodd" d="M2.25 12c0-5.385 4.365-9.75 9.75-9.75s9.75 4.365 9.75 9.75-4.365 9.75-9.75 9.75S2.25 17.385 2.25 12zm13.36-1.814a.75.75 0 10-1.22-.872l-3.236 4.53L9.53 12.22a.75.75 0 00-1.06 1.06l2.25 2.25a.75.75 0 001.14-.094l3.75-5.25z" clipRule="evenodd" />
  </svg>
);
const PriceTagIcon: React.FC<{ className?: string }> = ({ className }) => (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className={className}>
        <path d="M12.75 0a.75.75 0 00-.75.75v.563c-1.35.23-2.6.7-3.75 1.343a.75.75 0 00-.457 1.052l.243.486c.21.42.668.596 1.088.387a11.163 11.163 0 0110.156 0c.42.21.878.033 1.088-.387l.243-.486a.75.75 0 00-.457-1.052A12.653 12.653 0 0012 1.312V.75a.75.75 0 00-.75-.75z" />
        <path fillRule="evenodd" d="M3 8.25a.75.75 0 01.75-.75h16.5a.75.75 0 010 1.5H3.75A.75.75 0 013 8.25zM3 12a.75.75 0 01.75-.75h16.5a.75.75 0 010 1.5H3.75A.75.75 0 013 12zm0 3.75a.75.75 0 01.75-.75h16.5a.75.75 0 010 1.5H3.75A.75.75 0 01-.75-.75zM12 24a8.25 8.25 0 01-8.25-8.25V17.25a.75.75 0 011.5 0v-1.5a6.75 6.75 0 0013.5 0v1.5a.75.75 0 011.5 0V15.75A8.25 8.25 0 0112 24z" clipRule="evenodd" />
    </svg>
);
const HistoryIcon: React.FC<{ className?: string }> = ({ className }) => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className={className}>
    <path fillRule="evenodd" d="M12 2.25c-5.385 0-9.75 4.365-9.75 9.75s4.365 9.75 9.75 9.75 9.75-4.365 9.75-9.75S17.385 2.25 12 2.25zM12.75 6a.75.75 0 00-1.5 0v6c0 .414.336.75.75.75h4.5a.75.75 0 000-1.5h-3.75V6z" clipRule="evenodd" />
  </svg>
);
const PlusCircleIcon: React.FC<{ className?: string }> = ({ className }) => (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className={className}>
        <path fillRule="evenodd" d="M12 2.25c-5.385 0-9.75 4.365-9.75 9.75s4.365 9.75 9.75 9.75 9.75-4.365 9.75-9.75S17.385 2.25 12 2.25zM12.75 9a.75.75 0 00-1.5 0v2.25H9a.75.75 0 000 1.5h2.25V15a.75.75 0 001.5 0v-2.25H15a.75.75 0 000-1.5h-2.25V9z" clipRule="evenodd" />
    </svg>
);


// --- COMPONENTS ---
const AddVegetableForm: React.FC = () => {
    const { addLocalVegetable } = useAppContext();
    const [name, setName] = useState('');
    const [isAdding, setIsAdding] = useState(false);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (name.trim()) {
            setIsAdding(true);
            const newVeg = await api.addVegetable(name);
            addLocalVegetable(newVeg);
            setName('');
            setIsAdding(false);
        } else {
            alert('Please provide a vegetable name.');
        }
    };

    return (
        <div className="bg-white p-6 rounded-lg shadow-lg mb-6">
            <h3 className="text-2xl font-bold text-gray-800 mb-4 flex items-center">
                <PlusCircleIcon className="h-7 w-7 mr-3 text-green-500"/>
                Add New Vegetable
            </h3>
            <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row gap-4 items-end">
                <div className="flex-grow w-full">
                    <label htmlFor="veg-name" className="block text-sm font-medium text-gray-700">Vegetable Name</label>
                    <input
                        type="text"
                        id="veg-name"
                        value={name}
                        onChange={e => setName(e.target.value)}
                        placeholder="e.g., Cauliflower"
                        className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-green-500 focus:border-green-500 sm:text-sm"
                        required
                        disabled={isAdding}
                    />
                </div>
                <button
                    type="submit"
                    disabled={isAdding}
                    className="w-full sm:w-auto bg-green-600 text-white font-bold py-2 px-6 rounded-lg shadow-md hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 transition duration-300 disabled:bg-gray-400"
                >
                    {isAdding ? 'Adding...' : 'Add'}
                </button>
            </form>
        </div>
    );
};


const PriceManager: React.FC<{
    vegetables: Vegetable[];
    prices: Record<string, number>;
    onPriceChange: (vegId: string, price: number) => void;
}> = ({ vegetables, prices, onPriceChange }) => {

    const handlePriceChange = (vegId: string, value: string) => {
        const price = parseFloat(value);
        onPriceChange(vegId, isNaN(price) || price < 0 ? 0 : price);
    };
    
    return (
        <div className="bg-white p-6 rounded-lg shadow-lg">
            <h3 className="text-2xl font-bold text-gray-800 mb-4 flex items-center">
                <PriceTagIcon className="h-7 w-7 mr-3 text-orange-500"/>
                Master Price List
            </h3>
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
                {vegetables.map(veg => (
                    <div key={veg.id}>
                        <label htmlFor={`price-${veg.id}`} className="block text-sm font-medium text-gray-700">{veg.name}</label>
                        <div className="mt-1 flex rounded-md shadow-sm">
                            <span className="inline-flex items-center px-3 rounded-l-md border border-r-0 border-gray-300 bg-gray-50 text-gray-500 sm:text-sm">₹</span>
                            <input
                                type="number"
                                id={`price-${veg.id}`}
                                value={prices[veg.id] || ''}
                                onChange={e => handlePriceChange(veg.id, e.target.value)}
                                placeholder="0.00"
                                className="flex-1 min-w-0 block w-full px-3 py-2 rounded-none rounded-r-md focus:ring-orange-500 focus:border-orange-500 sm:text-sm border-gray-300"
                            />
                        </div>
                    </div>
                ))}
            </div>
        </div>
    )
}

const BillPreview: React.FC<{ order: Order; prices: Record<string, number>; onBillSend: (order: Order) => void }> = ({ order, prices, onBillSend }) => {
  const { billItems, totalCost, isFullyPriced } = useMemo(() => {
    let isPriced = true;
    const billItems: BillItem[] = order.items.map(item => {
      const pricePerKg = prices[item.vegetable.id] || 0;
      if(pricePerKg <= 0) isPriced = false;
      return { ...item, pricePerKg, totalPrice: item.quantity * pricePerKg };
    });
    const totalCost = billItems.reduce((sum, item) => sum + item.totalPrice, 0);
    return { billItems, totalCost, isFullyPriced: isPriced };
  }, [order.items, prices]);

  return (
    <div className="p-6 pt-4 border-t border-gray-200 bg-gray-50/50">
        <h4 className="font-semibold text-lg text-gray-700 mb-3">Auto-Calculated Bill Preview</h4>
        <div className="space-y-2">
            {billItems.map(item => (
                <div key={item.vegetable.id} className="flex justify-between items-center text-sm">
                    <span className="text-gray-600">{item.vegetable.name} ({item.quantity} kg x ₹{item.pricePerKg}/kg)</span>
                    <span className="font-medium text-gray-800">₹{item.totalPrice.toFixed(2)}</span>
                </div>
            ))}
        </div>
      <div className="mt-4 pt-4 border-t-2 border-dashed">
        <div className="flex justify-between items-center text-xl font-bold text-gray-900 mb-4">
            <span>Total:</span>
            <span>₹{totalCost.toFixed(2)}</span>
        </div>
        <button
          onClick={() => onBillSend(order)}
          disabled={!isFullyPriced}
          className="w-full bg-orange-500 text-white font-bold py-3 px-4 rounded-lg shadow-md hover:bg-orange-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-orange-500 transition duration-300 disabled:bg-gray-400 disabled:cursor-not-allowed"
        >
          {isFullyPriced ? 'Confirm & Send Bill' : 'Set All Prices in Master List to Bill'}
        </button>
      </div>
    </div>
  );
};

export const SellerView: React.FC = () => {
  const { vegetables } = useAppContext();
  const [allOrders, setAllOrders] = useState<Order[]>([]);
  const [allBills, setAllBills] = useState<Bill[]>([]);
  const [vegetablePrices, setVegetablePrices] = useState<Record<string, number>>({});
  
  const [expandedOrderId, setExpandedOrderId] = useState<string | null>(null);
  const [expandedBilledOrderId, setExpandedBilledOrderId] = useState<string | null>(null);
  const [expandedCustomerName, setExpandedCustomerName] = useState<string | null>(null);
  const [currentView, setCurrentView] = useState<'prices' | 'orders' | 'history'>('prices');
  
  // Fetch initial prices
  useEffect(() => {
      api.getVegetablePrices().then(setVegetablePrices);
  }, []);

  // Fetch initial data and set up real-time subscription for orders
  useEffect(() => {
    // This function fetches the latest orders and bills.
    const refreshData = () => {
      api.getAllOrders().then(orders => {
        setAllOrders(orders);
        // Also refresh bills when orders change, as a new bill might have been created.
        api.getAllBills().then(setAllBills);
      });
    };

    // Fetch initial data when the component mounts.
    refreshData();

    // Set up a real-time subscription to the orders table.
    // The `refreshData` function will be called whenever an order is created, updated, or deleted.
    const subscription = api.subscribeToOrders(refreshData);

    // The cleanup function will run when the component unmounts.
    // This is important to prevent memory leaks.
    return () => {
      if (subscription) {
        subscription.unsubscribe();
      }
    };
  }, []); // The empty dependency array means this effect runs only once, on mount.

  const handlePriceChange = async (vegId: string, price: number) => {
    setVegetablePrices(prev => ({ ...prev, [vegId]: price }));
    await api.setVegetablePrice(vegId, price);
  };

  const handleBillSend = async (order: Order) => {
    await api.createBill(order);
    setExpandedOrderId(null);
    // No need to manually refetch; the real-time subscription handles it automatically.
  };

  const { activeOrdersByCustomer, billedOrdersByCustomer } = useMemo(() => {
    const active = allOrders.filter(o => !o.isBilled).sort((a,b) => a.timestamp.getTime() - b.timestamp.getTime());
    const billed = allOrders.filter(o => o.isBilled).sort((a,b) => b.timestamp.getTime() - a.timestamp.getTime());
    
    const groupOrdersByCustomer = (orderList: Order[]): Record<string, Order[]> => {
      return orderList.reduce((acc, order) => {
        (acc[order.customerName] = acc[order.customerName] || []).push(order);
        return acc;
      }, {} as Record<string, Order[]>);
    }

    return { 
        activeOrdersByCustomer: groupOrdersByCustomer(active), 
        billedOrdersByCustomer: groupOrdersByCustomer(billed) 
    };
  }, [allOrders]);

  const handleToggleExpand = (orderId: string) => {
    setExpandedOrderId(prevId => (prevId === orderId ? null : orderId));
  };
  
  const handleToggleBilledExpand = (orderId: string) => {
    setExpandedBilledOrderId(prevId => (prevId === orderId ? null : orderId));
  };

  const getNavButtonClasses = (viewName: 'prices' | 'orders' | 'history') => {
    const baseClasses = "flex items-center py-4 px-6 font-medium text-lg transition-colors duration-300";
    const inactiveClasses = "text-gray-500 hover:text-gray-700";
    
    if (currentView === viewName) {
        let activeClasses = "border-b-4 text-gray-800 ";
        if (viewName === 'prices') activeClasses += "border-orange-500";
        if (viewName === 'orders') activeClasses += "border-green-500";
        if (viewName === 'history') activeClasses += "border-blue-500";
        return `${baseClasses} ${activeClasses}`;
    }
    
    return `${baseClasses} ${inactiveClasses}`;
  };
  
  return (
    <div className="container mx-auto p-4 sm:p-6 lg:p-8">
        <div className="flex justify-center border-b border-gray-200 mb-6">
            <button onClick={() => setCurrentView('prices')} className={getNavButtonClasses('prices')} aria-current={currentView === 'prices'}>
                <PriceTagIcon className="h-6 w-6 mr-2"/> Price List
            </button>
            <button onClick={() => setCurrentView('orders')} className={getNavButtonClasses('orders')} aria-current={currentView === 'orders'}>
                <DocumentTextIcon className="h-6 w-6 mr-2"/> Active Orders
            </button>
            <button onClick={() => setCurrentView('history')} className={getNavButtonClasses('history')} aria-current={currentView === 'history'}>
                <HistoryIcon className="h-6 w-6 mr-2"/> Billed History
            </button>
        </div>

      {currentView === 'prices' && (
        <div className="animate-fade-in-up">
            <AddVegetableForm />
            <PriceManager vegetables={vegetables} prices={vegetablePrices} onPriceChange={handlePriceChange}/>
        </div>
      )}

      {currentView === 'orders' && (
        <div className="animate-fade-in-up">
            <div className="max-w-3xl mx-auto">
                <h3 className="text-2xl font-semibold text-gray-700 mb-4 border-b-2 pb-2">Orders to be Processed</h3>
                {Object.keys(activeOrdersByCustomer).length > 0 ? (
                    <div className="space-y-4">
                        {/* Fix: Explicitly type the destructured array from Object.entries */}
                        {Object.entries(activeOrdersByCustomer).map(([customerName, customerOrders]: [string, Order[]]) => (
                             <div key={customerName} className="bg-white rounded-lg shadow-md p-5">
                                <h4 className="text-lg font-bold text-gray-800 mb-3">{customerName}</h4>
                                <div className="space-y-2">
                                    {customerOrders.map(order => (
                                        <div key={order.id} className="rounded-lg border border-gray-200 overflow-hidden">
                                            <button className="w-full flex justify-between items-center p-4 text-left hover:bg-gray-50" onClick={() => handleToggleExpand(order.id)}>
                                                <p className="font-semibold text-gray-700">Order from {new Date(order.timestamp).toLocaleString()}</p>
                                                <svg className={`w-6 h-6 text-orange-500 transform transition-transform duration-300 ${expandedOrderId === order.id ? 'rotate-180' : ''}`} xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                                                </svg>
                                            </button>
                                            {expandedOrderId === order.id && (
                                                <BillPreview order={order} prices={vegetablePrices} onBillSend={handleBillSend} />
                                            )}
                                        </div>
                                    ))}
                                </div>
                            </div>
                        ))}
                    </div>
                ) : <div className="bg-white mt-8 p-8 rounded-lg shadow-md text-center text-gray-500"><p>No active orders. Waiting for customers...</p></div>}
            </div>
        </div>
      )}

      {currentView === 'history' && (
        <div className="animate-fade-in-up max-w-3xl mx-auto">
            <h3 className="text-2xl text-center font-semibold text-gray-700 mb-4 pb-2">Completed Transactions</h3>
            {Object.keys(billedOrdersByCustomer).length > 0 ? (
                <div className="space-y-4">
                    {/* Fix: Explicitly type the destructured array from Object.entries */}
                    {Object.entries(billedOrdersByCustomer).map(([customerName, customerOrders]: [string, Order[]]) => (
                        <div key={customerName} className="bg-white rounded-lg shadow-lg overflow-hidden">
                            <button 
                                onClick={() => setExpandedCustomerName(prev => prev === customerName ? null : customerName)}
                                className="w-full text-left p-6 hover:bg-gray-50 transition-colors duration-200 flex justify-between items-center"
                            >
                                <h4 className="text-xl font-bold text-gray-800">{customerName}</h4>
                                <div className="flex items-center gap-4">
                                    <span className="px-3 py-1 text-sm font-semibold rounded-full bg-blue-100 text-blue-800">
                                        {customerOrders.length} {customerOrders.length === 1 ? 'Bill' : 'Bills'}
                                    </span>
                                    <svg className={`w-6 h-6 text-gray-500 transform transition-transform duration-300 ${expandedCustomerName === customerName ? 'rotate-180' : ''}`} xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                                    </svg>
                                </div>
                            </button>
                            
                            {expandedCustomerName === customerName && (
                                <div className="p-5 border-t border-gray-200">
                                    <div className="space-y-2">
                                        {customerOrders.map(order => {
                                            const bill = allBills.find(b => b.orderId === order.id);
                                            return (
                                                <div key={order.id} className="rounded-lg border border-gray-200">
                                                    <button onClick={() => handleToggleBilledExpand(order.id)} className="w-full text-left p-4 hover:bg-gray-50 transition-colors duration-200 flex justify-between items-center">
                                                        <div>
                                                            <p className="font-semibold text-gray-700">Order #{order.id.slice(-6)} - {new Date(order.timestamp).toLocaleDateString()}</p>
                                                            <p className="text-sm text-gray-500">Total: ₹{bill?.totalCost.toFixed(2)}</p>
                                                        </div>
                                                        <div className="flex items-center gap-4">
                                                            <div className="flex items-center text-green-700 font-medium">
                                                                <CheckCircleIcon className="h-5 w-5 mr-1" />
                                                                Billed
                                                            </div>
                                                            <svg className={`w-6 h-6 text-gray-500 transform transition-transform duration-300 ${expandedBilledOrderId === order.id ? 'rotate-180' : ''}`} xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                                                            </svg>
                                                        </div>
                                                    </button>
                                                    {expandedBilledOrderId === order.id && bill && (
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
                                            );
                                        })}
                                    </div>
                                </div>
                            )}
                        </div>
                    ))}
                </div>
            ): <div className="bg-white mt-8 p-8 rounded-lg shadow-md text-center text-gray-500"><p>No billed orders yet.</p></div>}
        </div>
      )}
    </div>
  );
};