// The new and improved api.ts
import { Vegetable, Order, Bill, User, UserRole, OrderItem, BillItem } from './types.ts';
import { VEGETABLES } from './constants.ts';
import { supabase } from './supabaseClient.ts';

const MOCK_USERS: User[] = [
  { id: 'seller-001', name: 'Seller', mobile: '0000000000', role: UserRole.SELLER }
];

const FAKE_DELAY = 200;
const withDelay = <T>(data: T): Promise<T> =>
  new Promise(resolve => setTimeout(() => resolve(data), FAKE_DELAY));

export const api = {
  async login(name: string, mobile: string, role: UserRole): Promise<User | null> {
    let user = MOCK_USERS.find(u => u.mobile === mobile && u.name.toLowerCase() === name.toLowerCase());
    
    if (!user && role === UserRole.CUSTOMER) {
      user = { id: `CUST-${mobile}`, name, mobile, role };
    }
    
    return user && user.role === role ? withDelay(user) : withDelay(null);
  },

  async getVegetables(): Promise<Vegetable[]> {
    const { data, error } = await supabase.from('vegetables').select('*');
    if (error) console.error("Error fetching vegetables:", error);
    if (data && data.length > 0) return data;
    
    // If the table is empty, populate it with default values
    await supabase.from('vegetables').insert(VEGETABLES);
    return VEGETABLES;
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
    if (error) console.error("Error fetching prices:", error);
    return (data || []).reduce((acc, item) => {
        acc[item.vegetable_id] = item.price;
        return acc;
    }, {} as Record<string, number>);
  },

  async setVegetablePrice(vegId: string, price: number): Promise<void> {
    const { error } = await supabase.from('vegetable_prices').upsert({ vegetable_id: vegId, price });
    if (error) console.error("Error setting price:", error);
  },

  async getOrdersForUser(userId: string): Promise<Order[]> {
    const { data, error } = await supabase.from('orders').select('*').eq('user_id', userId);
    if (error) console.error("Error fetching user orders:", error);
    return (data || []).map(o => ({...o, timestamp: new Date(o.timestamp)})) as Order[];
  },

  async getAllOrders(): Promise<Order[]> {
    const { data, error } = await supabase.from('orders').select('*');
    if (error) console.error("Error fetching all orders:", error);
    return (data || []).map(o => ({...o, timestamp: new Date(o.timestamp)})) as Order[];
  },
  
  async getBillsForUser(userId: string): Promise<Bill[]> {
    const { data, error } = await supabase.from('bills').select('*').eq('user_id', userId);
    if (error) console.error("Error fetching user bills:", error);
    return (data || []).map(b => ({...b, timestamp: new Date(b.timestamp)})) as Bill[];
  },

  async getAllBills(): Promise<Bill[]> {
      const { data, error } = await supabase.from('bills').select('*');
      if (error) console.error("Error fetching all bills:", error);
      return (data || []).map(b => ({...b, timestamp: new Date(b.timestamp)})) as Bill[];
  },

  async placeOrder(items: OrderItem[], user: User): Promise<Order> {
    const newOrder = {
      id: `ORD-${Date.now()}`,
      user_id: user.id,
      customer_name: user.name,
      items: items,
      is_billed: false,
    };
    const { error } = await supabase.from('orders').insert(newOrder);
    if (error) console.error("Error placing order:", error);
    return { ...newOrder, userId: user.id, customerName: user.name, isBilled: false, timestamp: new Date() };
  },
  
  async createBill(order: Order): Promise<Bill> {
    const prices = await this.getVegetablePrices();
    const billItems: BillItem[] = order.items.map(item => {
        const pricePerKg = prices[item.vegetable.id] || 0;
        return { ...item, pricePerKg, totalPrice: item.quantity * pricePerKg };
    });
    const totalCost = billItems.reduce((sum, item) => sum + item.totalPrice, 0);

    const newBill = {
      id: `BILL-${order.id}`,
      order_id: order.id,
      user_id: order.userId,
      customer_name: order.customerName,
      items: billItems,
      total_cost: totalCost,
    };
    
    await supabase.from('bills').insert(newBill);
    await supabase.from('orders').update({ is_billed: true }).eq('id', order.id);
    
    return { ...newBill, orderId: order.id, userId: order.userId, customerName: order.customerName, totalCost, timestamp: new Date() };
  }
};
