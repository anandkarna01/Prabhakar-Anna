import { Vegetable, Order, Bill, User, UserRole, OrderItem, BillItem } from './types.ts';
import { VEGETABLES } from './constants.ts';
import { supabase } from './supabaseClient.ts';

// This file now acts as the true data layer for the application,
// communicating with the central Supabase database. All functions
// are now asynchronous and use the supabase client to interact with the database tables.

const MOCK_USERS: User[] = [
  { id: 'seller-001', name: 'Seller', mobile: '0000000000', role: UserRole.SELLER }
];

// Artificial delay to make the UI feel like it's doing network requests
const FAKE_DELAY = 100;
const withDelay = <T>(data: T): Promise<T> =>
  new Promise(resolve => setTimeout(() => resolve(data), FAKE_DELAY));

export const api = {
  // User login remains a simple mock for this version.
  // In a real app, you would use Supabase Authentication.
  async login(name: string, mobile: string, role: UserRole): Promise<User | null> {
    let user = MOCK_USERS.find(u => u.mobile === mobile && u.name.toLowerCase() === name.toLowerCase());
    
    if (!user && role === UserRole.CUSTOMER) {
      // For customers, we just create a temporary user object for the session
      user = { id: `CUST-${mobile}`, name, mobile, role };
    }
    
    return user && user.role === role ? withDelay(user) : withDelay(null);
  },

  async getVegetables(): Promise<Vegetable[]> {
    const { data, error } = await supabase.from('vegetables').select('*');
    if (error) {
        console.error("Error fetching vegetables:", error);
        return VEGETABLES; // fallback
    }
    // If the table is empty on first run, populate it with default data.
    if (!data || data.length === 0) {
        await supabase.from('vegetables').insert(VEGETABLES);
        return VEGETABLES;
    }
    return data;
  },
  
  async addVegetable(name: string): Promise<Vegetable> {
    const newVegetable: Vegetable = {
      id: `veg-${Date.now()}`,
      name,
      imageUrl: 'https://images.unsplash.com/photo-1590779033100-9f60a05a013d?q=80&w=400&auto-format&fit=crop',
    };
    const { error } = await supabase.from('vegetables').insert(newVegetable);
    if (error) console.error("Error adding vegetable:", error);
    return newVegetable;
  },

  async getVegetablePrices(): Promise<Record<string, number>> {
    const { data, error } = await supabase.from('vegetable_prices').select('*');
    if (error) {
        console.error("Error fetching prices:", error);
        return {};
    }
    return (data || []).reduce((acc, item) => {
        acc[item.vegetable_id] = item.price;
        return acc;
    }, {} as Record<string, number>);
  },

  async setVegetablePrice(vegId: string, price: number): Promise<void> {
    // 'upsert' will insert a new row if it doesn't exist, or update it if it does.
    const { error } = await supabase.from('vegetable_prices').upsert({ vegetable_id: vegId, price });
    if (error) console.error("Error setting price:", error);
  },

  async getOrdersForUser(userId: string): Promise<Order[]> {
    const { data, error } = await supabase.from('orders').select('*').eq('user_id', userId);
    if (error) {
        console.error("Error fetching user orders:", error);
        return [];
    }
    return (data || []).map(o => ({...o, userId: o.user_id, customerName: o.customer_name, isBilled: o.is_billed, timestamp: new Date(o.timestamp)})) as Order[];
  },

  async getAllOrders(): Promise<Order[]> {
    const { data, error } = await supabase.from('orders').select('*');
    if (error) {
        console.error("Error fetching all orders:", error);
        return [];
    }
    return (data || []).map(o => ({...o, userId: o.user_id, customerName: o.customer_name, isBilled: o.is_billed, timestamp: new Date(o.timestamp)})) as Order[];
  },
  
  async getBillsForUser(userId: string): Promise<Bill[]> {
    const { data, error } = await supabase.from('bills').select('*').eq('user_id', userId);
    if (error) {
        console.error("Error fetching user bills:", error);
        return [];
    }
    return (data || []).map(b => ({...b, orderId: b.order_id, userId: b.user_id, customerName: b.customer_name, totalCost: b.total_cost, timestamp: new Date(b.timestamp)})) as Bill[];
  },

  async getAllBills(): Promise<Bill[]> {
      const { data, error } = await supabase.from('bills').select('*');
      if (error) {
          console.error("Error fetching all bills:", error);
          return [];
      }
      return (data || []).map(b => ({...b, orderId: b.order_id, userId: b.user_id, customerName: b.customer_name, totalCost: b.total_cost, timestamp: new Date(b.timestamp)})) as Bill[];
  },

  async placeOrder(items: OrderItem[], user: User): Promise<Order> {
    const newOrderForDb = {
      id: `ORD-${Date.now()}`,
      user_id: user.id,
      customer_name: user.name,
      items: items,
      is_billed: false,
    };
    const { error } = await supabase.from('orders').insert(newOrderForDb);
    if (error) console.error("Error placing order:", error);
    
    // Return an object that matches our app's 'Order' type
    return { ...newOrderForDb, userId: user.id, customerName: user.name, isBilled: false, timestamp: new Date() };
  },
  
  async createBill(order: Order): Promise<Bill> {
    const prices = await this.getVegetablePrices();
    const billItems: BillItem[] = order.items.map(item => {
        const pricePerKg = prices[item.vegetable.id] || 0;
        return { ...item, pricePerKg, totalPrice: item.quantity * pricePerKg };
    });
    const totalCost = billItems.reduce((sum, item) => sum + item.totalPrice, 0);

    const newBillForDb = {
      id: `BILL-${order.id}`,
      order_id: order.id,
      user_id: order.userId,
      customer_name: order.customerName,
      items: billItems,
      total_cost: totalCost,
    };
    
    // Create the bill and update the order in a single transaction if possible,
    // or as two separate calls.
    const { error: billError } = await supabase.from('bills').insert(newBillForDb);
    if (billError) console.error("Error creating bill:", billError);

    const { error: orderUpdateError } = await supabase.from('orders').update({ is_billed: true }).eq('id', order.id);
    if(orderUpdateError) console.error("Error updating order:", orderUpdateError);
    
    // Return an object that matches our app's 'Bill' type
    return { ...newBillForDb, orderId: order.id, userId: order.userId, customerName: order.customerName, totalCost, timestamp: new Date() };
  }
};
