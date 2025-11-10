
import React, { createContext, useState, useContext, ReactNode, useCallback } from 'react';
import { Vegetable, Order, Bill, User, UserRole, OrderItem, BillItem } from '../types.ts';
import { VEGETABLES } from '../constants.ts';

// --- MOCK USER DATABASE ---
// In a real app, this would be your user database.
const MOCK_USERS: User[] = [
  { id: 'seller-001', name: 'Seller', mobile: '0000000000', role: UserRole.SELLER }
];
// --- --- --- --- --- --- ---

interface AppContextType {
  vegetables: Vegetable[];
  orders: Order[];
  bills: Bill[];
  vegetablePrices: Record<string, number>;
  currentUser: User | null;
  login: (name: string, mobile: string, role: UserRole) => boolean;
  logout: () => void;
  addOrder: (items: OrderItem[]) => void;
  addBill: (order: Order) => void;
  setVegetablePrice: (vegId: string, price: number) => void;
  addVegetable: (name: string) => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export const AppProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [vegetables, setVegetables] = useState<Vegetable[]>(VEGETABLES);
  const [orders, setOrders] = useState<Order[]>([]);
  const [bills, setBills] = useState<Bill[]>([]);
  const [users, setUsers] = useState<User[]>(MOCK_USERS);
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [vegetablePrices, setVegetablePrices] = useState<Record<string, number>>({});

  const login = useCallback((name: string, mobile: string, role: UserRole): boolean => {
    // Find existing user or create a new one for customers
    let user = users.find(u => u.mobile === mobile && u.name.toLowerCase() === name.toLowerCase());

    if (!user && role === UserRole.CUSTOMER) {
      user = { id: `USER-${Date.now()}`, name, mobile, role };
      setUsers(prev => [...prev, user]);
    }

    if (user && user.role === role) {
      setCurrentUser(user);
      return true;
    }
    
    // For sellers, they must exist in the mock DB
    if(user && user.role === UserRole.SELLER) {
        setCurrentUser(user);
        return true;
    }

    return false;
  }, [users]);

  const logout = useCallback(() => {
    setCurrentUser(null);
  }, []);

  const addOrder = useCallback((items: OrderItem[]) => {
    if (!currentUser) return;
    const newOrder: Order = {
      id: `ORD-${Date.now()}`,
      userId: currentUser.id,
      customerName: currentUser.name,
      items,
      timestamp: new Date(),
      isBilled: false,
    };
    setOrders(prevOrders => [...prevOrders, newOrder]);
  }, [currentUser]);

  const addBill = useCallback((order: Order) => {
    const billItems: BillItem[] = order.items.map(item => {
        const pricePerKg = vegetablePrices[item.vegetable.id] || 0;
        return {
            ...item,
            pricePerKg,
            totalPrice: item.quantity * pricePerKg,
        };
    });

    const totalCost = billItems.reduce((sum, item) => sum + item.totalPrice, 0);

    const newBill: Bill = {
      id: `BILL-${order.id}`,
      orderId: order.id,
      userId: order.userId,
      customerName: order.customerName,
      items: billItems,
      totalCost,
      timestamp: new Date(),
    };

    setBills(prevBills => [...prevBills, newBill]);
    setOrders(prevOrders =>
      prevOrders.map(o => (o.id === order.id ? { ...o, isBilled: true } : o))
    );
  }, [vegetablePrices]);
  
  const setVegetablePrice = (vegId: string, price: number) => {
    setVegetablePrices(prev => ({ ...prev, [vegId]: price }));
  };

  const addVegetable = useCallback((name: string) => {
    const newVegetable: Vegetable = {
      id: `veg-${Date.now()}`,
      name,
      imageUrl: 'https://images.unsplash.com/photo-1590779033100-9f60a05a013d?q=80&w=400&auto=format&fit=crop', // Generic placeholder
    };
    setVegetables(prev => [...prev, newVegetable]);
  }, []);


  const value = { vegetables, orders, bills, currentUser, login, logout, addOrder, addBill, vegetablePrices, setVegetablePrice, addVegetable };

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
};

export const useAppContext = () => {
  const context = useContext(AppContext);
  if (context === undefined) {
    throw new Error('useAppContext must be used within an AppProvider');
  }
  return context;
};